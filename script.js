// ===== Dark Mode Toggle =====
(function () {
  'use strict';

  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

  // Sync the toggle icon with the current theme (already applied inline in <head>)
  function syncIcon() {
    if (!icon) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
    if (toggleBtn) {
      toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* storage may be unavailable */
    }
    syncIcon();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  // Follow system changes only when the user hasn't set a manual preference
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', function (e) {
    let stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (err) {
      /* ignore */
    }
    if (!stored) {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      syncIcon();
    }
  });

  syncIcon();

  // ===== Smooth active-link highlight while scrolling =====
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              const isActive = link.getAttribute('href') === '#' + id;
              link.style.color = isActive ? 'var(--gold)' : '';
            });
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();