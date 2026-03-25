/* ==========================================================================
   FIRKEE ACCESSORIES — Contact Page Scripts
   Form validation, error display, success overlay
   ========================================================================== */

(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  var successOverlay = document.getElementById('formSuccess');

  if (!form) return;

  // --- Field Definitions ---
  var requiredFields = [
    {
      id: 'companyName',
      errorId: 'companyNameError',
      message: 'Company name is required.'
    },
    {
      id: 'contactPerson',
      errorId: 'contactPersonError',
      message: 'Contact person is required.'
    },
    {
      id: 'email',
      errorId: 'emailError',
      message: 'Email address is required.',
      validate: function (value) {
        if (!value.trim()) return 'Email address is required.';
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    {
      id: 'country',
      errorId: 'countryError',
      message: 'Country is required.'
    }
  ];

  // --- Show Error ---
  function showError(input, errorEl, message) {
    input.classList.add('has-error');
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }

  // --- Clear Error ---
  function clearError(input, errorEl) {
    input.classList.remove('has-error');
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  }

  // --- Validate Single Field ---
  function validateField(fieldDef) {
    var input = document.getElementById(fieldDef.id);
    var errorEl = document.getElementById(fieldDef.errorId);

    if (!input || !errorEl) return true;

    var value = input.value;

    // Use custom validator if provided
    if (fieldDef.validate) {
      var errorMessage = fieldDef.validate(value);
      if (errorMessage) {
        showError(input, errorEl, errorMessage);
        return false;
      }
      clearError(input, errorEl);
      return true;
    }

    // Default required check
    if (!value.trim()) {
      showError(input, errorEl, fieldDef.message);
      return false;
    }

    clearError(input, errorEl);
    return true;
  }

  // --- Attach Blur Validation ---
  requiredFields.forEach(function (fieldDef) {
    var input = document.getElementById(fieldDef.id);
    if (!input) return;

    input.addEventListener('blur', function () {
      // Only validate if the field has been interacted with (has a value or had one)
      if (input.dataset.touched === 'true') {
        validateField(fieldDef);
      }
    });

    input.addEventListener('input', function () {
      input.dataset.touched = 'true';
      // Clear error on typing if there was one
      var errorEl = document.getElementById(fieldDef.errorId);
      if (input.classList.contains('has-error')) {
        clearError(input, errorEl);
      }
    });
  });

  // --- Form Submit ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Mark all required fields as touched
    requiredFields.forEach(function (fieldDef) {
      var input = document.getElementById(fieldDef.id);
      if (input) input.dataset.touched = 'true';
    });

    // Validate all required fields
    var isValid = true;
    var firstErrorField = null;

    requiredFields.forEach(function (fieldDef) {
      var fieldValid = validateField(fieldDef);
      if (!fieldValid && isValid) {
        firstErrorField = document.getElementById(fieldDef.id);
        isValid = false;
      } else if (!fieldValid) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error field
      if (firstErrorField) {
        var navHeight = 72;
        var nav = document.getElementById('nav');
        if (nav) navHeight = nav.offsetHeight;

        var targetTop = firstErrorField.getBoundingClientRect().top + window.scrollY - navHeight - 24;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        firstErrorField.focus();
      }
      return;
    }

    // All valid: show success overlay
    showSuccessOverlay();
  });

  // --- Success Overlay ---
  function showSuccessOverlay() {
    if (!successOverlay) return;
    successOverlay.classList.add('is-visible');

    // Scroll to form top so overlay is visible
    var formTop = form.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: formTop, behavior: 'smooth' });
  }

})();
