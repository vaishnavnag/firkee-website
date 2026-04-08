/* ==========================================================================
   3D Tilt + Shine for image cards  |  Parallax for hero background
   ========================================================================== */

(function () {
  'use strict';

  const TILT_MAX  = 15;   // max rotation degrees
  const PERSP     = 900;  // perspective (px)
  const TILT_LERP = 0.10; // card tilt smoothness
  const PAR_LERP  = 0.04; // hero parallax smoothness
  const PAR_X     = 22;   // max horizontal parallax shift (px)
  const PAR_Y     = 14;   // max vertical parallax shift (px)

  /* ── Tilt + shine for image cards ─────────────────────────────────────── */
  class TiltEffect {
    constructor(el) {
      this.el = el;
      this.tx = 0; this.ty = 0;
      this.cx = 0; this.cy = 0;
      this.hovering = false;
      this.raf = null;

      const cs = getComputedStyle(el);
      if (cs.position === 'static') el.style.position = 'relative';

      this.shine = document.createElement('div');
      this.shine.style.cssText =
        'position:absolute;inset:0;pointer-events:none;opacity:0;' +
        'transition:opacity 0.35s;z-index:10;border-radius:inherit;';
      el.appendChild(this.shine);

      el.addEventListener('mouseenter', () => { this.hovering = true; this._start(); });
      el.addEventListener('mouseleave', () => {
        this.hovering = false;
        this.tx = 0; this.ty = 0;
        this.shine.style.opacity = '0';
      });
      el.addEventListener('mousemove', e => this._onMove(e));
    }

    _onMove(e) {
      const r  = this.el.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width;
      const y  = (e.clientY - r.top)  / r.height;
      this.tx  =  (x - 0.5) * TILT_MAX * 2;
      this.ty  = -(y - 0.5) * TILT_MAX * 2;
      this.shine.style.background =
        `radial-gradient(circle at ${x * 100}% ${y * 100}%, ` +
        `rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 55%)`;
      this.shine.style.opacity = '1';
    }

    _start() {
      if (this.raf) return;
      this._tick();
    }

    _tick() {
      this.cx += (this.tx - this.cx) * TILT_LERP;
      this.cy += (this.ty - this.cy) * TILT_LERP;

      const done = !this.hovering && Math.abs(this.cx) < 0.05 && Math.abs(this.cy) < 0.05;
      if (done) {
        this.cx = 0; this.cy = 0;
        this.el.style.transform = '';
        this.raf = null;
        return;
      }

      const scale = this.hovering ? 1.05 : 1;
      this.el.style.transform =
        `perspective(${PERSP}px) rotateY(${this.cx}deg) rotateX(${this.cy}deg) scale(${scale})`;
      this.raf = requestAnimationFrame(() => this._tick());
    }

    destroy() {
      cancelAnimationFrame(this.raf);
      this.shine.remove();
    }
  }

  /* ── Hero background parallax ──────────────────────────────────────────── */
  class HeroParallax {
    constructor(el) {
      this.bg = el.querySelector('.hero__bg-img');
      this.tx = 0; this.ty = 0;
      this.cx = 0; this.cy = 0;
      this._tick();

      window.addEventListener('mousemove', e => {
        this.tx = (e.clientX / window.innerWidth  - 0.5) * -PAR_X * 2;
        this.ty = (e.clientY / window.innerHeight - 0.5) * -PAR_Y * 2;
      });
    }

    _tick() {
      this.cx += (this.tx - this.cx) * PAR_LERP;
      this.cy += (this.ty - this.cy) * PAR_LERP;
      if (this.bg) {
        this.bg.style.transform =
          `scale(1.12) translate(${this.cx}px, ${this.cy}px)`;
      }
      requestAnimationFrame(() => this._tick());
    }
  }

  /* ── Auto-init ─────────────────────────────────────────────────────────── */
  function init() {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      if (el._tiltFx) return;
      el._tiltFx = new TiltEffect(el);
    });
    document.querySelectorAll('[data-hero-parallax]').forEach(el => {
      if (el._heroPar) return;
      el._heroPar = new HeroParallax(el);
    });
  }

  window.TiltEffect    = TiltEffect;
  window.HeroParallax  = HeroParallax;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
