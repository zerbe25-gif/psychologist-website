/* DESKTOP PAGE TRANSITION — GSAP depth curtain, with Web Animations fallback */
(() => {
  const desktop = window.matchMedia("(min-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!desktop.matches || reducedMotion.matches) return;

  const body = document.body;
  const isArticlesPage = body.classList.contains("articles-page");
  const content = isArticlesPage
    ? [body.querySelector(".header"), body.querySelector(".articles-content")]
    : [body.querySelector(".header"), body.querySelector(".main-content")];
  const targets = content.filter(Boolean);
  if (!targets.length) return;

  const storageKey = "psychologistPageTransition";
  const curtain = document.createElement("div");
  curtain.className = "page-transition-curtain";
  curtain.setAttribute("aria-hidden", "true");
  body.appendChild(curtain);

  const loadGsap = () => new Promise(resolve => {
    if (window.gsap) return resolve(window.gsap);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => resolve(window.gsap || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  const animate = async (direction) => {
    /* The incoming curtain covers the document synchronously, before GSAP downloads. */
    if (direction === "enter") {
      curtain.style.transform = "translate3d(0,0,0)";
      targets.forEach(el => {
        el.style.transform = "translate3d(0,18px,0) scale(.985)";
        el.style.opacity = ".55";
      });
    }
    const gsap = await loadGsap();
    if (gsap) {
      if (direction === "leave") {
        gsap.set(curtain, { y: "105%" });
        return new Promise(resolve => {
          const tl = gsap.timeline({ onComplete: resolve });
          tl.to(targets, {
            y: -14, scale: 0.985, opacity: 0.58,
            duration: 0.48, ease: "power2.inOut", stagger: 0.015
          }, 0);
          tl.to(curtain, {
            y: "0%", duration: 0.62,
            ease: "power3.out"
          }, 0.04);
        });
      }
      gsap.set(curtain, { y: "0%" });
      gsap.set(targets, { y: 18, scale: 0.985, opacity: 0.55 });
      return new Promise(resolve => {
        const tl = gsap.timeline({ onComplete: resolve });
        tl.to(targets, {
          y: 0, scale: 1, opacity: 1,
          duration: 0.72, ease: "power3.out",
          stagger: 0.035
        }, 0);
        tl.to(curtain, {
          y: "-105%", duration: 0.78,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)"
        }, 0.02);
      });
    }

    const animations = direction === "leave"
      ? [
          ...targets.map(el => el.animate(
            [{ transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
             { transform: "translate3d(0,-14px,0) scale(.985)", opacity: .58 }],
            { duration: 480, easing: "ease-in-out", fill: "forwards" }
          )),
          curtain.animate(
            [{ transform: "translate3d(0,105%,0)" }, { transform: "translate3d(0,0,0)" }],
            { duration: 620, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
          )
        ]
      : [
          ...targets.map(el => el.animate(
            [{ transform: "translate3d(0,18px,0) scale(.985)", opacity: .55 },
             { transform: "translate3d(0,0,0) scale(1)", opacity: 1 }],
            { duration: 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }
          )),
          curtain.animate(
            [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,-105%,0)" }],
            { duration: 780, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
          )
        ];
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  };

  let entering = false;
  try {
    entering = sessionStorage.getItem(storageKey) === "enter";
    sessionStorage.removeItem(storageKey);
  } catch (error) {}

  if (entering) {
    animate("enter");
  } else {
    curtain.remove();
  }

  document.addEventListener("click", async event => {
    if (event.defaultPrevented || event.button !== 0 ||
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

    event.preventDefault();
    try { sessionStorage.setItem(storageKey, "enter"); } catch (error) {}
    await animate("leave");
    window.location.assign(destination.href);
  });
})();
