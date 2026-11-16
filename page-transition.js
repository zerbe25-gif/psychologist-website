/* DESKTOP PAGE TRANSITION — synchronized GSAP / Web Animations */
(() => {
  const desktop = window.matchMedia("(min-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!desktop.matches || reducedMotion.matches) return;

  const body = document.body;
  const root = document.documentElement;
  const isArticlesPage = body.classList.contains("articles-page");
  const targets = (isArticlesPage
    ? [body.querySelector(".header"), body.querySelector(".articles-content")]
    : [body.querySelector(".header"), body.querySelector(".main-content")]).filter(Boolean);
  if (!targets.length) {
    root.classList.remove("page-transition-pending");
    return;
  }

  const storageKey = "psychologistPageTransition";
  const curtain = document.createElement("div");
  curtain.className = "page-transition-curtain";
  curtain.setAttribute("aria-hidden", "true");
  body.appendChild(curtain);

  const loadGsap = () => new Promise(resolve => {
    if (window.gsap) return resolve(window.gsap);
    const existing = document.querySelector('script[data-page-transition-gsap]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.gsap || null), { once: true });
      existing.addEventListener("error", () => resolve(null), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.dataset.pageTransitionGsap = "true";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => resolve(window.gsap || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  /* Start loading GSAP before the visitor clicks. Never make navigation wait for the CDN. */
  loadGsap();

  const runWaapi = async direction => {
    const entering = direction === "enter";
    const pageFrames = entering
      ? [{ transform: "translate3d(0,18px,0) scale(.985)", opacity: .55 },
         { transform: "translate3d(0,0,0) scale(1)", opacity: 1 }]
      : [{ transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
         { transform: "translate3d(0,-14px,0) scale(.985)", opacity: .72 }];
    const curtainFrames = entering
      ? [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,-105%,0)" }]
      : [{ transform: "translate3d(0,105%,0)" }, { transform: "translate3d(0,0,0)" }];

    const pageAnimations = targets.map(el => el.animate(pageFrames, {
      duration: entering ? 760 : 500,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "both"
    }));
    const curtainAnimation = curtain.animate(curtainFrames, {
      duration: entering ? 780 : 640,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "both"
    });
    await Promise.all([...pageAnimations, curtainAnimation].map(a => a.finished.catch(() => {})));
    pageAnimations.forEach(a => a.cancel());
    targets.forEach(el => {
      el.style.removeProperty("transform");
      el.style.removeProperty("opacity");
    });
    curtainAnimation.cancel();
  };

  const runGsap = direction => new Promise(resolve => {
    const gsap = window.gsap;
    const entering = direction === "enter";
    gsap.killTweensOf([...targets, curtain]);
    gsap.set(curtain, { y: entering ? "0%" : "105%" });
    gsap.set(targets, entering
      ? { y: 18, scale: .985, opacity: .55 }
      : { y: 0, scale: 1, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(targets, { clearProps: "transform,opacity" });
        gsap.set(curtain, { clearProps: "transform" });
        resolve();
      }
    });

    if (entering) {
      tl.to(targets, {
        y: 0, scale: 1, opacity: 1,
        duration: .76, ease: "power3.out"
      }, 0);
      tl.to(curtain, {
        y: "-105%", duration: .78, ease: "power3.out"
      }, 0);
    } else {
      tl.to(targets, {
        y: -14, scale: .985, opacity: .72,
        duration: .50, ease: "power2.inOut"
      }, 0);
      tl.to(curtain, {
        y: "0%", duration: .64, ease: "power3.out"
      }, 0);
    }
  });

  const animate = direction => {
    /* On entry the head-level CSS veil is already covering the page. */
    if (direction === "enter") {
      curtain.style.transform = "translate3d(0,0,0)";
      root.classList.remove("page-transition-pending");
    }
    return window.gsap ? runGsap(direction) : runWaapi(direction);
  };

  let entering = false;
  try {
    entering = sessionStorage.getItem(storageKey) === "enter";
    sessionStorage.removeItem(storageKey);
  } catch (error) {}

  if (entering) {
    animate("enter").then(() => curtain.remove());
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

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    const destinationIsArticles = /\/articles\.html$/.test(destination.pathname);
    if (destinationIsArticles === isArticlesPage) return;

    const isHomeDestination = !destinationIsArticles &&
      (destination.pathname.endsWith("/index.html") ||
       destination.pathname.endsWith("/") ||
       destination.pathname === "/");
    if (!destinationIsArticles && !isHomeDestination) return;

    navigating = true;
    event.preventDefault();
    try { sessionStorage.setItem(storageKey, "enter"); } catch (error) {}
    await animate("leave");
    window.location.assign(destination.href);
  });
})();
