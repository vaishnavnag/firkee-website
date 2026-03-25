/* ==========================================================================
   FIRKEE ACCESSORIES — Portfolio Page JavaScript
   Filter tabs, masonry card animations, sticky filter bar
   ========================================================================== */

(function () {
  'use strict';

  var filterBar = document.getElementById('filterBar');
  var tabs = document.querySelectorAll('.filter-bar__tab');
  var cards = document.querySelectorAll('.portfolio-card');
  var activeFilter = 'all';

  // --- Filter Functionality ---
  function initFilters() {
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = this.dataset.filter;
        if (filter === activeFilter) return;

        // Update active tab
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
        });
        this.classList.add('is-active');

        activeFilter = filter;
        filterCards(filter);
      });
    });
  }

  function filterCards(filter) {
    var showDelay = 0;

    cards.forEach(function (card) {
      var category = card.dataset.category;
      var shouldShow = filter === 'all' || category === filter;

      if (!shouldShow && !card.classList.contains('is-hidden')) {
        // Hide the card
        card.classList.add('is-hiding');
        card.classList.remove('is-showing');

        setTimeout(function () {
          card.classList.add('is-hidden');
          card.classList.remove('is-hiding');
        }, 300);
      } else if (shouldShow && card.classList.contains('is-hidden')) {
        // Show the card with staggered delay
        (function (c, delay) {
          setTimeout(function () {
            c.classList.remove('is-hidden');
            c.classList.add('is-showing');

            // Clean up animation class after it finishes
            setTimeout(function () {
              c.classList.remove('is-showing');
            }, 500);
          }, delay);
        })(card, showDelay);

        showDelay += 60;
      } else if (shouldShow && card.classList.contains('is-hiding')) {
        // Card is in the process of hiding but should stay visible
        card.classList.remove('is-hiding');
      }
    });
  }

  // --- Sticky Filter Bar Shadow ---
  function initStickyDetection() {
    if (!filterBar) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // When the sentinel goes out of view, the filter bar is stuck
          filterBar.classList.toggle('is-stuck', !entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '-' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72) + 'px 0px 0px 0px'
      }
    );

    // Create a sentinel element just above the filter bar
    var sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    sentinel.setAttribute('aria-hidden', 'true');
    filterBar.parentNode.insertBefore(sentinel, filterBar);
    observer.observe(sentinel);
  }

  // --- Initialize ---
  function init() {
    initFilters();
    initStickyDetection();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
