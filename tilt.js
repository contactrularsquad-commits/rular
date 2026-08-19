/* ==========================================================================
   RULAR SQUAD — 3D interactions
   - Cursor-driven tilt on any element with .tilt-card (cards, gallery
     tiles, the hero logo disc), using CSS custom properties so the
     transform stays declarative in CSS.
   - A rotateX flip-reveal for elements with .reveal-3d as they enter view.
   Both respect prefers-reduced-motion. Exposed as window.initTiltAndReveal
   so pages that inject cards dynamically (e.g. the gallery) can re-run it.
   ========================================================================== */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverCapable = window.matchMedia('(hover: hover)').matches;
  let revealObserver = null;

  function wireTilt(card) {
    if (card.dataset.tiltWired) return;
    card.dataset.tiltWired = 'true';
    const maxTilt = 8; // degrees
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${x * maxTilt * 2}deg`);
      card.style.setProperty('--rx', `${-y * maxTilt * 2}deg`);
      card.style.setProperty('--tz', '14px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--tz', '0px');
    });
  }

  function wireReveal(el) {
    if (el.dataset.revealWired) return;
    el.dataset.revealWired = 'true';
    if (reduceMotion) {
      el.classList.add('is-visible');
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
    }
    revealObserver.observe(el);
  }

  function init() {
    if (!reduceMotion && hoverCapable) {
      document.querySelectorAll('.tilt-card').forEach(wireTilt);
    }
    document.querySelectorAll('.reveal-3d').forEach(wireReveal);
  }

  window.initTiltAndReveal = init;
  document.addEventListener('DOMContentLoaded', init);
})();
