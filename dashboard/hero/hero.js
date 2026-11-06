(() => {
  const header = document.querySelector('#site-header');
  const nav = document.querySelector('#site-navigation');
  const menu = document.querySelector('#mega-menu');
  const menuButtons = [...document.querySelectorAll('[data-menu]')];
  const mobileToggle = document.querySelector('.site-header__mobile-toggle');
  const columns = [...menu.querySelectorAll('.mega-menu__column')];
  const learningHeading = menu.querySelector('[data-column="Learning"] h2');
  const kidsMenuItem = menu.querySelector('[data-path="kids-learning"]');
  const variants = {
    Explore: { slug: 'explore', columns: ['Learning', 'Exams', 'Degrees & Colleges', 'Tools'] },
    Exams: { slug: 'exams', columns: ['Exams', 'Tools'] },
    'Degrees & Colleges': { slug: 'degrees', columns: ['Degrees & Colleges', 'Tools'] },
    'Skills & Learning': { slug: 'skills', columns: ['Learning', 'Tools'] },
    Tools: { slug: 'tools', columns: ['Tools'] },
  };
  let closeTimer;

  function closeMenu() {
    clearTimeout(closeTimer);
    menu.hidden = true;
    menuButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
  }

  function openMenu(button) {
    clearTimeout(closeTimer);
    menuButtons.forEach(item => item.setAttribute('aria-expanded', String(item === button)));
    const label = button.dataset.menu;
    const variant = variants[label];
    menu.dataset.variant = variant.slug;
    menu.setAttribute('aria-label', `${label} menu`);
    columns.forEach(column => { column.hidden = !variant.columns.includes(column.dataset.column); });
    learningHeading.textContent = label === 'Skills & Learning' ? 'Skills & Learning' : 'Learning';
    kidsMenuItem.hidden = label === 'Skills & Learning';
    menu.hidden = false;
  }

  menuButtons.forEach(button => {
    button.addEventListener('mouseenter', () => openMenu(button));
    button.addEventListener('focus', () => openMenu(button));
    button.addEventListener('click', () => openMenu(button));
  });
  header.addEventListener('mouseleave', () => { closeTimer = setTimeout(closeMenu, 120); });
  header.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  document.addEventListener('pointerdown', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); mobileToggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } });

  mobileToggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (!open) closeMenu();
  });

  function navigate(path) {
    // A host application can intercept this event and route to a real page.
    const event = new CustomEvent('manzil:navigate', { detail: { path }, cancelable: true });
    if (window.dispatchEvent(event)) {
      const landingPages = {
        'offline-colleges': 'offline-colleges/index.html',
        'online-degrees': 'online-degrees/index.html',
        'kids-learning': 'kids-learning/index.html',
      };
      if (landingPages[path]) {
        const fromNestedPage = Boolean(document.body.dataset.page);
        window.location.href = new URL(`${fromNestedPage ? '../' : './'}${landingPages[path]}`, window.location.href);
      } else {
        window.location.hash = path;
      }
    }
    closeMenu();
    mobileToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
  menu.querySelectorAll('[data-path]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.path)));
  nav.querySelectorAll('[data-route]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.route)));
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'journey' || action === 'options') {
      if (window.matchMedia('(max-width: 900px)').matches) {
        nav.classList.add('is-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      openMenu(menuButtons[0]);
      menuButtons[0].focus();
    } else {
      navigate(action === 'start' ? 'get-started' : 'login');
    }
  }));
})();
