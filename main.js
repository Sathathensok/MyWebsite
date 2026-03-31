/* ============================================================
   SATHATHEN — main.js  v2.0
   Handles: sticky nav, fade-in animations, mobile menu,
            counter animations, typing effect, reading progress
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Nav ─────────────────────────────────────── */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Fade-up / Fade-in on scroll ────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
    if (!el.dataset.delay) {
      const siblings = el.parentElement
        ? [...el.parentElement.querySelectorAll('.fade-up, .fade-in')]
        : [];
      el.dataset.delay = siblings.indexOf(el) * 90;
    }
    observer.observe(el);
  });

  /* ── 3. Mobile Menu ────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    const close = () => { mobileMenu.classList.remove('active'); document.body.style.overflow = ''; };
    if (mobileClose) mobileClose.addEventListener('click', close);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ── 4. Counter Animation ──────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── 5. Typing / Cycling Text ──────────────────────────── */
  const typer = document.querySelector('[data-typing]');
  if (typer) {
    const words = JSON.parse(typer.dataset.typing);
    let wi = 0, ci = 0, del = false;
    const tick = () => {
      const w = words[wi];
      if (!del) {
        typer.textContent = w.slice(0, ++ci);
        if (ci === w.length) { del = true; setTimeout(tick, 1800); return; }
        setTimeout(tick, 75);
      } else {
        typer.textContent = w.slice(0, --ci);
        if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 45);
      }
    };
    setTimeout(tick, 900);
  }

  /* ── 6. Active Nav Link ────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'Index.html';
  document.querySelectorAll('nav ul li a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href && page.toLowerCase() === href.toLowerCase()) a.classList.add('active');
  });

  /* ── 7. Smooth Anchor Scroll ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── 8. Project Card Tilt ──────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 5;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 5;
      card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── 9. Reading Progress Bar ───────────────────────────── */
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    const article = document.querySelector('.article-body') || document.body;
    const updateProgress = () => {
      const rect = article.getBoundingClientRect();
      const articleHeight = article.offsetHeight;
      const scrolled = -rect.top;
      const total = articleHeight - window.innerHeight;
      const pct = Math.min(Math.max(scrolled / total, 0), 1) * 100;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

});
