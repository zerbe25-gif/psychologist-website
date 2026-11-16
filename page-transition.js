/* DESKTOP PAGE TRANSITION — curtain exists in HTML before first paint */
(() => {
  const desktop = window.matchMedia("(min-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!desktop.matches || reducedMotion.matches) return;

  const root = document.documentElement;
  const body = document.body;
  const curtain = document.querySelector(".page-transition-curtain");
  if (!curtain) {
    root.classList.remove("page-transition-pending");
    return;
  }

  const isArticlesPage = body.classList.contains("articles-page");
  const storageKey = "psychologistPageTransition";
  let entering = false;
  try {
    entering = sessionStorage.getItem(storageKey) === "enter";
    sessionStorage.removeItem(storageKey);
  } catch (error) {}

  const animateCurtain = (from, to, duration) => {
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

  if (entering) {
    curtain.style.transform = "translate3d(0,0,0)";
    root.classList.remove("page-transition-pending");
    animateCurtain("0%", "-105%", 820).then(() => {
      curtain.style.transform = "translate3d(0,-105%,0)";
    });
  } else {
    root.classList.remove("page-transition-pending");
    curtain.style.transform = "translate3d(0,105%,0)";
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
    await animateCurtain("105%", "0%", 820);
    window.location.assign(destination.href);
  });
})();
