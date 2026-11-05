(() => {
  // Lenis is bundled locally so the static dashboard works without a CDN.
  const lenis = new window.Lenis({
    autoRaf: true,
    anchors: true,
    stopInertiaOnNavigate: true,
  });

  window.manzilLenis = lenis;
  window.addEventListener('manzil:sections-ready', () => lenis.resize(), { once: true });
})();
