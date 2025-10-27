'use strict';

(() => {
  
  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth in-page scrolling + move focus to target for accessibility
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // move focus for assistive tech
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  });

  // Contact form: enable/disable submit, accessible status, simple AJAX stub
  const form = document.getElementById('contact-form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    // create status element (aria-live) if not present
    let statusEl = document.getElementById('form-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.id = 'form-status';
      statusEl.setAttribute('role', 'status');
      statusEl.setAttribute('aria-live', 'polite');
      statusEl.style.marginTop = '12px';
      form.insertAdjacentElement('afterend', statusEl);
    }

    const toggleSubmit = () => {
      if (!submitBtn) return;
      submitBtn.disabled = !form.checkValidity();
    };

    // initial state
    toggleSubmit();

    // validate on input
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', toggleSubmit);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        // should not happen if button state is enforced, but ensure feedback
        statusEl.textContent = 'Please fill out the form correctly.';
        statusEl.style.color = '#b45309'; // subtle warning color
        return;
      }

      // Disable while "sending"
      if (submitBtn) submitBtn.disabled = true;
      statusEl.textContent = 'Sending…';

      try {
        // Example: send data to your endpoint
        // const resp = await fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(Object.fromEntries(new FormData(form)))
        // });
        // if (!resp.ok) throw new Error('Network response was not ok');

        // Simulate network delay for demo
        await new Promise(r => setTimeout(r, 700));

        statusEl.textContent = 'Thanks — your message has been sent.';
        statusEl.style.color = ''; // reset color
        form.reset();
        toggleSubmit();
      } catch (err) {
        statusEl.textContent = 'Sorry — something went wrong. Try again later.';
        statusEl.style.color = '#dc2626';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Optional dark-mode toggle (add a button with data-darkmode-btn in HTML to use)
  const darkBtn = document.querySelector('[data-darkmode-btn]');
  const DARK_KEY = 'radiance-theme';
  const applyTheme = (theme) => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme !== 'dark');
    try { localStorage.setItem(DARK_KEY, theme); } catch (e) {}
  };

  // initialize from storage or prefers-color-scheme
  try {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved) applyTheme(saved);
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  } catch (e) { /* ignore localStorage errors */ }

  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      applyTheme(isDark ? 'light' : 'dark');
      darkBtn.setAttribute('aria-pressed', String(!isDark));
    });
  }
})();