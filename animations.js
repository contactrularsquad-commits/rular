/* ==========================================================================
   RULAR SQUAD — Scroll Animations
   IntersectionObserver-driven reveals. Respects prefers-reduced-motion.
   ========================================================================== */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    document.querySelectorAll('.reveal, .big-lines span').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Staggered cinematic lines
  const lineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const spans = entry.target.querySelectorAll('span');
        spans.forEach((span, i) => {
          setTimeout(() => span.classList.add('is-visible'), i * 220);
        });
        lineObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.big-lines').forEach((el) => lineObserver.observe(el));
})();
