(() => {
  const sharedSections = {
    'trusted-institutions': 'trusted-institutions',
    'recommendation-engine': 'recommendation-engine',
    compare: 'compare',
    testimonials: 'testimonials',
    faq: 'faq',
    footer: 'footer',
  };
  const slots = [...document.querySelectorAll('[data-online-section]')];

  Promise.all(slots.map(async slot => {
    const name = slot.dataset.onlineSection;
    const sharedName = sharedSections[name];
    const url = sharedName ? `../offline-colleges/${sharedName}/${sharedName}.html` : `./${name}/${name}.html`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
    let markup = (await response.text()).trim();
    if (sharedName) markup = markup.replaceAll(`src="./${sharedName}/`, `src="../offline-colleges/${sharedName}/`);
    const template = document.createElement('template');
    template.innerHTML = markup;
    return template.content.firstElementChild;
  })).then(sections => {
    sections.forEach((section, index) => slots[index].replaceWith(section));
    initPrograms();
    window.dispatchEvent(new Event('manzil:sections-ready'));
    if (window.location.hash) requestAnimationFrame(() => scrollToSection(window.location.hash.slice(1), false));
  }).catch(error => console.error(error));

  document.addEventListener('click', event => {
    const route = event.target.closest('[data-dashboard-route]');
    if (!route) return;
    const local = {
      'compare-programs': 'compare',
      'add-comparison': 'online-programs',
      recommendations: 'interactive-recommendation-engine',
      'free-counseling': 'need-guidance',
      testimonials: 'testimonials',
      universities: 'online-programs',
    }[route.dataset.dashboardRoute];
    if (local) { event.preventDefault(); scrollToSection(local); }
  });

  document.addEventListener('submit', event => {
    if (event.target.id === 'degree-hero-search') {
      event.preventDefault();
      const value = new FormData(event.target).get('query') || '';
      scrollToSection('online-programs');
      const search = document.querySelector('#program-search');
      if (search) { search.value = value; search.dispatchEvent(new Event('input')); }
    }
    if (event.target.id === 'recommendation-form') {
      event.preventDefault();
      scrollToSection('online-programs');
      document.querySelector('#program-search')?.focus();
    }
    if (event.target.id === 'newsletter-form') {
      event.preventDefault();
      const email = new FormData(event.target).get('email');
      window.dispatchEvent(new CustomEvent('manzil:newsletter', { detail: { email } }));
      event.target.reset();
    }
  });

  document.querySelectorAll('[data-degree-topic]').forEach(button => button.addEventListener('click', () => {
    scrollToSection('online-programs');
    const search = document.querySelector('#program-search');
    if (search) { search.value = button.dataset.degreeTopic; search.dispatchEvent(new Event('input')); }
  }));

  function scrollToSection(id, smooth = true) {
    const target = document.getElementById(id);
    if (!target) return;
    if (window.lenis && smooth) window.lenis.scrollTo(target);
    else target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }

  function initPrograms() {
    const search = document.querySelector('#program-search');
    const sort = document.querySelector('#program-sort');
    const grid = document.querySelector('#program-grid');
    if (!search || !sort || !grid) return;
    const cards = [...grid.querySelectorAll('.oc-college')];
    const count = document.querySelector('#program-result-count');
    const empty = document.querySelector('#program-empty');
    const checks = [...document.querySelectorAll('#program-filters input')];
    const update = () => {
      const query = search.value.trim().toLowerCase();
      const courses = checks.filter(check => check.checked).map(check => check.value);
      let visible = 0;
      cards.forEach(card => {
        const haystack = `${card.dataset.name} ${card.dataset.location} ${card.dataset.course}`.toLowerCase();
        const matchesText = haystack.includes(query);
        const matchesCourse = !courses.length || courses.some(value => card.dataset.course.includes(value));
        card.hidden = !(matchesText && matchesCourse);
        if (!card.hidden) visible += 1;
      });
      count.textContent = query || courses.length ? `${visible} ${visible === 1 ? 'program' : 'programs'} found` : '125 colleges found';
      empty.hidden = visible !== 0;
    };
    search.addEventListener('input', update);
    checks.forEach(check => check.addEventListener('change', update));
    sort.addEventListener('change', () => {
      const key = sort.value;
      cards.sort((a, b) => key === 'fees' ? Number(a.dataset.fees) - Number(b.dataset.fees) : Number(b.dataset.rating) - Number(a.dataset.rating));
      cards.forEach(card => grid.append(card));
    });
    document.querySelector('#program-filters-button')?.addEventListener('click', () => {
      const panel = document.querySelector('#program-filters');
      panel.hidden = !panel.hidden;
    });
    document.querySelector('#program-clear-filters')?.addEventListener('click', () => { checks.forEach(check => { check.checked = false; }); update(); });
    document.querySelectorAll('[data-program-topic]').forEach(button => button.addEventListener('click', () => { search.value = button.dataset.programTopic; update(); scrollToSection('online-programs'); }));
    document.querySelectorAll('[data-compare-program]').forEach(button => button.addEventListener('click', () => { button.textContent = 'Added ✓'; button.disabled = true; scrollToSection('compare'); }));
    const dialog = document.querySelector('#program-dialog');
    document.querySelectorAll('[data-view-program]').forEach(button => button.addEventListener('click', () => {
      const card = button.closest('.oc-college');
      dialog.querySelector('#program-dialog-title').textContent = card.dataset.name;
      dialog.querySelector('#program-dialog-content').textContent = `${card.dataset.course} · ${card.dataset.location}`;
      dialog.showModal();
    }));
    document.querySelector('#program-dialog-close')?.addEventListener('click', () => dialog.close());
    document.querySelector('#program-more')?.addEventListener('click', () => { document.querySelector('#program-more-notice').hidden = false; });
  }
})();
