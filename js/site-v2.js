(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    if (body) body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (_) {}

    const toggle = document.getElementById('theme-toggle') || document.getElementById('site-theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    if (sun && moon) {
      sun.classList.toggle('hidden', !isDark);
      moon.classList.toggle('hidden', isDark);
    }
  }

  function ensureThemeToggle() {
    const existing = document.getElementById('theme-toggle') || document.getElementById('site-theme-toggle');
    if (existing) {
      if (!existing.dataset.themeBound) {
        existing.dataset.themeBound = '1';
        existing.addEventListener('click', function () {
          const next = root.classList.contains('dark') ? 'light' : 'dark';
          applyTheme(next);
        });
      }
      return;
    }

    const header = document.querySelector('header');
    if (!header) return;

    const actionsHost =
      header.querySelector('[role="group"]')?.parentElement ||
      header.querySelector('.flex.items-center.gap-2') ||
      header.querySelector('.flex.items-center.gap-1') ||
      header.querySelector('div[class*="items-center"]');

    if (!actionsHost) return;

    const button = document.createElement('button');
    button.id = 'site-theme-toggle';
    button.type = 'button';
    button.className = 'site-theme-toggle';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Switch theme');
    button.innerHTML = '<span class="site-theme-toggle__sun" aria-hidden="true">☀</span><span class="site-theme-toggle__moon" aria-hidden="true">☾</span>';
    button.addEventListener('click', function () {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
    });

    actionsHost.appendChild(button);
  }

  function initAmbientLayer() {
    if (!body || body.querySelector('.site-ambient')) return;
    const ambient = document.createElement('div');
    ambient.className = 'site-ambient';
    ambient.setAttribute('aria-hidden', 'true');
    ambient.innerHTML = '<span class="blob blob-a"></span><span class="blob blob-b"></span><span class="blob blob-c"></span>';
    body.appendChild(ambient);
  }

  function initScrollProgress() {
    if (!body || body.querySelector('.site-scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'site-scroll-progress';
    bar.innerHTML = '<div class="site-scroll-progress__bar"></div>';
    body.appendChild(bar);

    const progress = bar.firstElementChild;
    const onScroll = function () {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const value = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progress.style.transform = 'scaleX(' + value + ')';
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  function initRevealAnimations() {
    const candidates = document.querySelectorAll(
      'main section, main article, .prose, .contact, .update-info, .provider-info, .provider-info-card, .border.p-4.rounded-md.bg-white, .rounded-xl.bg-white, .bg-white.rounded.shadow.p-6'
    );

    candidates.forEach(function (el, idx) {
      if (el.classList.contains('site-reveal')) return;
      el.classList.add('site-reveal');
      el.style.setProperty('--reveal-delay', (idx % 12) * 35 + 'ms');
    });

    if (reduceMotion || window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.site-reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    document.querySelectorAll('.site-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initCardMotion() {
    if (reduceMotion || !window.matchMedia || !window.matchMedia('(pointer:fine)').matches) return;

    const cards = document.querySelectorAll(
      '.border.p-4.rounded-md.bg-white, .rounded-xl.bg-white, .bg-white.rounded.shadow.p-6, .provider-info-card, .contact'
    );

    cards.forEach(function (card) {
      if (card.dataset.motionBound) return;
      card.dataset.motionBound = '1';
      card.classList.add('site-motion-card');

      card.addEventListener('mousemove', function (event) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 4;
        const rotateY = (x - 0.5) * 6;
        card.style.setProperty('--mx', String(x));
        card.style.setProperty('--my', String(y));
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-2px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  function initHeaderShadow() {
    const header = document.querySelector('header');
    if (!header) return;
    const onScroll = function () {
      header.classList.toggle('site-header-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  applyTheme(getPreferredTheme());
  ensureThemeToggle();
  initAmbientLayer();
  initScrollProgress();
  initRevealAnimations();
  initCardMotion();
  initHeaderShadow();
})();
