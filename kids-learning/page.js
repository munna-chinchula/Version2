(() => {
  const names = ['what-they-can-learn','instruction-models','not-sure-where-to-start','recommended-learning','compare','why-manzilchaser','learning-journey','parent-command-center','ready-to-start','testimonials','faq','footer'];
  const shared = new Set(['testimonials','faq','footer']);
  Promise.all(names.map(async name => {
    const path = shared.has(name) ? `../offline-colleges/${name}/${name}.html` : `./${name}/${name}.html`;
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    let html = (await response.text()).trim();
    if (shared.has(name)) html = html.replaceAll(`src="./${name}/`, `src="../offline-colleges/${name}/`);
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
  })).then(sections => {
    sections.forEach((section, index) => document.querySelector(`[data-kids-section="${names[index]}"]`)?.replaceWith(section));
    initPage();
    window.dispatchEvent(new Event('manzil:sections-ready'));
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }).catch(console.error);

  function scrollTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (window.lenis) window.lenis.scrollTo(target);
    else target.scrollIntoView({ behavior: 'smooth' });
  }

  function initPage() {
    document.querySelectorAll('[data-kid-tab]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-kid-tab]').forEach(tab => tab.classList.toggle('is-active', tab === button));
    }));
    const search = document.querySelector('#kids-search');
    const cards = [...document.querySelectorAll('.kl-course')];
    const count = document.querySelector('#kids-result-count');
    const update = () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        card.hidden = !card.textContent.toLowerCase().includes(query);
        if (!card.hidden) visible++;
      });
      count.textContent = query ? `${visible} ${visible === 1 ? 'course' : 'courses'} found` : '3 featured courses';
    };
    search?.addEventListener('input', update);
    document.querySelectorAll('[data-kid-topic]').forEach(button => button.addEventListener('click', () => {
      search.value = button.dataset.kidTopic;
      update(); scrollTo('recommended-learning');
    }));
    document.querySelector('#kids-filter-button')?.addEventListener('click', () => {
      const panel = document.querySelector('#kids-filters'); panel.hidden = !panel.hidden;
    });
    document.querySelector('#kids-sort')?.addEventListener('change', event => {
      const grid = document.querySelector('#kids-course-grid');
      const sorted = [...cards].sort((a,b) => event.target.value === 'price' ? Number(a.dataset.price)-Number(b.dataset.price) : Number(b.dataset.rating)-Number(a.dataset.rating));
      sorted.forEach(card => grid.append(card));
    });
    document.querySelectorAll('[data-kids-compare]').forEach(button => button.addEventListener('click', () => {
      button.textContent = 'Added ✓'; button.disabled = true; scrollTo('compare');
    }));
    document.querySelectorAll('[data-kids-view]').forEach(button => button.addEventListener('click', () => {
      const card = button.closest('.kl-course');
      const dialog = document.querySelector('#kids-dialog');
      dialog.querySelector('h2').textContent = card.querySelector('h3').textContent;
      dialog.querySelector('p').textContent = card.dataset.description;
      dialog.showModal();
    }));
    document.querySelector('#kids-dialog-close')?.addEventListener('click', () => document.querySelector('#kids-dialog').close());
    document.querySelector('#kids-view-more')?.addEventListener('click', () => { document.querySelector('#kids-more-note').hidden = false; });
    document.querySelector('#kids-finder')?.addEventListener('submit', event => { event.preventDefault(); scrollTo('recommended-learning'); });
    document.querySelector('#newsletter-form')?.addEventListener('submit', event => { event.preventDefault(); const email = new FormData(event.target).get('email'); window.dispatchEvent(new CustomEvent('manzil:newsletter', { detail: { email } })); event.target.reset(); });
  }
  document.addEventListener('click', event => {
    const route = event.target.closest('[data-dashboard-route]');
    if (!route) return;
    const local = { 'compare-programs':'compare','free-counseling':'ready-to-start','recommendations':'not-sure-where-to-start','testimonials':'testimonials' }[route.dataset.dashboardRoute];
    if (local) { event.preventDefault(); scrollTo(local); }
  });
})();
