(() => {
  const slots = [...document.querySelectorAll('[data-dashboard-section]')];
  Promise.all(slots.map(async slot => {
    const name = slot.dataset.dashboardSection;
    const response = await fetch(`./dashboard/${name}/${name}.html`);
    if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
    const template = document.createElement('template');
    template.innerHTML = (await response.text()).trim();
    return template.content.firstElementChild;
  })).then(sections => {
    sections.forEach((section, index) => slots[index].replaceWith(section));
    window.dispatchEvent(new Event('manzil:sections-ready'));
  }).catch(error => console.error(error));

  function route(path, extra = {}) {
    const event = new CustomEvent('manzil:navigate', { detail: { path, ...extra }, cancelable: true });
    if (window.dispatchEvent(event)) window.location.hash = path;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-dashboard-route]');
    if (!link) return;
    event.preventDefault();
    route(link.dataset.dashboardRoute);
  });

  document.addEventListener('submit', event => {
    if (event.target.id === 'recommendation-form') {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.target));
      route('recommendations', { selections: values });
    }
    if (event.target.id === 'newsletter-form') {
      event.preventDefault();
      const email = new FormData(event.target).get('email');
      window.dispatchEvent(new CustomEvent('manzil:newsletter', { detail: { email } }));
    }
  });
})();
