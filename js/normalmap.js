/* ==========================================================================
   Normal Map Lighting Effect
   Generates a normal map from an image using Sobel filter,
   then uses WebGL to simulate real-time lighting based on mouse position.
   ========================================================================== */

(function () {
  'use strict';

  const VERT = `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    varying vec2 v_uv;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_uv = a_uv;
    }
  `;

  const FRAG = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    uniform sampler2D u_normalmap;
    uniform vec2 u_light;      // light position in 0..1 space
    uniform float u_strength;  // normal map strength
    uniform float u_ambient;   // ambient light level
    uniform float u_specular;  // specular intensity
    uniform float u_shine;     // specular shininess

    void main() {
      vec4 color = texture2D(u_texture, v_uv);
      vec3 nm    = texture2D(u_normalmap, v_uv).rgb * 2.0 - 1.0;
      nm.xy     *= u_strength;
      vec3 normal = normalize(nm);

      // Light direction from mouse position
      vec3 lightDir = normalize(vec3(u_light * 2.0 - 1.0, 0.6));

      // Diffuse
      float diffuse = max(dot(normal, lightDir), 0.0);

      // Specular (Blinn-Phong)
      vec3 viewDir  = vec3(0.0, 0.0, 1.0);
      vec3 halfDir  = normalize(lightDir + viewDir);
      float spec    = pow(max(dot(normal, halfDir), 0.0), u_shine);

      float light = u_ambient + (1.0 - u_ambient) * diffuse;
      vec3 lit    = color.rgb * light + vec3(spec * u_specular);

      gl_FragColor = vec4(lit, color.a);
    }
  `;

  function createShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function createProgram(gl) {
    const p = gl.createProgram();
    gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    return p;
  }

  function makeTexture(gl, imgOrData, width, height) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (imgOrData instanceof HTMLImageElement) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgOrData);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imgOrData);
    }
    return tex;
  }

  // Sobel filter → normal map
  function generateNormalMap(img, strength) {
    const w = img.naturalWidth  || img.width;
    const h = img.naturalHeight || img.height;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const ctx = off.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const src = ctx.getImageData(0, 0, w, h).data;

    // Grayscale
    const gray = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      gray[i] = (src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114) / 255;
    }

    const out = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const s = (row, col) => {
          const rx = Math.min(Math.max(x + col, 0), w - 1);
          const ry = Math.min(Math.max(y + row, 0), h - 1);
          return gray[ry * w + rx];
        };
        // Sobel
        const gx = -s(-1,-1) - 2*s(0,-1) - s(1,-1) + s(-1,1) + 2*s(0,1) + s(1,1);
        const gy = -s(-1,-1) - 2*s(-1,0) - s(-1,1) + s(1,-1) + 2*s(1,0) + s(1,1);
        // Scale and encode to 0-255
        const nx = gx * strength;
        const ny = gy * strength;
        const len = Math.sqrt(nx*nx + ny*ny + 1);
        const i = (y * w + x) * 4;
        out[i]     = Math.round((nx / len * 0.5 + 0.5) * 255);
        out[i + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
        out[i + 2] = Math.round((1  / len * 0.5 + 0.5) * 255);
        out[i + 3] = 255;
      }
    }
    return { data: out, width: w, height: h };
  }

  class NormalMapEffect {
    constructor(container, options) {
      this.container  = container;
      this.img        = container.querySelector('img');
      this.opts = Object.assign({
        strength:  3.5,   // normal map edge strength
        ambient:   0.40,  // base light level
        specular:  0.65,  // specular highlight intensity
        shine:     16,    // specular shininess
        lerp:      0.08,  // mouse follow smoothness
      }, options);

      this.lx = 0.5; this.ly = 0.5;  // current light pos
      this.tx = 0.5; this.ty = 0.5;  // target light pos
      this.raf = null;
      this.active = false;

      if (!this.img) return;
      this._load();
    }

    _load() {
      const img = this.img;
      const go = () => this._setup();
      if (img.complete && img.naturalWidth) { go(); }
      else { img.addEventListener('load', go, { once: true }); }
    }

    _setup() {
      const img   = this.img;
      const w     = img.naturalWidth  || img.offsetWidth  || 400;
      const h     = img.naturalHeight || img.offsetHeight || 300;

      // Canvas overlay
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.style.cssText = `
        position:absolute; inset:0; width:100%; height:100%;
        pointer-events:none; display:block; z-index:0;
      `;

      // Make container relative
      const cs = getComputedStyle(this.container);
      if (cs.position === 'static') this.container.style.position = 'relative';
      this.container.appendChild(canvas);

      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) { canvas.remove(); return; }
      this.gl = gl;
      this.canvas = canvas;

      const prog = createProgram(gl);
      gl.useProgram(prog);
      this.prog = prog;

      // Full-screen quad
      const verts = new Float32Array([-1,-1,0,1, 1,-1,1,1, -1,1,0,0, 1,1,1,0]);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

      const aPos = gl.getAttribLocation(prog, 'a_position');
      const aUV  = gl.getAttribLocation(prog, 'a_uv');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(aUV);
      gl.vertexAttribPointer(aUV,  2, gl.FLOAT, false, 16, 8);

      // Textures
      img.crossOrigin = 'anonymous';
      this.texImg = makeTexture(gl, img);
      const nm = generateNormalMap(img, this.opts.strength);
      this.texNM = makeTexture(gl, nm.data, nm.width, nm.height);

      // Uniforms
      gl.uniform1i(gl.getUniformLocation(prog, 'u_texture'),   0);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_normalmap'),  1);
      gl.uniform1f(gl.getUniformLocation(prog, 'u_strength'),  1.0);
      gl.uniform1f(gl.getUniformLocation(prog, 'u_ambient'),   this.opts.ambient);
      gl.uniform1f(gl.getUniformLocation(prog, 'u_specular'),  this.opts.specular);
      gl.uniform1f(gl.getUniformLocation(prog, 'u_shine'),     this.opts.shine);
      this.uLight = gl.getUniformLocation(prog, 'u_light');

      this._bindEvents();
      this._render();
    }

    _bindEvents() {
      const el = this.container;
      el.addEventListener('mouseenter', () => { this.active = true; });
      el.addEventListener('mouseleave', () => {
        this.active = false;
        this.tx = 0.5; this.ty = 0.5;
      });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        this.tx = (e.clientX - r.left) / r.width;
        this.ty = (e.clientY - r.top)  / r.height;
      });
      // Touch support
      el.addEventListener('touchmove', (e) => {
        const r = el.getBoundingClientRect();
        const t = e.touches[0];
        this.tx = (t.clientX - r.left) / r.width;
        this.ty = (t.clientY - r.top)  / r.height;
      }, { passive: true });
    }

    _render() {
      const gl = this.gl;
      if (!gl) return;

      // Lerp light position
      this.lx += (this.tx - this.lx) * this.opts.lerp;
      this.ly += (this.ty - this.ly) * this.opts.lerp;

      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texImg);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.texNM);
      gl.uniform2f(this.uLight, this.lx, 1.0 - this.ly);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      this.raf = requestAnimationFrame(() => this._render());
    }

    destroy() {
      cancelAnimationFrame(this.raf);
      if (this.canvas) this.canvas.remove();
    }
  }

  // Auto-init on all elements with data-normalmap attribute
  function init() {
    document.querySelectorAll('[data-normalmap]').forEach(el => {
      if (el._nmEffect) return;
      const opts = {};
      if (el.dataset.nmStrength)  opts.strength  = parseFloat(el.dataset.nmStrength);
      if (el.dataset.nmAmbient)   opts.ambient   = parseFloat(el.dataset.nmAmbient);
      if (el.dataset.nmSpecular)  opts.specular  = parseFloat(el.dataset.nmSpecular);
      if (el.dataset.nmShine)     opts.shine     = parseFloat(el.dataset.nmShine);
      el._nmEffect = new NormalMapEffect(el, opts);
    });
  }

  // Expose
  window.NormalMapEffect = NormalMapEffect;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
