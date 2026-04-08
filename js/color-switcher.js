/* ── Firkee Color Switcher — dev testing only ── */
(function () {
  const OVERRIDE_KEYS = [
    '--color-obsidian','--color-charcoal','--color-graphite','--color-warm-gray',
    '--color-sand','--color-cream','--color-ivory','--color-gold','--color-gold-light',
    '--color-gold-faint','--color-rose','--color-logo','--color-logo-dark'
  ];

  // Green logo kept on all non-original themes
  const GREEN_LOGO = { '--color-logo': '#4CAF50', '--color-logo-dark': '#388E3C' };

  const THEMES = {
    original: {
      label: 'Original',
      swatch: '#4CAF50',
      vars: null
    },
    forest: {
      label: 'Forest',
      swatch: '#3D5A3E',
      vars: {
        '--color-obsidian':   '#0a1f0b',
        '--color-charcoal':   '#152b16',
        '--color-graphite':   '#243f25',
        '--color-warm-gray':  '#4e6650',
        '--color-sand':       '#8fad91',
        '--color-cream':      '#eef6ee',
        '--color-ivory':      '#f5fbf5',
        '--color-gold':       '#3D5A3E',
        '--color-gold-light': '#5a7d5b',
        '--color-gold-faint': 'rgba(61,90,62,0.08)',
        '--color-rose':       '#6a8d6b',
        ...GREEN_LOGO
      }
    },
    terra: {
      label: 'Terra',
      swatch: '#C4794A',
      vars: {
        '--color-obsidian':   '#1a0f07',
        '--color-charcoal':   '#2b1a0e',
        '--color-graphite':   '#3d2a1a',
        '--color-warm-gray':  '#7a5a3e',
        '--color-sand':       '#c4a882',
        '--color-cream':      '#faf4ec',
        '--color-ivory':      '#fdf8f2',
        '--color-gold':       '#C4794A',
        '--color-gold-light': '#d99870',
        '--color-gold-faint': 'rgba(196,121,74,0.08)',
        '--color-rose':       '#d4895a',
        ...GREEN_LOGO
      }
    },
    ivory: {
      label: 'Ivory',
      swatch: '#C4A882',
      vars: {
        '--color-obsidian':   '#1C1410',
        '--color-charcoal':   '#2a1e18',
        '--color-graphite':   '#3a2e26',
        '--color-warm-gray':  '#8a7060',
        '--color-sand':       '#C4A882',
        '--color-cream':      '#F5EDE0',
        '--color-ivory':      '#FDF8F2',
        '--color-gold':       '#B8864E',
        '--color-gold-light': '#D4A870',
        '--color-gold-faint': 'rgba(184,134,78,0.08)',
        '--color-rose':       '#C49A6A',
        ...GREEN_LOGO
      }
    },
    charcoal: {
      label: 'Charcoal',
      swatch: '#141210',
      vars: {
        '--color-obsidian':   '#0a0806',
        '--color-charcoal':   '#141210',
        '--color-graphite':   '#1E1B18',
        '--color-warm-gray':  '#6a5a4e',
        '--color-sand':       '#D4956A',
        '--color-cream':      '#2a2420',
        '--color-ivory':      '#1a1614',
        '--color-gold':       '#D4956A',
        '--color-gold-light': '#E0AA80',
        '--color-gold-faint': 'rgba(212,149,106,0.10)',
        '--color-rose':       '#E0AA80',
        ...GREEN_LOGO
      }
    },
    slate: {
      label: 'Slate',
      swatch: '#1E2430',
      vars: {
        '--color-obsidian':   '#0e1218',
        '--color-charcoal':   '#1E2430',
        '--color-graphite':   '#2a3444',
        '--color-warm-gray':  '#7A8FA6',
        '--color-sand':       '#A8BCCF',
        '--color-cream':      '#EEF2F6',
        '--color-ivory':      '#F4F2EF',
        '--color-gold':       '#5A7A9E',
        '--color-gold-light': '#7A9ABE',
        '--color-gold-faint': 'rgba(90,122,158,0.08)',
        '--color-rose':       '#8AAABE',
        ...GREEN_LOGO
      }
    },
    // ── New themes ──────────────────────────────────────────────
    copper: {
      label: 'Copper',
      swatch: '#C48A3A',
      vars: {
        '--color-obsidian':   '#0f0b06',
        '--color-charcoal':   '#1c1508',
        '--color-graphite':   '#2e2210',
        '--color-warm-gray':  '#7a6040',
        '--color-sand':       '#C8A96A',
        '--color-cream':      '#f7f0e2',
        '--color-ivory':      '#fdf8ee',
        '--color-gold':       '#C48A3A',
        '--color-gold-light': '#DCA85A',
        '--color-gold-faint': 'rgba(196,138,58,0.09)',
        '--color-rose':       '#D4A050',
        ...GREEN_LOGO
      }
    },
    dusk: {
      label: 'Dusk',
      swatch: '#6B3A52',
      vars: {
        '--color-obsidian':   '#12080e',
        '--color-charcoal':   '#1e1018',
        '--color-graphite':   '#2e1a26',
        '--color-warm-gray':  '#8A5A70',
        '--color-sand':       '#C4889E',
        '--color-cream':      '#f7eef2',
        '--color-ivory':      '#fdf5f8',
        '--color-gold':       '#C4607A',
        '--color-gold-light': '#D4809A',
        '--color-gold-faint': 'rgba(196,96,122,0.08)',
        '--color-rose':       '#D47090',
        ...GREEN_LOGO
      }
    },
    sand: {
      label: 'Sand',
      swatch: '#C4A050',
      vars: {
        '--color-obsidian':   '#1a1408',
        '--color-charcoal':   '#2A220E',
        '--color-graphite':   '#3C3218',
        '--color-warm-gray':  '#8A7848',
        '--color-sand':       '#C4A050',
        '--color-cream':      '#F5EDD0',
        '--color-ivory':      '#FDF8EA',
        '--color-gold':       '#B8922A',
        '--color-gold-light': '#D4AE50',
        '--color-gold-faint': 'rgba(184,146,42,0.09)',
        '--color-rose':       '#C8A040',
        ...GREEN_LOGO
      }
    },
    midnight: {
      label: 'Midnight',
      swatch: '#0A0E1A',
      vars: {
        '--color-obsidian':   '#04060e',
        '--color-charcoal':   '#0A0E1A',
        '--color-graphite':   '#141828',
        '--color-warm-gray':  '#4A6A9E',
        '--color-sand':       '#7A9ACE',
        '--color-cream':      '#1c2236',
        '--color-ivory':      '#131726',
        '--color-gold':       '#4A8ACE',
        '--color-gold-light': '#6AAAE0',
        '--color-gold-faint': 'rgba(74,138,206,0.10)',
        '--color-rose':       '#7AAADE',
        ...GREEN_LOGO
      }
    },
    sage: {
      label: 'Sage',
      swatch: '#7A9A6A',
      vars: {
        '--color-obsidian':   '#0e1a0e',
        '--color-charcoal':   '#1e2e1e',
        '--color-graphite':   '#2e422e',
        '--color-warm-gray':  '#7A9A6A',
        '--color-sand':       '#A8C298',
        '--color-cream':      '#EEF4E8',
        '--color-ivory':      '#F5F9F0',
        '--color-gold':       '#5A8A4A',
        '--color-gold-light': '#7AAA6A',
        '--color-gold-faint': 'rgba(90,138,74,0.08)',
        '--color-rose':       '#6A9A5A',
        ...GREEN_LOGO
      }
    },
    stone: {
      label: 'Stone',
      swatch: '#6A6460',
      vars: {
        '--color-obsidian':   '#141210',
        '--color-charcoal':   '#201E1C',
        '--color-graphite':   '#2E2C28',
        '--color-warm-gray':  '#6A6460',
        '--color-sand':       '#A8A49E',
        '--color-cream':      '#EEECEA',
        '--color-ivory':      '#F5F3F0',
        '--color-gold':       '#8A6A50',
        '--color-gold-light': '#AA8A70',
        '--color-gold-faint': 'rgba(138,106,80,0.08)',
        '--color-rose':       '#9A7A60',
        ...GREEN_LOGO
      }
    }
  };

  const STORAGE_KEY = 'firkee_theme';

  function applyTheme(name) {
    const theme = THEMES[name];
    if (!theme) return;
    const root = document.documentElement;
    if (theme.vars === null) {
      OVERRIDE_KEYS.forEach(k => root.style.removeProperty(k));
    } else {
      Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    }
    localStorage.setItem(STORAGE_KEY, name);
    document.querySelectorAll('.fcs-btn').forEach(btn => {
      btn.classList.toggle('fcs-active', btn.dataset.theme === name);
    });
  }

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'firkee-color-switcher';
    panel.innerHTML = `
      <div class="fcs-label">Theme Preview</div>
      <div class="fcs-buttons">
        ${Object.entries(THEMES).map(([key, t]) => `
          <button class="fcs-btn" data-theme="${key}" title="${t.label}">
            <span class="fcs-swatch" style="background:${t.swatch}"></span>
            <span class="fcs-name">${t.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #firkee-color-switcher {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        background: rgba(10,10,10,0.93);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 14px;
        padding: 12px 14px;
        font-family: 'Outfit', sans-serif;
        font-size: 11px;
        color: #ccc;
        user-select: none;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      }
      .fcs-label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 9px;
        color: #555;
        margin-bottom: 10px;
      }
      .fcs-buttons {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .fcs-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        padding: 7px 10px;
        cursor: pointer;
        color: #aaa;
        font-family: inherit;
        font-size: 11px;
        text-align: left;
        transition: all 0.15s;
        width: 100%;
      }
      .fcs-btn:hover { background: rgba(255,255,255,0.09); color: #fff; }
      .fcs-btn.fcs-active {
        border-color: rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.11);
        color: #fff;
      }
      .fcs-swatch {
        display: inline-block;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.15);
        flex-shrink: 0;
      }
    `;

    document.head.appendChild(style);
    document.documentElement.appendChild(panel);

    panel.querySelectorAll('.fcs-btn').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });
  }

  function init() {
    buildPanel();
    const saved = localStorage.getItem(STORAGE_KEY) || 'original';
    applyTheme(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
