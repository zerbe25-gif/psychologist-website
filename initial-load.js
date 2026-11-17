/* FIRST VISIT — soft hybrid reveal for the home page.
   Kept separate from page-transition.js so navigation transitions remain unchanged. */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains("initial-load-pending")) return;

  let started = false;
  const startReveal = () => {
    if (started) return;
    started = true;
    window.requestAnimationFrame(() => {
      root.classList.add("initial-load-reveal");
      root.classList.remove("initial-load-pending");
      window.setTimeout(() => {
        root.classList.remove("initial-load-reveal");
      }, 1250);
    });
  };

  const photo = document.getElementById("photo-one");
  if (!photo) {
    startReveal();
    return;
  }

  /* Let the hero portrait decode first, but never hold the page indefinitely. */
  const safetyFallback = window.setTimeout(startReveal, 1500);
  const imageReady = typeof photo.decode === "function"
    ? photo.decode().catch(() => {})
    : new Promise(resolve => {
        if (photo.complete) resolve();
        else {
          photo.addEventListener("load", resolve, { once: true });
          photo.addEventListener("error", resolve, { once: true });
        }
      });

  Promise.race([
    imageReady,
    new Promise(resolve => window.setTimeout(resolve, 850))
  ]).then(() => {
    window.clearTimeout(safetyFallback);
    startReveal();
  });
})();
