/* ── Firkee Font Switcher — hero title only ── */
(function () {
  const FONTS = [
    { label: 'Cormorant',    family: 'Cormorant Garamond',  gfamily: 'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400' },
    { label: 'Playfair',     family: 'Playfair Display',    gfamily: 'Playfair+Display:ital,wght@0,400;0,700;1,400;1,700' },
    { label: 'Fraunces',     family: 'Fraunces',            gfamily: 'Fraunces:ital,wght@0,300;0,400;1,300;1,400' },
    { label: 'DM Serif',     family: 'DM Serif Display',    gfamily: 'DM+Serif+Display:ital@0;1' },
    { label: 'Bodoni',       family: 'Bodoni Moda',         gfamily: 'Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700' },
    { label: 'Libre',        family: 'Libre Baskerville',   gfamily: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400' },
    { label: 'Lora',         family: 'Lora',                gfamily: 'Lora:ital,wght@0,400;0,600;1,400;1,600' },
    { label: 'Abril',        family: 'Abril Fatface',       gfamily: 'Abril+Fatface' },
    { label: 'Yeseva',       family: 'Yeseva One',          gfamily: 'Yeseva+One' },
    { label: 'Rozha',        family: 'Rozha One',           gfamily: 'Rozha+One' },
    { label: 'Raleway',      family: 'Raleway',             gfamily: 'Raleway:ital,wght@0,200;0,300;1,200;1,300' },
    { label: 'Josefin',      family: 'Josefin Sans',        gfamily: 'Josefin+Sans:ital,wght@0,200;0,300;1,200;1,300' },
    { label: 'Outfit',       family: 'Outfit',              gfamily: 'Outfit:wght@200;300;400' },
    { label: 'Italiana',     family: 'Italiana',            gfamily: 'Italiana' },
    { label: 'Cinzel',       family: 'Cinzel',              gfamily: 'Cinzel:wght@400;600' },
    { label: 'Uncial',       family: 'Uncial Antiqua',      gfamily: 'Uncial+Antiqua' },
    { label: 'Spectral',     family: 'Spectral',            gfamily: 'Spectral:ital,wght@0,300;0,400;1,300;1,400' },
    { label: 'Gloock',       family: 'Gloock',              gfamily: 'Gloock' },
  ];

  const STORAGE_KEY = 'firkee_hero_font';

  function loadFont(gfamily) {
    const id = 'gf-' + gfamily.replace(/\+/g, '-').replace(/:/g, '_');
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${gfamily}&display=swap`;
    document.head.appendChild(link);
  }

  function applyFont(index) {
    const font = FONTS[index];
    if (!font) return;
    loadFont(font.gfamily);
    document.querySelectorAll('.hero__title, .hero__sub').forEach(el => {
      el.style.fontFamily = `'${font.family}', Georgia, serif`;
    });
    localStorage.setItem(STORAGE_KEY, index);
    document.querySelectorAll('.ffs-btn').forEach(btn => {
      btn.classList.toggle('ffs-active', parseInt(btn.dataset.index) === index);
    });
  }

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'firkee-font-switcher';
    panel.innerHTML = `
      <div class="ffs-label">Hero Font</div>
      <div class="ffs-buttons">
        ${FONTS.map((f, i) => `
          <button class="ffs-btn" data-index="${i}" style="font-family:'${f.family}',Georgia,serif">
            ${f.label}
          </button>
        `).join('')}
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #firkee-font-switcher {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        background: rgba(10,10,10,0.93);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 14px;
        padding: 12px 14px;
        color: #ccc;
        user-select: none;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        max-height: 80vh;
        overflow-y: auto;
      }
      #firkee-font-switcher::-webkit-scrollbar { width: 4px; }
      #firkee-font-switcher::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      .ffs-label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 9px;
        font-family: 'Outfit', sans-serif;
        color: #555;
        margin-bottom: 10px;
      }
      .ffs-buttons { display: flex; flex-direction: column; gap: 5px; }
      .ffs-btn {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        padding: 7px 12px;
        cursor: pointer;
        color: #aaa;
        font-size: 14px;
        text-align: left;
        transition: all 0.15s;
        width: 100%;
      }
      .ffs-btn:hover { background: rgba(255,255,255,0.09); color: #fff; }
      .ffs-btn.ffs-active {
        border-color: rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.11);
        color: #fff;
      }
    `;

    document.head.appendChild(style);
    document.documentElement.appendChild(panel);

    // Pre-load all fonts
    FONTS.forEach(f => loadFont(f.gfamily));

    panel.querySelectorAll('.ffs-btn').forEach(btn => {
      btn.addEventListener('click', () => applyFont(parseInt(btn.dataset.index)));
    });
  }

  function init() {
    buildPanel();
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0');
    applyFont(isNaN(saved) ? 0 : saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
