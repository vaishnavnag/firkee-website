/* ==========================================================================
   FIRKEE — AI Process Control Page JS
   Multi-line live dashboard animations
   ========================================================================== */

(function () {
  'use strict';

  var STAGE_NAMES = ['Cut', 'Last', 'Stitch', 'QC', 'Pack'];
  var STAGE_ICONS = [
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 5h14M3 10h10M3 15h6"/><path d="M16 12l2 2-2 2"/></svg>',
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="13" rx="6" ry="3"/><path d="M4 13V9c0-2 2.5-4 6-4s6 2 6 4v4"/></svg>',
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 10 Q7 6 10 10 Q13 14 16 10" stroke-dasharray="2 2"/><circle cx="4" cy="10" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.5"/></svg>',
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M7 10l2 2 4-4"/></svg>',
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="9" width="14" height="9" rx="1"/><path d="M7 9V7a3 3 0 016 0v2"/></svg>'
  ];

  var LINE_NAMES = ['PRODUCTION LINE 1', 'PRODUCTION LINE 2', 'PRODUCTION LINE 3', 'PRODUCTION LINE 4'];
  var LINE_ALERTS = [
    [
      { stage: 1, msg: 'Lasting gap detected — pair #2031 flagged', type: 'warn' },
      { stage: 3, msg: 'QC passed — batch 2020–2040 cleared', type: 'ok' },
    ],
    [
      { stage: 2, msg: 'Stitch tension variance — re-check initiated', type: 'warn' },
      { stage: 4, msg: 'Batch 1040–1060 cleared — ready for dispatch', type: 'ok' },
    ],
    [
      { stage: 3, msg: 'AQL 2.5 check passed — all pairs cleared', type: 'ok' },
      { stage: 0, msg: 'Pattern alignment ±0.3mm — within tolerance', type: 'ok' },
    ],
    [
      { stage: 4, msg: 'Size assortment verified — carton sealed', type: 'ok' },
      { stage: 2, msg: 'Thread colour delta flagged — supervisor notified', type: 'warn' },
    ],
  ];

  function rand(a, b) { return Math.round((Math.random() * (b - a) + a) * 10) / 10; }
  function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  /* -----------------------------------------------------------------------
     HERO MINI DASHBOARD (compact rows)
  ----------------------------------------------------------------------- */
  function buildHeroLine(lineIdx) {
    var el = document.createElement('div');
    el.className = 'mld-line';
    el.id = 'mldLine' + lineIdx;

    var stagesHtml = STAGE_NAMES.map(function (name, i) {
      return '<span class="mld-stage" id="mldStage' + lineIdx + '_' + i + '">' +
               '<span class="mld-stage__dot"></span>' + name +
             '</span>';
    }).join('<span style="flex:1;height:1px;background:rgba(255,255,255,0.06);min-width:4px"></span>');

    el.innerHTML =
      '<span class="mld-line__name">' + LINE_NAMES[lineIdx] + '</span>' +
      '<div class="mld-line__stages">' + stagesHtml + '</div>' +
      '<span class="mld-line__quality" id="mldQ' + lineIdx + '">' + rand(97, 99).toFixed(1) + '%</span>';
    return el;
  }

  var mldContainer = document.getElementById('mldLines');
  if (mldContainer) {
    LINE_NAMES.forEach(function (_, i) {
      mldContainer.appendChild(buildHeroLine(i));
    });
  }

  var heroActiveStage = [0, 1, 2, 3];

  function tickHeroLine(lineIdx) {
    var prev = (heroActiveStage[lineIdx] - 1 + STAGE_NAMES.length) % STAGE_NAMES.length;
    var setStage = function (idx, cls) {
      var el = document.getElementById('mldStage' + lineIdx + '_' + idx);
      if (el) el.className = 'mld-stage' + (cls ? ' mld-stage--' + cls : '');
    };
    setStage(prev, '');
    setStage(heroActiveStage[lineIdx], 'scan');

    setTimeout(function () {
      var isWarn = Math.random() < 0.12;
      setStage(heroActiveStage[lineIdx], isWarn ? 'warn' : 'ok');
      var qEl = document.getElementById('mldQ' + lineIdx);
      if (qEl) qEl.textContent = rand(97.1, 99.2).toFixed(1) + '%';
      heroActiveStage[lineIdx] = (heroActiveStage[lineIdx] + 1) % STAGE_NAMES.length;
    }, 800);
  }

  // Stagger line ticks
  LINE_NAMES.forEach(function (_, i) {
    setTimeout(function () {
      tickHeroLine(i);
      setInterval(function () { tickHeroLine(i); }, 2000 + i * 300);
    }, i * 600);
  });

  /* -----------------------------------------------------------------------
     FULL FLOOR CARDS (Live Floor section)
  ----------------------------------------------------------------------- */
  function buildFloorCard(lineIdx) {
    var card = document.createElement('div');
    card.className = 'floor-card reveal';
    card.id = 'floorCard' + lineIdx;

    var pipelineHtml = STAGE_NAMES.map(function (name, i) {
      var conn = i < STAGE_NAMES.length - 1 ? '<div class="floor-pipeline__conn"></div>' : '';
      return '<div class="floor-stage" id="fStage' + lineIdx + '_' + i + '">' +
               '<div class="floor-stage__icon">' + STAGE_ICONS[i] + '</div>' +
               '<span class="floor-stage__name">' + name + '</span>' +
               '<span class="floor-stage__badge"></span>' +
             '</div>' + conn;
    }).join('');

    var q = rand(97.2, 99.1).toFixed(1);
    var d = rand(0.1, 0.7).toFixed(1);
    var p = randInt(820, 920);

    card.innerHTML =
      '<div class="floor-card__header">' +
        '<span class="floor-card__name">' + LINE_NAMES[lineIdx] + '</span>' +
        '<span class="floor-card__badge floor-card__badge--ok" id="fBadge' + lineIdx + '">RUNNING</span>' +
      '</div>' +
      '<div class="floor-pipeline">' + pipelineHtml + '</div>' +
      '<div class="floor-metrics">' +
        '<div class="floor-metric">' +
          '<span class="floor-metric__val" id="fQ' + lineIdx + '">' + q + '<span style="font-size:0.65em">%</span></span>' +
          '<span class="floor-metric__label">Quality</span>' +
          '<div class="floor-metric__bar"><div class="floor-metric__fill" id="fQBar' + lineIdx + '" style="width:' + q + '%"></div></div>' +
        '</div>' +
        '<div class="floor-metric">' +
          '<span class="floor-metric__val" id="fD' + lineIdx + '">' + d + '<span style="font-size:0.65em">%</span></span>' +
          '<span class="floor-metric__label">Defect Rate</span>' +
          '<div class="floor-metric__bar"><div class="floor-metric__fill floor-metric__fill--warn" id="fDBar' + lineIdx + '" style="width:' + (d * 10) + '%"></div></div>' +
        '</div>' +
        '<div class="floor-metric">' +
          '<span class="floor-metric__val" id="fP' + lineIdx + '">' + p + '</span>' +
          '<span class="floor-metric__label">Pairs / hr</span>' +
          '<div class="floor-metric__bar"><div class="floor-metric__fill" id="fPBar' + lineIdx + '" style="width:' + ((p - 700) / 300 * 100) + '%"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="floor-alert" id="fAlert' + lineIdx + '"></div>';

    return card;
  }

  var floorGrid = document.getElementById('floorGrid');
  if (floorGrid) {
    LINE_NAMES.forEach(function (_, i) {
      floorGrid.appendChild(buildFloorCard(i));
    });
  }

  var floorActive = [0, 2, 1, 3];
  var floorAlertIdx = [0, 0, 0, 0];

  function setFloorStage(lineIdx, stageIdx, state) {
    var el = document.getElementById('fStage' + lineIdx + '_' + stageIdx);
    if (!el) return;
    el.className = 'floor-stage' + (state ? ' floor-stage--' + state : '');
    var badge = el.querySelector('.floor-stage__badge');
    if (!badge) return;
    if (state === 'ok')   { badge.textContent = '✓'; }
    else if (state === 'scan') { badge.textContent = '⟳'; }
    else if (state === 'warn') { badge.textContent = '!'; }
    else { badge.textContent = ''; }
  }

  function updateFloorMetrics(lineIdx, isWarn) {
    var q = rand(97.1, 99.2);
    var d = rand(0.1, isWarn ? 1.2 : 0.6);
    var p = randInt(820, 920);

    var qEl = document.getElementById('fQ' + lineIdx);
    var dEl = document.getElementById('fD' + lineIdx);
    var pEl = document.getElementById('fP' + lineIdx);
    var qBar = document.getElementById('fQBar' + lineIdx);
    var dBar = document.getElementById('fDBar' + lineIdx);
    var pBar = document.getElementById('fPBar' + lineIdx);
    var badge = document.getElementById('fBadge' + lineIdx);
    var card = document.getElementById('floorCard' + lineIdx);

    if (qEl) qEl.innerHTML = q.toFixed(1) + '<span style="font-size:0.65em">%</span>';
    if (dEl) dEl.innerHTML = d.toFixed(1) + '<span style="font-size:0.65em">%</span>';
    if (pEl) pEl.textContent = p;
    if (qBar) qBar.style.width = q + '%';
    if (dBar) dBar.style.width = (d * 10) + '%';
    if (pBar) pBar.style.width = ((p - 700) / 300 * 100) + '%';

    if (badge && card) {
      if (isWarn) {
        badge.className = 'floor-card__badge floor-card__badge--warn';
        badge.textContent = 'FLAG';
        card.classList.add('floor-card--alert');
      } else {
        badge.className = 'floor-card__badge floor-card__badge--ok';
        badge.textContent = 'RUNNING';
        card.classList.remove('floor-card--alert');
      }
    }
  }

  function showFloorAlert(lineIdx, isWarn) {
    var alerts = LINE_ALERTS[lineIdx];
    var a = alerts[floorAlertIdx[lineIdx] % alerts.length];
    floorAlertIdx[lineIdx]++;
    var el = document.getElementById('fAlert' + lineIdx);
    if (!el) return;
    var useWarn = isWarn || a.type === 'warn';
    el.className = 'floor-alert floor-alert--' + (useWarn ? 'warn' : 'ok') + ' floor-alert--visible';
    el.innerHTML = (useWarn ? '⚠ ' : '✓ ') + a.msg;
    setTimeout(function () { el.className = 'floor-alert'; }, 3800);
  }

  function tickFloorCard(lineIdx) {
    var prev = (floorActive[lineIdx] - 1 + STAGE_NAMES.length) % STAGE_NAMES.length;
    setFloorStage(lineIdx, prev, '');
    setFloorStage(lineIdx, floorActive[lineIdx], 'scan');

    setTimeout(function () {
      var isWarn = Math.random() < 0.18;
      setFloorStage(lineIdx, floorActive[lineIdx], isWarn ? 'warn' : 'ok');
      updateFloorMetrics(lineIdx, isWarn);
      if (floorActive[lineIdx] % 2 === 0) showFloorAlert(lineIdx, isWarn);
      floorActive[lineIdx] = (floorActive[lineIdx] + 1) % STAGE_NAMES.length;
    }, 900);
  }

  // Start floor cards when scrolled into view
  var floorStarted = false;
  if (floorGrid && 'IntersectionObserver' in window) {
    var floorObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !floorStarted) {
        floorStarted = true;
        floorObs.disconnect();
        LINE_NAMES.forEach(function (_, i) {
          setTimeout(function () {
            tickFloorCard(i);
            setInterval(function () { tickFloorCard(i); }, 2400 + i * 200);
          }, i * 500);
        });
      }
    }, { threshold: 0.2 });
    floorObs.observe(floorGrid);
  }

})();
