/* DESKTOP PAGE TRANSITION — single uninterrupted curtain (no GSAP dependency) */
(() => {
  const desktop = window.matchMedia("(min-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!desktop.matches || reducedMotion.matches) return;

  const root = document.documentElement;
  const body = document.body;
  const isArticlesPage = body.classList.contains("articles-page");
  const storageKey = "psychologistPageTransition";
  const curtain = document.createElement("div");
  curtain.className = "page-transition-curtain";
  curtain.setAttribute("aria-hidden", "true");
  body.appendChild(curtain);

  const moveCurtain = (from, to, duration) => {
    curtain.style.transform = `translate3d(0,${from},0)`;
    const animation = curtain.animate(
      [
        { transform: `translate3d(0,${from},0)` },
        { transform: `translate3d(0,${to},0)` }
      ],
      { duration, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" }
    );
    return animation.finished.catch(() => {});
  };

  let entering = false;
  try {
    entering = sessionStorage.getItem(storageKey) === "enter";
    sessionStorage.removeItem(storageKey);
  } catch (error) {}

  if (entering) {
    /* The head-level veil covers the page until this curtain takes over. */
    curtain.style.transform = "translate3d(0,0,0)";
    root.classList.remove("page-transition-pending");
    moveCurtain("0%", "-105%", 720).then(() => curtain.remove());
  } else {
    curtain.remove();
    root.classList.remove("page-transition-pending");
  }

  let navigating = false;
  document.addEventListener("click", async event => {
    if (navigating || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    let destination;
    try { destination = new URL(link.href, window.location.href); }
    catch (error) { return; }
    if (destination.origin !== window.location.origin) return;

    const destinationIsArticles = /\/articles\.html$/.test(destination.pathname);
    if (destinationIsArticles === isArticlesPage) return;
    const homeDestination = !destinationIsArticles &&
      (destination.pathname.endsWith("/index.html") ||
       destination.pathname.endsWith("/") || destination.pathname === "/");
    if (!destinationIsArticles && !homeDestination) return;

    navigating = true;
    event.preventDefault();
    try { sessionStorage.setItem(storageKey, "enter"); } catch (error) {}
    await moveCurtain("105%", "0%", 620);
    window.location.assign(destination.href);
  });
})();
