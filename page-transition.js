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

  /* Animate only the page content, never the decorative background layers. */
  const getPageDepthTargets = () => isArticlesPage
    ? [body.querySelector(".header"), body.querySelector(".articles-content"), body.querySelector(".articles-footer")]
    : [body.querySelector(".header"), body.querySelector(".main-content")];

  const animatePageDepth = (direction) => {
    const targets = getPageDepthTargets().filter(Boolean);
    const enteringPage = direction === "in";
    const frames = enteringPage
      ? [
          { transform: "translate3d(0,10px,0) scale(.996)", opacity: .94 },
          { transform: "translate3d(0,0,0) scale(1)", opacity: 1 }
        ]
      : [
          { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
          { transform: "translate3d(0,-9px,0) scale(.992)", opacity: .94 }
        ];

    const animations = targets.map((element) => element.animate(frames, {
      duration: enteringPage ? 760 : 820,
      easing: enteringPage
        ? "cubic-bezier(.16,1,.3,1)"
        : "cubic-bezier(.22,.61,.36,1)",
      fill: "both"
    }));

    return Promise.all(animations.map(animation =>
      animation.finished.catch(() => {}).then(() => animation.cancel())
    ));
  };

  if (entering) {
    curtain.style.transform = "translate3d(0,0,0)";
    root.classList.remove("page-transition-pending");
    const reveal = animateCurtain("0%", "-105%", 820);
    animatePageDepth("in");
    reveal.then(() => {
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
    await Promise.all([
      animateCurtain("105%", "0%", 820),
      animatePageDepth("out")
    ]);
    window.location.assign(destination.href);
  });
})();
