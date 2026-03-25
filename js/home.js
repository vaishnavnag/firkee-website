/* ==========================================================================
   FIRKEE ACCESSORIES — Home Page JavaScript
   Parallax hero effect
   ========================================================================== */

(function () {
  'use strict';

  // --- Parallax on Hero (subtle, respects prefers-reduced-motion) ---
  var heroContent = document.querySelector('.hero__content');
  var heroStats = document.querySelector('.hero__stats');

  if (heroContent && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var heroTicking = false;

    window.addEventListener('scroll', function () {
      if (!heroTicking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          var heroHeight = window.innerHeight;

          if (scrollY < heroHeight) {
            var progress = scrollY / heroHeight;
            heroContent.style.transform = 'translateY(' + (progress * 50) + 'px)';
            heroContent.style.opacity = 1 - (progress * 0.7);

            if (heroStats) {
              heroStats.style.transform = 'translateY(' + (progress * 30) + 'px)';
              heroStats.style.opacity = 1 - (progress * 0.8);
            }
          }

          heroTicking = false;
        });
        heroTicking = true;
      }
    }, { passive: true });
  }

})();
