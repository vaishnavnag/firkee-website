/* ==========================================================================
   FIRKEE ACCESSORIES — Shared JavaScript
   Nav, mobile menu, reveals, counters, smooth scroll
   Used by all pages
   ========================================================================== */

(function () {
  'use strict';

  // --- Loader ---
  var loader = document.getElementById('loader');

  function hideLoader() {
    if (loader && !loader.classList.contains('is-hidden')) {
      loader.classList.add('is-hidden');
      document.body.style.overflow = '';
      initRevealAnimations();
      initCounters();
    }
  }

  // Hide on load, with a short animation delay
  window.addEventListener('load', function () {
    setTimeout(hideLoader, 800);
  });

  // Safety fallback — always hide after 3s no matter what
  setTimeout(hideLoader, 3000);

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';

  // --- Navigation Scroll Effect ---
  var nav = document.getElementById('nav');
  var ticking = false;

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // --- Mobile Menu ---
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('is-active', isMenuOpen);
    mobileMenu.classList.toggle('is-open', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (mobileMenu) {
    var mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 72;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // --- Reveal on Scroll ---
  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) * 120 : 0;
            setTimeout(function () {
              el.classList.add('is-visible');
            }, delay);
            observer.unobserve(el);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  // Make available globally for page-specific scripts
  window.firkeeInitReveals = initRevealAnimations;

  // --- Animated Counters ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.dataset.count;
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          waitForRevealThenAnimate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -20px 0px'
    });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Wait until the parent .reveal element (if any) has 'is-visible' before animating
  function waitForRevealThenAnimate(el) {
    var revealParent = el.closest('.reveal');
    if (!revealParent || revealParent.classList.contains('is-visible')) {
      animateCounter(el);
      return;
    }
    // Poll until the reveal parent becomes visible (checked every 100ms, max 5s)
    var attempts = 0;
    var check = setInterval(function () {
      attempts++;
      if (revealParent.classList.contains('is-visible')) {
        clearInterval(check);
        animateCounter(el);
      } else if (attempts > 50) {
        clearInterval(check);
        animateCounter(el);
      }
    }, 100);
  }

  function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    var duration = 2000;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = Math.round(easedProgress * target);

      el.textContent = formatNumber(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return num.toLocaleString('en-IN');
    }
    return num.toString();
  }

  // Make available globally
  window.firkeeInitCounters = initCounters;

  // Clear any stale theme overrides — site uses Firkee Green only
  localStorage.removeItem('firkee-theme');
  document.documentElement.removeAttribute('data-theme');

})();
