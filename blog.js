/* ==========================================================================
   RULAR SQUAD — News & Vlog rendering
   Loads data/blog.json, filters by category tab, and only renders
   published:true posts. Video buttons are gated on a real URL.
   ========================================================================== */

(function () {
  const grid = document.getElementById('postGrid');
  const emptyState = document.getElementById('postEmpty');
  const tabs = document.querySelectorAll('.filter-tab');
  if (!grid) return;

  let posts = [];
  let activeFilter = 'all';

  function categoryLabel(cat) {
    const map = { news: 'News', blog: 'Blog', vlog: 'Vlog', events: 'Events' };
    return map[cat] || cat;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function render() {
    const visible = posts.filter((p) => p.published && (activeFilter === 'all' || p.category === activeFilter));
    grid.innerHTML = '';

    if (visible.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    visible.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post-card reveal is-visible';

      const videoHTML = post.video
        ? `<a class="card-link" href="${post.video}" target="_blank" rel="noopener noreferrer">Watch Event Video →</a>`
        : `<div class="video-status">Event video will be published here.</div>`;

      const thumbHTML = post.image
        ? `<img src="${post.image}" alt="${post.title}" loading="lazy">`
        : `<span>${post.title}<br><span style="font-weight:500; opacity:.7;">Photo placeholder — add official image</span></span>`;

      card.innerHTML = `
        <div class="post-thumb">
          ${thumbHTML}
          <span class="post-tag">${categoryLabel(post.category)}</span>
        </div>
        <div class="post-body">
          <div class="post-date">${formatDate(post.date)}</div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div style="margin-top:14px; display:flex; flex-direction:column; gap:10px; align-items:flex-start;">
            <a class="card-link" href="${post.link || '#'}">Read More →</a>
            ${videoHTML}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      activeFilter = tab.getAttribute('data-filter');
      render();
    });
  });

  fetch('blog.json')
    .then((res) => res.json())
    .then((data) => {
      posts = data;
      render();
    })
    .catch(() => {
      grid.innerHTML = '<p style="color:var(--muted)">Unable to load posts right now.</p>';
    });
})();
