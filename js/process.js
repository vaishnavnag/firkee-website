/* ==========================================================================
   FIRKEE ACCESSORIES — Process Page Scripts
   Timeline scroll fill effect, step card reveal animations
   ========================================================================== */

(function () {
  'use strict';

  var timelineFill = document.getElementById('timelineFill');
  var timelineLine = document.getElementById('timelineLine');
  var ticking = false;

  function updateTimelineFill() {
    if (!timelineLine || !timelineFill) return;

    var lineRect = timelineLine.getBoundingClientRect();
    var viewportHeight = window.innerHeight;

    // Calculate how much of the timeline is visible/scrolled past
    var lineTop = lineRect.top;
    var lineHeight = lineRect.height;

    // Fill starts when the top of the line reaches the viewport center
    // and completes when the bottom of the line reaches the viewport center
    var triggerPoint = viewportHeight * 0.5;
    var scrolledPast = triggerPoint - lineTop;
    var fillPercent = Math.max(0, Math.min(1, scrolledPast / lineHeight));

    timelineFill.style.height = (fillPercent * 100) + '%';

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateTimelineFill);
      ticking = true;
    }
  }

  if (timelineLine) {
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculation
    window.addEventListener('load', function () {
      updateTimelineFill();
    });
  }

})();
