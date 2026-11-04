(() => {
  document.querySelectorAll('[data-pathway]').forEach(card => {
    card.addEventListener('click', () => {
      const path = card.dataset.pathway;
      const event = new CustomEvent('manzil:navigate', { detail: { path }, cancelable: true });
      if (window.dispatchEvent(event)) window.location.hash = path;
    });
  });
})();
