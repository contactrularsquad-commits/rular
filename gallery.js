/* ==========================================================================
   RULAR SQUAD — Gallery rendering
   Reads data/gallery.json. To publish a new photo, add one object to
   that file (id, title, category array, date, location, image path,
   caption) — no HTML editing required. Includes a lightbox with
   keyboard support.
   ========================================================================== */

(function () {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const tabs = document.querySelectorAll('.gallery-filter-tabs .filter-tab');
  let items = [];
  let activeFilter = 'all';

  function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function render() {
    const visible = items.filter((it) => activeFilter === 'all' || it.category.includes(activeFilter));
    grid.innerHTML = '';

    visible.forEach((it, idx) => {
      const fig = document.createElement('figure');
      fig.className = 'gallery-item tilt-card reveal-3d';
      fig.innerHTML = `
        <img src="${it.image}" alt="${it.title}" loading="lazy" data-idx="${idx}">
        <div class="gallery-caption">${it.title} — ${formatDate(it.date)}</div>
      `;
      fig.addEventListener('click', () => openLightbox(visible, idx));
      grid.appendChild(fig);
    });

    // Trigger reveal + tilt setup for freshly-added nodes
    if (window.initTiltAndReveal) window.initTiltAndReveal();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      activeFilter = tab.getAttribute('data-gfilter');
      render();
    });
  });

  // ---- Lightbox ----
  let lightboxEl = null;
  function buildLightbox() {
    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#10094;</button>
      <img class="lightbox-img" src="" alt="">
      <div class="lightbox-caption"></div>
      <button class="lightbox-nav lightbox-next" aria-label="Next">&#10095;</button>
    `;
    document.body.appendChild(lightboxEl);

    lightboxEl.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });
    lightboxEl.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
    lightboxEl.querySelector('.lightbox-next').addEventListener('click', () => step(1));
  }

  let currentSet = [];
  let currentIndex = 0;

  function openLightbox(set, idx) {
    if (!lightboxEl) buildLightbox();
    currentSet = set;
    currentIndex = idx;
    updateLightbox();
    lightboxEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const it = currentSet[currentIndex];
    lightboxEl.querySelector('.lightbox-img').src = it.image;
    lightboxEl.querySelector('.lightbox-img').alt = it.title;
    lightboxEl.querySelector('.lightbox-caption').textContent = `${it.title} · ${it.location} · ${formatDate(it.date)}`;
  }

  function step(dir) {
    currentIndex = (currentIndex + dir + currentSet.length) % currentSet.length;
    updateLightbox();
  }

  function closeLightbox() {
    lightboxEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxEl || !lightboxEl.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  fetch('gallery.json')
    .then((res) => res.json())
    .then((data) => {
      items = data;
      render();
    })
    .catch(() => {
      grid.innerHTML = '<p style="color:var(--muted)">Unable to load gallery right now.</p>';
    });
})();
