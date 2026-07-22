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

  function initGallery() {
    var gallery = document.querySelector('[data-gallery]');
    if (!gallery) return;
    var sources = [].slice.call(gallery.querySelectorAll('[data-full]'))
      .map(function (el) { return el.getAttribute('data-full'); });
    if (!sources.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML =
      '<button class="lightbox__close" aria-label="Закрыть"><i data-lucide="x"></i></button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Назад"><i data-lucide="chevron-left"></i></button>' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Вперёд"><i data-lucide="chevron-right"></i></button>' +
      '<img alt="Фото объекта">' +
      '<div class="lightbox__count"></div>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector('img');
    var countEl = overlay.querySelector('.lightbox__count');
    var current = 0;

    function show(i) {
      current = (i + sources.length) % sources.length;
      imgEl.src = sources[current];
      countEl.textContent = (current + 1) + ' / ' + sources.length;
    }
    function open(i) { show(i); overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function close() { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }

    gallery.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-full]');
      if (!btn) return;
      open(sources.indexOf(btn.getAttribute('data-full')));
    });
    overlay.querySelector('.lightbox__close').addEventListener('click', close);
    overlay.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
    overlay.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(current + 1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
    renderIcons(overlay);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderIcons();
    initNavToggle();
    initSmoothAnchors();
    initQuoteForm();
    initGallery();
  });
})();
