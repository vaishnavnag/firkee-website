const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const LOGOS_DIR = path.resolve(__dirname, '..', 'assets', 'logos');

const brands = [
  { name: "zara", file: "zara.png", url: "https://www.zara.com", selectors: ["header svg", "header a img", "a.logo img", ".header-logo img", "header a:first-child"] },
  { name: "steve-madden", file: "steve-madden.png", url: "https://www.stevemadden.com", selectors: ["a.logo img", "header a img", ".header-logo img", "header svg", ".site-header img", ".header__logo img"] },
  { name: "dune-london", file: "dune-london.png", url: "https://www.dunelondon.com", selectors: ["a.logo img", "header a img", ".header-logo img", "header svg", ".site-header img", ".header__logo img"] },
  { name: "bata", file: "bata.png", url: "https://www.bata.com", selectors: ["a.logo img", "header a img", ".header-logo img", "header svg", "img[alt*=Bata]", "img[alt*=bata]"] },
  { name: "westside", file: "westside.png", url: "https://www.tatacliq.com/westside", fallbackUrl: "https://www.westside.com", selectors: ["a.logo img", "header a img", ".header-logo img", "header svg", "img[alt*=Westside]", ".site-header img"] },
  { name: "reliance", file: "reliance.png", url: "https://www.relianceretail.com", selectors: ["a.logo img", "header a img", ".header-logo img", "header svg", "img[alt*=Reliance]", ".navbar-brand img"] },
];

function createSvgFallback(brandName, filePath) {
  const displayName = brandName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" viewBox="0 0 300 80">' +
    '<rect width="300" height="80" fill="#fff" rx="4"/>' +
    '<text x="150" y="48" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="bold" fill="#1a1a1a" text-anchor="middle" letter-spacing="4">' +
    displayName.toUpperCase() + '</text></svg>';
  const svgPath = filePath.replace('.png', '.svg');
  fs.writeFileSync(svgPath, svg);
  console.log('  [FALLBACK] Created SVG: ' + svgPath);
  return svgPath;
}

async function downloadLogo(browser, brand) {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  });
  await context.route('**/*.{mp4,webm,ogg,avi,flv,wmv}', r => r.abort());
  const page = await context.newPage();
  const outputPath = path.join(LOGOS_DIR, brand.file);
  const urls = [brand.url];
  if (brand.fallbackUrl) urls.push(brand.fallbackUrl);

  for (const url of urls) {
    console.log('\n[' + brand.name + '] Trying ' + url + '...');
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000);

      let logoEl = null;
      for (const sel of brand.selectors) {
        try {
          const el = await page.$(sel);
          if (el) {
            const box = await el.boundingBox();
            if (box && box.width > 10 && box.height > 10) {
              logoEl = el;
              console.log('  Found logo: "' + sel + '" (' + Math.round(box.width) + 'x' + Math.round(box.height) + ')');
              break;
            }
          }
        } catch (e) {}
      }

      if (logoEl) {
        await logoEl.screenshot({ path: outputPath, type: 'png' });
        console.log('  Saved logo to ' + outputPath);
        await context.close();
        return true;
      }

      console.log('  No logo element found, trying header crop...');
      const header = await page.$('header');
      if (header) {
        const hb = await header.boundingBox();
        if (hb) {
          await page.screenshot({
            path: outputPath, type: 'png',
            clip: { x: hb.x, y: hb.y, width: Math.min(hb.width * 0.3, 400), height: Math.min(hb.height, 100) }
          });
          console.log('  Saved header-crop to ' + outputPath);
          await context.close();
          return true;
        }
      }

      console.log('  Using top-left page crop...');
      await page.screenshot({ path: outputPath, type: 'png', clip: { x: 0, y: 0, width: 350, height: 100 } });
      console.log('  Saved page-crop to ' + outputPath);
      await context.close();
      return true;
    } catch (err) {
      console.log('  Error: ' + err.message);
    }
  }
  await context.close();
  return false;
}

async function main() {
  console.log('=== Firkee Accessories - Brand Logo Downloader ===\n');
  console.log('Output directory: ' + LOGOS_DIR + '\n');
  fs.mkdirSync(LOGOS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = { success: [], failed: [] };

  for (const brand of brands) {
    try {
      const ok = await downloadLogo(browser, brand);
      if (ok) { results.success.push(brand.name); }
      else { results.failed.push(brand.name); }
    } catch (err) {
      console.log('  [ERROR] ' + brand.name + ': ' + err.message);
      results.failed.push(brand.name);
    }
  }

  await browser.close();

  console.log('\n=== Creating SVG fallbacks for failed downloads ===');
  for (const brandName of results.failed) {
    const brand = brands.find(b => b.name === brandName);
    createSvgFallback(brand.name, path.join(LOGOS_DIR, brand.file));
  }

  console.log('\n=== Verifying all logos exist ===');
  for (const brand of brands) {
    const pngPath = path.join(LOGOS_DIR, brand.file);
    const svgPath = pngPath.replace('.png', '.svg');
    const pngExists = fs.existsSync(pngPath);
    const svgExists = fs.existsSync(svgPath);
    if (pngExists) {
      const stats = fs.statSync(pngPath);
      console.log('  [OK] ' + brand.file + ' (' + (stats.size / 1024).toFixed(1) + ' KB)');
    } else if (svgExists) {
      console.log('  [OK] ' + brand.name + '.svg (SVG fallback)');
    } else {
      console.log('  [MISSING] ' + brand.file + ' - creating SVG fallback');
      createSvgFallback(brand.name, pngPath);
    }
  }

  console.log('\n=== Summary ===');
  console.log('Downloaded: ' + results.success.length);
  console.log('Fallbacks:  ' + results.failed.length);
  console.log('Total:      ' + (results.success.length + results.failed.length));
  console.log('\nDone!');
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
