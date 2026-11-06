(() => {
  const slots = [...document.querySelectorAll('[data-offline-section]')];
  Promise.all(slots.map(async slot => {
    const name = slot.dataset.offlineSection;
    const response = await fetch(`./${name}/${name}.html`);
    if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
    const template = document.createElement('template');
    template.innerHTML = (await response.text()).trim();
    return template.content.firstElementChild;
  })).then(sections => {
    sections.forEach((section, index) => slots[index].replaceWith(section));
    initColleges();
    window.dispatchEvent(new Event('manzil:sections-ready'));
  }).catch(error => console.error(error));

  document.addEventListener('click', event => {
    const route = event.target.closest('[data-dashboard-route]');
    if (!route) return;
    const path = route.dataset.dashboardRoute;
    const local = { 'compare-programs': 'compare', 'add-comparison': 'offline-colleges', 'recommendations': 'interactive-recommendation-engine', 'free-counseling': 'need-guidance', 'testimonials': 'testimonials', 'universities': 'offline-colleges' }[path];
    if (local) { event.preventDefault(); scrollToSection(local); }
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'recommendation-form') {
      event.preventDefault();
      scrollToSection('offline-colleges');
      document.querySelector('#college-search')?.focus();
    }
    if (event.target.id === 'newsletter-form') {
      event.preventDefault();
      const email = new FormData(event.target).get('email');
      window.dispatchEvent(new CustomEvent('manzil:newsletter', { detail: { email } }));
      event.target.reset();
    }
  });
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (window.lenis) window.lenis.scrollTo(target);
    else target.scrollIntoView({ behavior: 'smooth' });
  }
  function initColleges() {
    const search = document.querySelector('#college-search');
    const sort = document.querySelector('#college-sort');
    const grid = document.querySelector('#college-grid');
    const cards = [...grid.querySelectorAll('.oc-college')];
    const count = document.querySelector('#college-result-count');
    const empty = document.querySelector('#college-empty');
    const checks = [...document.querySelectorAll('#college-filters input')];
    function update() {
      const query = search.value.trim().toLowerCase();
      const locations = checks.filter(check => check.checked).map(check => check.value);
      let visible = 0;
      cards.forEach(card => {
        const matchText = `${card.dataset.name} ${card.dataset.location} ${card.dataset.course}`.toLowerCase().includes(query);
        const matchLocation = !locations.length || locations.some(value => card.dataset.location.includes(value));
        card.hidden = !(matchText && matchLocation);
        if (!card.hidden) visible++;
      });
      count.textContent = query || locations.length ? `${visible} ${visible === 1 ? 'college' : 'colleges'} found` : `${visible} featured ${visible === 1 ? 'college' : 'colleges'}`;
      empty.hidden = visible !== 0;
    }
    search.addEventListener('input', update);
    checks.forEach(check => check.addEventListener('change', update));
    sort.addEventListener('change', () => {
      const key = sort.value;
      cards.sort((a,b) => key === 'fees' ? Number(a.dataset.fees)-Number(b.dataset.fees) : Number(b.dataset.rating)-Number(a.dataset.rating));
      cards.forEach(card => grid.append(card));
    });
    document.querySelector('#college-filters-button').addEventListener('click', () => {
      const panel = document.querySelector('#college-filters');
      panel.hidden = !panel.hidden;
    });
    document.querySelector('#college-clear-filters').addEventListener('click', () => { checks.forEach(check => check.checked = false); update(); });
    document.querySelectorAll('[data-college-topic]').forEach(button => button.addEventListener('click', () => { search.value = button.dataset.collegeTopic === 'Engineering' ? 'Engineering' : button.dataset.collegeTopic; update(); scrollToSection('offline-colleges'); }));
    document.querySelectorAll('[data-compare-college]').forEach(button => button.addEventListener('click', () => { button.textContent = 'Added ✓'; button.disabled = true; scrollToSection('compare'); }));
    const dialog = document.querySelector('#college-dialog');
    document.querySelectorAll('[data-view-college]').forEach(button => button.addEventListener('click', () => {
      const card = button.closest('.oc-college');
      dialog.querySelector('#college-dialog-title').textContent = card.dataset.name;
      dialog.querySelector('#college-dialog-content').textContent = `${card.dataset.course} · ${card.dataset.location}`;
      dialog.showModal();
    }));
    document.querySelector('#college-dialog-close').addEventListener('click', () => dialog.close());
    document.querySelector('#college-more').addEventListener('click', () => {
      document.querySelector('#college-more-notice').hidden = false;
    });
  }
})();
