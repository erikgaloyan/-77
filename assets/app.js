/* Прочный дом 77 — site scripts: icons, mobile nav, quote form */
(function () {
  'use strict';

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
    }
  }

  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[data-scroll]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').replace('#', '');
        var el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initQuoteForm() {
    document.querySelectorAll('form[data-quote-form]').forEach(function (form) {
      var nameField = form.querySelector('[name="name"]');
      var phoneField = form.querySelector('[name="phone"]');
      var submitBtn = form.querySelector('[type="submit"]');
      var successEl = form.parentElement.querySelector('[data-form-success]');

      function setError(field, message) {
        var wrap = field.closest('.field');
        var errEl = wrap ? wrap.querySelector('.field-error') : null;
        if (wrap) wrap.classList.toggle('is-error', !!message);
        if (errEl) errEl.textContent = message || '';
      }

      nameField.addEventListener('input', function () { setError(nameField, ''); });
      phoneField.addEventListener('input', function () { setError(phoneField, ''); });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = nameField.value.trim();
        var digits = phoneField.value.replace(/\D/g, '');
        var ok = true;

        if (!name) { setError(nameField, 'Укажите имя'); ok = false; }
        if (digits.length < 10) { setError(phoneField, 'Введите корректный номер телефона'); ok = false; }
        if (!ok) return;

        submitBtn.disabled = true;
        var original = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';

        // Demo submit — replace with a real backend call when wiring up.
        setTimeout(function () {
          if (successEl) {
            form.hidden = true;
            successEl.hidden = false;
            renderIcons();
          } else {
            submitBtn.disabled = false;
            submitBtn.textContent = original;
          }
        }, 1200);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderIcons();
    initNavToggle();
    initSmoothAnchors();
    initQuoteForm();
  });
})();
