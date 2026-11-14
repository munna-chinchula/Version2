(() => {
  document.querySelectorAll('[data-pathway]').forEach(card => {
    card.addEventListener('click', () => {
      const path = card.dataset.pathway;
      const event = new CustomEvent('manzil:navigate', { detail: { path }, cancelable: true });
      if (window.dispatchEvent(event)) {
        if (path === 'online-degrees') window.location.href = new URL('./online-degrees/index.html', window.location.href);
        else window.location.hash = path;
      }
    });
  });
})();
