

/* =========================================
   ФОТОГРАФИИ
========================================= */

// Здесь в будущем будут размещаться твои фотографии.
// Каждую фотографию можно будет заменить,
// не меняя остальную часть программы.

const photoSets = {

    // Фотографии первой рамки
    first: [
        "images/photos/first-4.jpg",
        "images/photos/first-5.jpg",
        "images/photos/first-6.jpg"
    ],

 
};

const photoOne = document.getElementById("photo-one");
const photoOneNext = document.getElementById("photo-one-next");
const photoChangeTime = 15000;
const photoRevealDuration = 1000;
let firstPhotoIndex = -1;
let photoIsChanging = false;

function changePhoto(baseLayer, revealLayer, images) {
  if (!baseLayer || !revealLayer || !images.length || photoIsChanging) return;
  const nextIndex = (firstPhotoIndex + 1) % images.length;
  const nextSrc = images[nextIndex];
  photoIsChanging = true;
  const preload = new Image();
  preload.onload = () => {
    revealLayer.src = nextSrc;
    revealLayer.classList.remove("is-revealing");
    void revealLayer.offsetWidth;
    revealLayer.classList.add("is-revealing");
    window.setTimeout(() => {
      baseLayer.src = nextSrc;
      revealLayer.classList.remove("is-revealing");
      firstPhotoIndex = nextIndex;
      photoIsChanging = false;
    }, photoRevealDuration + 60);
  };
  preload.onerror = () => {
    photoIsChanging = false;
    console.warn("Не удалось загрузить фотографию:", nextSrc);
  };
  preload.src = nextSrc;
}

/* EDITORIAL CLIP-PATH — ЖУРНАЛЬНАЯ МАСКА */
if (photoOne && photoOneNext && photoSets.first.length) {
  window.setInterval(() => {
    /* Фотографии главной страницы остаются неподвижными,
       пока пользователь читает открытую информационную шторку. */
    if (document.body.classList.contains("drawer-is-open")) return;
    changePhoto(photoOne, photoOneNext, photoSets.first);
  }, photoChangeTime);
}
/* =========================================
   ФОРМА ЗАПИСИ
========================================= */

const appointmentForm = document.getElementById("appointment-form");
if (appointmentForm) {
  const appointmentSubmit = appointmentForm.querySelector('button[type="submit"]');
  const appointmentSuccess = document.getElementById("appointment-success");

  appointmentForm.action = "https://formspree.io/f/xppdwdjy";
  appointmentForm.method = "POST";

  appointmentForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!appointmentForm.reportValidity()) return;

    const originalLabel = appointmentSubmit.textContent;
    appointmentSubmit.disabled = true;
    appointmentSubmit.textContent = "Отправить";
    appointmentForm.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(appointmentForm.action, {
        method: "POST",
        body: new FormData(appointmentForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        let details = {};
        try { details = await response.json(); } catch (_) {}
        throw new Error(details.errors?.map(error => error.message).join(" ") || "Не удалось отправить заявку.");
      }

      appointmentForm.hidden = true;
      if (appointmentSuccess) appointmentSuccess.hidden = false;
    } catch (error) {
      let errorNote = document.getElementById("appointment-submit-error");
      if (!errorNote) {
        errorNote = document.createElement("p");
        errorNote.id = "appointment-submit-error";
        errorNote.className = "appointment-form-error";
        errorNote.setAttribute("role", "alert");
        appointmentSubmit.insertAdjacentElement("afterend", errorNote);
      }
      errorNote.textContent = "Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.";
      appointmentSubmit.disabled = false;
      appointmentSubmit.textContent = originalLabel;
    } finally {
      appointmentForm.removeAttribute("aria-busy");
    }
  });
}

/* ==========================================
   ПЕРЕКЛЮЧЕНИЕ СТИЛЕЙ АНИМАЦИИ МЕНЮ
   ========================================== */

const animationDescriptions = {
    1: "Градиент + Мягкое смещение вправо + Овальный маркер + Расфокусировка",
    2: "Динамический градиент внутри букв + Лёгкий подъём надписи",
    3: "Глубокая многослойная тень + Эффект тиснения и барельефа",
    4: "Раскрывающаяся линия + Увеличенный трекинг шрифта"
};

function setMenuAnimation(mode) {
    const menu = document.querySelector(".section-menu");
    const description = document.getElementById("animation-description");

    if (!menu || !description) return;

    menu.classList.remove(
        "effect-mode-1",
        "effect-mode-2",
        "effect-mode-3",
        "effect-mode-4"
    );

    menu.classList.add(`effect-mode-${mode}`);

    description.textContent = animationDescriptions[mode];

    document.querySelectorAll(".animation-tab").forEach(button => {
        const isActive = button.dataset.effect === String(mode);

        button.classList.toggle("active", isActive);
    });
}

document.querySelectorAll(".animation-tab").forEach(button => {
    button.addEventListener("click", () => {
        setMenuAnimation(button.dataset.effect);
    });
});

/* Начальный режим */
setMenuAnimation(1);


// Самостоятельная система фона A/B/C с отдельным состоянием фактур и света.
const homeBackgroundStorageKey='psychologistHomeBackgroundCompositionV1';
const homeBackgroundDefaults={variant:'A',hatch:true,grid:false,grain:true,hatchOpacity:18,gridOpacity:14,grainOpacity:20,light1:{color:'#397A78',opacity:24,x:82,y:28,width:62,height:48},light2:{color:'#D6AD76',opacity:16,x:76,y:68,width:82,height:16}};
let homeBackgroundState=JSON.parse(JSON.stringify(homeBackgroundDefaults));
try{const saved=JSON.parse(localStorage.getItem(homeBackgroundStorageKey)||'{}');homeBackgroundState={...homeBackgroundDefaults,...saved,light1:{...homeBackgroundDefaults.light1,...(saved.light1||{})},light2:{...homeBackgroundDefaults.light2,...(saved.light2||{})}};}catch(error){}
function renderHomeBackground(){
 const body=document.body,root=document.documentElement;body.classList.add('home-background-active');body.dataset.homeBackground=homeBackgroundState.variant;
 ['hatch','grid','grain'].forEach(k=>{body.dataset['home'+k[0].toUpperCase()+k.slice(1)]=homeBackgroundState[k]?'on':'off';const el=document.getElementById('home-texture-'+k);if(el)el.checked=!!homeBackgroundState[k];});
 ['hatchOpacity','gridOpacity','grainOpacity'].forEach(k=>{const css='--home-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());root.style.setProperty(css,Number(homeBackgroundState[k])/100);const id='home-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());const input=document.getElementById(id),out=document.getElementById(id+'-value');if(input)input.value=homeBackgroundState[k];if(out)out.textContent=homeBackgroundState[k]+'%';});
 [1,2].forEach(n=>Object.entries(homeBackgroundState['light'+n]).forEach(([k,v])=>{root.style.setProperty('--home-light'+n+'-'+k,k==='color'?v:Number(v)+'%');const input=document.getElementById('home-light'+n+'-'+k),out=document.getElementById('home-light'+n+'-'+k+'-value');if(input)input.value=v;if(out)out.textContent=v+'%';}));
 document.querySelectorAll('[data-home-variant]').forEach(b=>b.classList.toggle('is-active',b.dataset.homeVariant===homeBackgroundState.variant));
}
function saveHomeBackground(){renderHomeBackground();try{localStorage.setItem(homeBackgroundStorageKey,JSON.stringify(homeBackgroundState));}catch(error){}}
function setHomeBackgroundVariant(v){if(!['A','B','C'].includes(v))return;homeBackgroundState.variant=v;saveHomeBackground();}
function updateHomeBackgroundSetting(k,v){if(!['hatch','grid','grain','hatchOpacity','gridOpacity','grainOpacity'].includes(k))return;homeBackgroundState[k]=['hatch','grid','grain'].includes(k)?!!v:Math.max(0,Math.min(60,Number(v)||0));saveHomeBackground();}
function updateHomeLight(n,k,v){if(![1,2].includes(Number(n))||!['color','opacity','x','y','width','height'].includes(k))return;if(k==='color'){if(!/^#[0-9a-f]{6}$/i.test(v))return;homeBackgroundState['light'+n][k]=v.toUpperCase();}else{const max=k==='opacity'?(n===1?55:45):100;homeBackgroundState['light'+n][k]=Math.max(0,Math.min(max,Number(v)||0));}saveHomeBackground();}
function initializeHomeBackground(){if(!document.getElementById('background-lab-atmosphere')||!document.querySelector('.photo-gallery'))return;renderHomeBackground();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeHomeBackground,{once:true});else initializeHomeBackground();

// ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ ПАНЕЛИ РАЗРАБОТКИ
// =======================================================


// =======================================================
/* =========================================
   ЕДИНАЯ ИНФОРМАЦИОННАЯ ШТОРКА
========================================= */

(function () {
  const drawer=document.getElementById("sideDrawer");
  const backdrop=document.getElementById("drawerBackdrop");
  const closeButton=document.getElementById("drawerClose");
  const viewport=document.getElementById("drawerViewport");
  const tabs=[...document.querySelectorAll("#sideDrawer [data-drawer-tab]")];
  const tabsNav=tabs[0] ? tabs[0].parentElement : null;
  const sections=[...document.querySelectorAll("#sideDrawer .block-section")];
  const currentStep=document.getElementById("currentStep");
  if(!drawer||!backdrop||!closeButton||!viewport||sections.length!==4)return;

  const sectionKeys=["method","requests","format","education"];
  let currentBlock=0,drawerOpen=false,previousFocus=null,framePending=false;

  function updateNavUI(){
    tabs.forEach((tab,index)=>{
      const active=index===currentBlock;
      tab.classList.toggle("is-active",active);
      tab.setAttribute("aria-current",active?"location":"false");
    });

    /* Один независимый индикатор движется к активному пункту.
       CSS интерполирует его координату даже если прокрутка быстро перескочила
       через несколько разделов — активная подпись не меняет размер и не дёргает ряд. */
    const activeTab=tabs[currentBlock];
    if(tabsNav && activeTab){
      tabsNav.style.setProperty("--nav-indicator-x",activeTab.offsetLeft+"px");
      tabsNav.style.setProperty("--nav-indicator-width",activeTab.offsetWidth+"px");
    }
    if(currentStep)currentStep.textContent=String(currentBlock+1);
  }

  function updateReadingPosition(){
    framePending=false;
    const viewportRect=viewport.getBoundingClientRect();
    const viewportHeight=viewport.clientHeight;
    if(!viewportHeight)return;

    /* Transition begins only after the next section has entered the lower
       third. Its progress is tied to geometry, so it reverses naturally. */
    const startY=viewportRect.bottom-viewportHeight*.30;
    const endY=viewportRect.top+viewportHeight*.34;
    const span=Math.max(1,startY-endY);
    let activeFromTransition=null;

    sections.forEach((section,index)=>{
      section.classList.remove("is-entering-from-below");
      section.style.removeProperty("--section-entry-opacity");
      section.style.removeProperty("--section-entry-y");

      if(index===sections.length-1){
        section.classList.remove("is-transition-blurring");
        section.style.removeProperty("--section-transition-blur");
        return;
      }

      const nextRect=sections[index+1].getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(startY-nextRect.top)/span));
      const blurAmount=1.35*progress;

      if(blurAmount>.005){
        section.style.setProperty("--section-transition-blur",blurAmount.toFixed(3)+"px");
        section.classList.add("is-transition-blurring");
      }else{
        section.style.removeProperty("--section-transition-blur");
        section.classList.remove("is-transition-blurring");
      }

      /* Header changes at the very beginning of the actual blur transition,
         not when a tiny strip of the next section first becomes visible. */
      if(progress>=.08)activeFromTransition=index+1;
      else if(progress>0&&activeFromTransition===null)activeFromTransition=index;
    });

    let nextBlock=activeFromTransition;
    if(nextBlock===null){
      const readingLine=viewportRect.top+viewportHeight*.56;
      nextBlock=0;
      sections.forEach((section,index)=>{
        if(section.getBoundingClientRect().top<=readingLine)nextBlock=index;
      });
    }

    nextBlock=Math.max(0,Math.min(sections.length-1,nextBlock));
    if(nextBlock!==currentBlock){
      currentBlock=nextBlock;
      updateNavUI();
    }
  }

  function scheduleReadingPosition(){
    if(framePending)return;
    framePending=true;
    window.requestAnimationFrame(updateReadingPosition);
  }

  function goToBlock(targetIndex, instant=false){
    if(targetIndex<0||targetIndex>=sections.length)return;
    const target=sections[targetIndex];
    /* Use viewport-relative geometry instead of offsetTop: nested positioned
       sections can otherwise resolve their offset against a different ancestor. */
    const viewportTop=viewport.getBoundingClientRect().top;
    const targetTop=target.getBoundingClientRect().top;
    const destination=Math.max(0,viewport.scrollTop+(targetTop-viewportTop));
    if(instant) viewport.scrollTop=destination;
    else viewport.scrollTo({top:destination,behavior:"smooth"});
    currentBlock=targetIndex;
    updateNavUI();
  }

  function openDrawer(sectionName){
    const index=sectionKeys.indexOf(sectionName);
    if(index<0)return;
    const wasClosed=!drawerOpen;
    if(wasClosed){
      previousFocus=document.activeElement;
      drawerOpen=true;
      backdrop.classList.add("is-open");
      drawer.classList.add("is-open");
      document.body.classList.add("drawer-is-open");
      drawer.setAttribute("aria-hidden","false");
      backdrop.setAttribute("aria-hidden","false");
    }
    goToBlock(index,wasClosed);
    closeButton.focus();
  }

  function closeDrawer(){
    if(!drawerOpen)return;
    drawerOpen=false;
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.classList.remove("drawer-is-open");
    drawer.setAttribute("aria-hidden","true");
    backdrop.setAttribute("aria-hidden","true");
    if(previousFocus&&typeof previousFocus.focus==="function")previousFocus.focus();
  }

  viewport.addEventListener("scroll",scheduleReadingPosition,{passive:true});
  window.addEventListener("resize",()=>{updateNavUI();scheduleReadingPosition();},{passive:true});
  document.querySelectorAll("[data-drawer-open]").forEach(button=>{
    button.addEventListener("click",()=>openDrawer(button.dataset.drawerOpen));
  });
  tabs.forEach((button,index)=>button.addEventListener("click",()=>{goToBlock(index);if(index===0)revealMethodHeading();}));
  closeButton.addEventListener("click",closeDrawer);
  backdrop.addEventListener("click",closeDrawer);
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&drawerOpen)closeDrawer();
  });

  updateNavUI();
  scheduleReadingPosition();
})();

/* ===== FINAL FIX: ОКНА И ПАНЕЛЬ ===== */

window.toggleDevPanelSection = function(section) {
  const sectionIds = {
    animation: "animation-control-panel",
    "editorial-background": "editorial-background-panel",
    cost: "cost-control-panel"
  };
  const panelId = sectionIds[section];
  if (panelId) setDeveloperPanel(panelId);
};


/* Закрытие всей панели разработчика */

window.closeDeveloperPanel = function() {
  const content = document.getElementById("developer-panel-content");

  if (content) {
    content.hidden = true;
    content.style.display = "none";
  }

  document.querySelectorAll(
    "#developer-panel .developer-panel-tab"
  ).forEach(button => {
    button.classList.remove("active");
    button.setAttribute("aria-selected", "false");
  });
};


/* =========================================
   ORGANIC CAPSULE — ОБЩЕЕ УПРАВЛЕНИЕ
========================================= */

(function () {
    const backdrop = document.getElementById("costBackdrop");
    const costModal = document.getElementById("costModal");
    const contactsModal = document.getElementById("contactsModal");
    const appointmentModal = document.getElementById("appointmentModal");

    if (!backdrop) return;

    let activeCapsule = null;
    let previousFocus = null;

    function openCapsule(modal) {
        if (!modal) return;

        if (activeCapsule) {
            activeCapsule.classList.remove("is-open");
            activeCapsule.setAttribute("aria-hidden", "true");
        }

        previousFocus = document.activeElement;
        activeCapsule = modal;

        backdrop.classList.add("is-open");
        modal.classList.add("is-open");

        backdrop.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("cost-modal-open");

        const modalScroller = modal.querySelector(".cost-scroll-viewport, .appointment-card-content");
        if (modalScroller) modalScroller.scrollTop = 0;
    }

    function closeCapsule() {
        if (!activeCapsule) return;

        activeCapsule.classList.remove("is-open");
        activeCapsule.setAttribute("aria-hidden", "true");

        backdrop.classList.remove("is-open");
        backdrop.setAttribute("aria-hidden", "true");

        document.body.classList.remove("cost-modal-open");

        activeCapsule = null;

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    document.querySelectorAll("[data-cost-open]").forEach(button => {
        if (costModal) button.addEventListener("click", () => openCapsule(costModal));
    });

    document.querySelectorAll("[data-contacts-open]").forEach(button => {
        if (contactsModal) button.addEventListener("click", () => openCapsule(contactsModal));
    });

    // Переход из окна стоимости в запись с выбранным форматом
    const costFormatMap = {
        individual: "Индивидуальная работа",
        couples: "Работа с парой",
        teenagers: "Работа с подростками"
    };

    if (costModal && appointmentModal) {
        costModal.querySelectorAll("[data-cost-method]").forEach(button => {
            button.addEventListener("click", () => {
                const method = button.dataset.costMethod;
                const formatSelect = appointmentModal.querySelector("#appointment-format");
                const desiredFormat = costFormatMap[method];

                if (formatSelect && desiredFormat) {
                    const matchingOption = Array.from(formatSelect.options).find(
                        option => option.textContent.trim() === desiredFormat
                    );
                    if (matchingOption) formatSelect.value = matchingOption.value;
                }

                openCapsule(appointmentModal);
            });
        });
    }

    document.querySelectorAll("[data-appointment-open]").forEach(button => {
        if (appointmentModal) button.addEventListener("click", () => openCapsule(appointmentModal));
    });

    document.querySelectorAll("[data-capsule-close]").forEach(button => {
        button.addEventListener("click", closeCapsule);
    });

    // Сохраняем старый атрибут закрытия окна стоимости
    document.querySelectorAll("[data-cost-close]").forEach(button => {
        button.addEventListener("click", closeCapsule);
    });

    backdrop.addEventListener("click", closeCapsule);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && activeCapsule) {
            closeCapsule();
        }
    });

    // Для тестирования
    window.openCostModal = () => openCapsule(costModal);
    window.openContactsModal = () => openCapsule(contactsModal);
    window.openAppointmentModal = () => openCapsule(appointmentModal);
    window.closeCapsuleModal = closeCapsule;
})();



/* Настройки внешнего вида Organic Capsule формы записи */
(function () {
  const key = "psychologistAppointmentCapsuleSettings";
  const root = document.documentElement;
  const defaults = { opacity: 88, blur: 28, glow: 12, button: "#39475E" };
  let s = { ...defaults };
  try { s = { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch (error) {}
  function apply() {
    root.style.setProperty("--appointment-card-opacity", Number(s.opacity) / 100);
    root.style.setProperty("--appointment-card-blur", Number(s.blur) + "px");
    root.style.setProperty("--appointment-glow", Number(s.glow) / 100);
    root.style.setProperty("--appointment-button", s.button);
    root.style.setProperty("--capsule-card-opacity", Number(s.opacity) / 100);
    root.style.setProperty("--capsule-card-blur", Number(s.blur) + "px");
    root.style.setProperty("--capsule-card-glow", Number(s.glow) / 100);
    root.style.setProperty("--capsule-accent", s.button);
    const fields = [["opacity","appointment-opacity","val-appointment-opacity",v=>v+"%"],["blur","appointment-blur","val-appointment-blur",v=>v+" px"],["glow","appointment-glow","val-appointment-glow",v=>v+"%"],["button","appointment-button-color","val-appointment-button-color",v=>String(v).toUpperCase()]];
    fields.forEach(([name,id,out,fmt])=>{const el=document.getElementById(id), label=document.getElementById(out);if(el)el.value=s[name];if(label)label.textContent=fmt(s[name]);});
  }
  window.updateAppointmentSetting = (type,value) => {
    if (!(type in defaults)) return;
    s[type] = type === "button" ? value : Number(value);
    apply();
    try { localStorage.setItem(key,JSON.stringify(s)); } catch(error) {}
  };
  apply();
})();

/* Настройки общей анимации капсульных окон */
(function () {
  const root=document.documentElement, key="psychologistCostCapsuleSettings";
  const defaults={overlay:48,blur:8,card:.55,content:.4,close:.35};
  let s={...defaults};
  try{s={...defaults,...JSON.parse(localStorage.getItem(key)||"{}")};}catch(error){}
  function apply(){
    root.style.setProperty("--cost-overlay-opacity",s.overlay/100);
    root.style.setProperty("--cost-blur",s.blur+"px");
    root.style.setProperty("--cost-card-duration",s.card+"s");
    root.style.setProperty("--cost-content-duration",s.content+"s");
    root.style.setProperty("--cost-close-duration",s.close+"s");
    [["cost-overlay-input","val-cost-overlay",s.overlay,v=>v+"%"],["cost-blur-input","val-cost-blur",s.blur,v=>v+" px"],["cost-card-input","val-cost-card",s.card,v=>Number(v).toFixed(2)+" сек."],["cost-content-input","val-cost-content",s.content,v=>Number(v).toFixed(2)+" сек."],["cost-close-input","val-cost-close",s.close,v=>Number(v).toFixed(2)+" сек."]].forEach(([id,out,v,fmt])=>{const el=document.getElementById(id),label=document.getElementById(out);if(el)el.value=v;if(label)label.textContent=fmt(v);});
  }
  function set(k,v){s[k]=Number(v);apply();try{localStorage.setItem(key,JSON.stringify(s));}catch(error){}}
  window.updateCostOverlay=v=>set("overlay",v);
  window.updateCostBlur=v=>set("blur",v);
  window.updateCostCardDuration=v=>set("card",v);
  window.updateCostContentDuration=v=>set("content",v);
  window.updateCostCloseDuration=v=>set("close",v);
  apply();
})();



/* SHARED CAPSULE SCROLLBAR — same geometry and drag behavior for Cost and Appointment */
(function () {
  function initCustomScrollbar(scrollerId, trackId, thumbId) {
    const scroller = document.getElementById(scrollerId);
    const track = document.getElementById(trackId);
    const thumb = document.getElementById(thumbId);
    if (!scroller || !track || !thumb) return;

    let dragging = false;
    let dragStartY = 0;
    let dragStartTop = 0;

    function dimensions() {
      const trackHeight = track.clientHeight;
      const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const naturalHeight = trackHeight * scroller.clientHeight / Math.max(1, scroller.scrollHeight);
      const thumbHeight = Math.min(trackHeight, Math.max(26, naturalHeight * 0.8));
      return { trackHeight, maxScroll, thumbHeight, travel: Math.max(1, trackHeight - thumbHeight) };
    }

    function update() {
      const d = dimensions();
      if (d.maxScroll <= 1 || d.trackHeight <= 0) {
        track.classList.add("is-hidden");
        return;
      }
      track.classList.remove("is-hidden");
      const progress = scroller.scrollTop / d.maxScroll;
      thumb.style.height = d.thumbHeight + "px";
      thumb.style.transform = "translateY(" + (d.travel * progress) + "px)";
      thumb.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    }

    function scrollFromPointer(clientY) {
      const rect = track.getBoundingClientRect();
      const d = dimensions();
      const y = Math.max(0, Math.min(d.travel, clientY - rect.top - d.thumbHeight / 2));
      scroller.scrollTop = (y / d.travel) * d.maxScroll;
    }

    track.addEventListener("pointerdown", event => {
      if (event.target !== thumb) {
        scrollFromPointer(event.clientY);
        update();
        return;
      }
      dragging = true;
      dragStartY = event.clientY;
      dragStartTop = scroller.scrollTop;
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    track.addEventListener("pointermove", event => {
      if (!dragging) return;
      const d = dimensions();
      scroller.scrollTop = dragStartTop + (event.clientY - dragStartY) / d.travel * d.maxScroll;
    });
    track.addEventListener("pointerup", () => { dragging = false; });
    track.addEventListener("pointercancel", () => { dragging = false; });
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(scroller);
    update();
  }

  initCustomScrollbar("costScrollViewport", "costScrollTrack", "costScrollThumb");
  initCustomScrollbar("appointmentModalScroller", "appointmentScrollTrack", "appointmentScrollThumb");
})();


// ЛАБОРАТОРИЯ ФОНА: независимое раскрытие модулей (этапная интеграция)
const DEVELOPER_PANEL_IDS = ['animation-control-panel','cost-control-panel','appointment-control-panel','editorial-background-panel'];

function setDeveloperPanel(sectionId, button) {
  const content = document.getElementById('developer-panel-content');
  const target = document.getElementById(sectionId);
  if (!content || !target) return;

  const isOpen = !content.hidden && !target.hidden;
  DEVELOPER_PANEL_IDS.forEach(id => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.hidden = true;
      panel.style.display = "";
    }
  });
  document.querySelectorAll('.developer-panel-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-expanded','false');
  });

  if (isOpen) {
    content.hidden = true;
    return;
  }

  content.hidden = false;
  content.style.display = "block";
  target.hidden = false;
  target.style.display = "";
  const activeTab = button || document.querySelector(
    `.developer-panel-tab[data-panel-section="${sectionId.replace('-control-panel','').replace('-panel-content','')}"]`
  );
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-expanded','true');
  }
}

function toggleBackgroundLabBlock(panelId, button) {
  setDeveloperPanel(panelId, button);
}


/* Сдвигаем информационную шторку под фактическую высоту панели управления. */
(function syncDrawerBelowDeveloperPanel() {
  function updateDrawerOffset() {
    const panel = document.getElementById("developer-panel");
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const bottom = Math.max(0, Math.ceil(rect.bottom));
    const height = Math.max(0, Math.ceil(panel.offsetHeight));
    const header = document.querySelector("body > .header");
    const headerHeight = header ? Math.max(0, Math.ceil(header.offsetHeight)) : 52;
    document.documentElement.style.setProperty("--developer-panel-bottom", bottom + "px");
    document.documentElement.style.setProperty("--developer-panel-height", height + "px");
    document.documentElement.style.setProperty("--site-header-height", headerHeight + "px");
  }

  function init() {
    const panel = document.getElementById("developer-panel");
    if (!panel) return;
    updateDrawerOffset();

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateDrawerOffset);
      observer.observe(panel);
      const content = document.getElementById("developer-panel-content");
      if (content) observer.observe(content);
    }

    window.addEventListener("resize", updateDrawerOffset, { passive: true });
    window.addEventListener("orientationchange", updateDrawerOffset, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();


/* РАЗДЕЛ «ЗАПРОСЫ»: монолитный аккордеон с клавиатурной навигацией */
(function initRequestsMonolith() {
  const root = document.querySelector('#sideDrawer [data-drawer-panel="requests"]');
  if (!root) return;
  const items = Array.from(root.querySelectorAll('.requests-monolith-item'));
  if (!items.length) return;

  function setOpen(item, open, moveFocus) {
    const button = item.querySelector('.requests-monolith-trigger');
    const content = item.querySelector('.requests-monolith-content');
    item.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    content.hidden = !open;
    if (moveFocus) button.focus();
  }

  items.forEach((item, index) => {
    const button = item.querySelector('.requests-monolith-trigger');
    button.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      items.forEach(other => setOpen(other, false, false));
      if (shouldOpen) setOpen(item, true, false);
    });

    button.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % items.length;
      else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = items.length - 1;
      else return;
      event.preventDefault();
      items[next].querySelector('.requests-monolith-trigger').focus();
    });
  });

  const initiallyOpen = items.find(item => item.classList.contains('is-open'));
  items.forEach(item => setOpen(item, item === initiallyOpen, false));
})();


/* ФОРМАТ РАБОТЫ — аккордеон и анимация блоков ритма */
(function initFormatWorkPanel() {
  const root = document.querySelector('#sideDrawer [data-drawer-panel="format"]');
  if (!root) return;
  const data = [
    { num:"01", title:"Бесплатная диагностическая сессия", expandable:false, meta:"", details:"" },
    { num:"02", title:"Индивидуальная терапия", expandable:true, meta:"50 минут · 40–50 € / 4000–5000 ₽", details:"Длительная индивидуальная терапия — это процесс глубокого изучения ваших переживаний; бережно исследуем актуальные запросы, внутренние опоры и повторяющиеся сценарии в спокойном контакте." },
    { num:"03", title:"Работа с подростками", expandable:true, meta:"50 минут · 40–50 € / 4000–5000 ₽", details:"Индивидуальная терапевтическая работа с подростками с учетом их возраста, внутренней динамики, семейной системы и социальной среды." },
    { num:"04", title:"Работа с парами", expandable:true, meta:"60–90 минут · 60–80 € / 6000–8000 ₽", details:"Совместная работа с отношениями, повторяющимися конфликтами, эмоциональной дистанцией и трудностями взаимопонимания в паре." }
  ];
  let openIndex = -1;
  const container = root.querySelector('#fw-formats-container');
  if (!container) return;

  function render() {
    container.innerHTML = data.map((item, index) => {
      const open = item.expandable && openIndex === index;
      const sign = item.expandable ? (open ? "−" : "+") : "";
      return `
        <article class="fw-format-entry">
          <button type="button" data-format-index="${index}" ${item.expandable ? `aria-expanded="${open}" aria-controls="fw-format-content-${index}"` : "disabled"}
            class="fw-format-btn ${item.expandable ? "is-expandable" : ""} ${open ? "is-open" : ""}">
            <span class="fw-format-num">${item.num}</span>
            <span class="fw-format-title">${item.title}</span>
            <span class="fw-format-sign" aria-hidden="true">${sign}</span>
          </button>
          ${item.expandable ? `
            <div class="fw-accordion-wrap ${open ? "is-open" : ""}" id="fw-format-content-${index}">
              <div class="fw-accordion-clip"><div class="fw-accordion-body">
                <p class="fw-price-meta">${item.meta}</p>
                <p class="fw-format-details">${item.details}</p>
              </div></div>
            </div>` : ""}
        </article>`;
    }).join("");
    container.querySelectorAll(".fw-format-btn.is-expandable").forEach(button => {
      button.addEventListener("click", () => {
        const actualIndex = Number(button.dataset.formatIndex);
        openIndex = openIndex === actualIndex ? -1 : actualIndex;
        render();
      });
    });
  }
  render();

  /* Повторяемый reveal: вниз — после полного входа карточки,
     вверх — когда в область просмотра входит не менее трети карточки. */
  const rhythmSection = root.querySelector('#fw-rhythm-section');
  const cards = Array.from(root.querySelectorAll('.fw-rhythm-card'));
  const viewport = root.closest('.viewport') || document.querySelector('#sideDrawer .viewport');
  if (rhythmSection && cards.length && viewport) {
    let framePending = false;

    function updateRhythmReveal() {
      framePending = false;
      const viewportRect = viewport.getBoundingClientRect();
      const viewTop = viewportRect.top;
      const viewBottom = viewportRect.bottom;
      const viewHeight = viewport.clientHeight || viewportRect.height;

      const sectionRect = rhythmSection.getBoundingClientRect();
      const groupOutside = sectionRect.bottom <= viewTop || sectionRect.top >= viewBottom;
      if (groupOutside) rhythmSection.classList.remove('is-visible');

      let anyCardVisible = false;
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const fullyOutside = rect.bottom <= viewTop || rect.top >= viewBottom;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewBottom) - Math.max(rect.top, viewTop));
        const visibleRatio = rect.height ? visibleHeight / rect.height : 0;
        /* Не ждём полного размещения карточки во viewport:
           достаточно, чтобы в него вошла треть карточки, при любом направлении прокрутки. */
        const shouldReveal = visibleRatio >= 1 / 3;

        if (fullyOutside) {
          card.classList.remove('is-revealed');
        } else {
          anyCardVisible = true;
          if (shouldReveal && !card.classList.contains('is-revealed')) {
            card.classList.add('is-revealed');
          }
        }
      });

      if (!anyCardVisible) rhythmSection.classList.remove('is-visible');
      else if (cards.some(card => card.classList.contains('is-revealed'))) {
        rhythmSection.classList.add('is-visible');
      }
    }

    function scheduleRhythmReveal() {
      if (framePending) return;
      framePending = true;
      window.requestAnimationFrame(updateRhythmReveal);
    }

    viewport.addEventListener('scroll', scheduleRhythmReveal, { passive: true });
    window.addEventListener('resize', scheduleRhythmReveal, { passive: true });
    scheduleRhythmReveal();
  }
})();

/* Интерактивная композиция «Три измерения целостности». */
(function initMethodDimensionsConstellation() {
  const root = document.querySelector('#sideDrawer [data-drawer-panel="method"] [data-method-dimensions]');
  if (!root) return;

  const dimensions = [
    { num: "01", title: "Психический уровень", en: "PSYCHOLOGY", text: "Внутренние конфликты, бессознательные сценарии, защитные механизмы и история привязанности." },
    { num: "02", title: "Социальный контекст", en: "SOCIAL CONTEXT", text: "Культурная среда, семейная система, профессиональная нагрузка и качество отношений с другими." },
    { num: "03", title: "Биологический ресурс", en: "PHYSIOLOGY", text: "Соматическое здоровье, нейробиология стресса, истощение нервной системы и телесные реакции." }
  ];
  const field = root.querySelector('[data-dimensions-field]');
  const counter = root.querySelector('[data-dimensions-counter]');
  const monograms = Array.from(root.querySelectorAll('[data-monogram]'));
  if (!field || !counter) return;

  let pinnedIndex = -1;
  let hoveredIndex = -1;

  function updateMonogram() {
    const active = hoveredIndex !== -1 ? hoveredIndex : pinnedIndex;
    monograms.forEach((item, index) => item.classList.toggle('is-visible', index === active));
  }

  function render() {
    field.innerHTML = '<div class="method-dimensions-constellation">' +
      dimensions.map((item, index) => {
        const pinned = pinnedIndex === index;
        return '<div class="method-dimensions-node coord-' + (index + 1) + (pinned ? ' is-pinned' : '') + '"' +
          ' data-dimension-index="' + index + '" role="button" tabindex="0" aria-pressed="' + pinned + '"' +
          ' aria-label="' + item.title + '. Нажмите, чтобы закрепить описание">' +
          '<div class="method-dimensions-head">' +
            '<span class="method-dimensions-num">' + item.num + '</span>' +
            '<div class="method-dimensions-title-stack">' +
              '<h2 class="method-dimensions-title">' + item.title + '</h2>' +
              '<span class="method-dimensions-en">' + item.en + '</span>' +
            '</div>' +
            '<span class="method-dimensions-pin" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="method-dimensions-reveal"><p>' + item.text + '</p></div>' +
        '</div>';
      }).join('') + '</div>';

    counter.textContent = pinnedIndex >= 0 ? dimensions[pinnedIndex].num + ' — 03' : '01 — 03';
    updateMonogram();
  }

  field.addEventListener('pointerover', event => {
    const node = event.target.closest('[data-dimension-index]');
    if (!node || !field.contains(node)) return;
    hoveredIndex = Number(node.dataset.dimensionIndex);
    updateMonogram();
  });
  field.addEventListener('pointerout', event => {
    const node = event.target.closest('[data-dimension-index]');
    if (!node || node.contains(event.relatedTarget)) return;
    hoveredIndex = -1;
    updateMonogram();
  });
  field.addEventListener('click', event => {
    const node = event.target.closest('[data-dimension-index]');
    if (!node || !field.contains(node)) return;
    const index = Number(node.dataset.dimensionIndex);
    pinnedIndex = pinnedIndex === index ? -1 : index;
    render();
    const next = field.querySelector('[data-dimension-index="' + index + '"]');
    if (next) next.focus({ preventScroll: true });
  });
  field.addEventListener('keydown', event => {
    const node = event.target.closest('[data-dimension-index]');
    if (!node || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    node.click();
  });

  render();
})();


/* ==========================================
   СОВРЕМЕННАЯ ВЕБ-ПАЛИТРА ЦВЕТА
   Собственный Chromium-style picker вместо системного диалога ОС
========================================== */
(() => {
  const sources = Array.from(document.querySelectorAll('input[type="color"]'));
  if (!sources.length) return;

  const presets = [
    "#263746", "#39475E", "#526B78", "#397A78",
    "#6F8D83", "#A9B9A8", "#D6AD76", "#C18B5B",
    "#A86F62", "#8A6478", "#746B91", "#E8E1D5"
  ];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const toHex = value => "#" + value.map(v => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  const hsvToRgb = (h, s, v) => {
    const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
    let rgb = h < 60 ? [c,x,0] : h < 120 ? [x,c,0] : h < 180 ? [0,c,x] : h < 240 ? [0,x,c] : h < 300 ? [x,0,c] : [c,0,x];
    return rgb.map(n => (n + m) * 255);
  };
  const rgbToHsv = hex => {
    const raw = hex.replace("#", "");
    const r = parseInt(raw.slice(0,2),16)/255, g = parseInt(raw.slice(2,4),16)/255, b = parseInt(raw.slice(4,6),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
    let h = 0;
    if (d) {
      if (max === r) h = 60 * (((g-b)/d) % 6);
      else if (max === g) h = 60 * ((b-r)/d + 2);
      else h = 60 * ((r-g)/d + 4);
    }
    return { h: (h+360)%360, s: max ? d/max : 0, v: max };
  };

  sources.forEach(source => {
    const wrap = document.createElement("div");
    wrap.className = "web-color-picker";
    wrap.innerHTML = `
      <button class="web-color-trigger" type="button" aria-label="Выбрать цвет" aria-expanded="false">
        <span class="web-color-preview"></span><span class="web-color-trigger-value"></span><span class="web-color-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="web-color-popover" hidden>
        <div class="web-color-popover-head"><span>Выбор цвета</span><button class="web-color-close" type="button" aria-label="Закрыть">×</button></div>
        <div class="web-color-sv" role="slider" tabindex="0" aria-label="Насыщенность и яркость"><span class="web-color-sv-cursor"></span></div>
        <div class="web-color-hue-row"><span>Оттенок</span><input class="web-color-hue" type="range" min="0" max="360" value="160" aria-label="Оттенок"></div>
        <div class="web-color-hex-row"><label>HEX<input class="web-color-hex" type="text" maxlength="7" spellcheck="false" aria-label="HEX цвет"></label><span class="web-color-current"></span></div>
        <div class="web-color-presets-label">Быстрый выбор</div><div class="web-color-presets"></div>
      </div>`;
    source.insertAdjacentElement("afterend", wrap);
    source.classList.add("web-color-source");
    const trigger = wrap.querySelector(".web-color-trigger");
    const pop = wrap.querySelector(".web-color-popover");
    const preview = wrap.querySelector(".web-color-preview");
    const triggerValue = wrap.querySelector(".web-color-trigger-value");
    const sv = wrap.querySelector(".web-color-sv");
    const cursor = wrap.querySelector(".web-color-sv-cursor");
    const hue = wrap.querySelector(".web-color-hue");
    const hex = wrap.querySelector(".web-color-hex");
    const current = wrap.querySelector(".web-color-current");
    const presetBox = wrap.querySelector(".web-color-presets");
    let state = rgbToHsv(source.value || "#397A78");

    presets.forEach(color => {
      const chip = document.createElement("button");
      chip.type = "button"; chip.className = "web-color-chip";
      chip.style.backgroundColor = color; chip.setAttribute("aria-label", color);
      chip.addEventListener("click", () => applyHex(color));
      presetBox.appendChild(chip);
    });

    function paint() {
      const color = toHex(hsvToRgb(state.h,state.s,state.v));
      source.value = color.toLowerCase();
      preview.style.background = color;
      triggerValue.textContent = color;
      hex.value = color;
      current.textContent = color;
      hue.value = Math.round(state.h);
      sv.style.backgroundColor = `hsl(${state.h}, 100%, 50%)`;
      cursor.style.left = (state.s*100)+"%";
      cursor.style.top = ((1-state.v)*100)+"%";
      source.dispatchEvent(new Event("input", { bubbles: true }));
      source.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function applyHex(value) {
      if (!/^#?[0-9a-f]{6}$/i.test(value)) return;
      const normalized = value.startsWith("#") ? value : "#"+value;
      state = rgbToHsv(normalized);
      paint();
    }
    function open() {
      document.querySelectorAll(".web-color-popover:not([hidden])").forEach(other => {
        if (other !== pop) { other.hidden = true; other.closest(".web-color-picker")?.querySelector(".web-color-trigger")?.setAttribute("aria-expanded","false"); }
      });
      pop.hidden = false; trigger.setAttribute("aria-expanded","true");
      state = rgbToHsv(source.value);
      paint();
    }
    trigger.addEventListener("click", () => pop.hidden ? open() : (pop.hidden=true,trigger.setAttribute("aria-expanded","false")));
    wrap.querySelector(".web-color-close").addEventListener("click", () => { pop.hidden=true; trigger.setAttribute("aria-expanded","false"); });
    hue.addEventListener("input", () => { state.h=Number(hue.value); paint(); });
    hex.addEventListener("change", () => applyHex(hex.value));
    hex.addEventListener("keydown", event => { if(event.key==="Enter"){event.preventDefault();applyHex(hex.value);} });
    const setSV = event => {
      const rect = sv.getBoundingClientRect();
      state.s=clamp((event.clientX-rect.left)/rect.width,0,1);
      state.v=1-clamp((event.clientY-rect.top)/rect.height,0,1);
      paint();
    };
    sv.addEventListener("pointerdown", event => { sv.setPointerCapture(event.pointerId); setSV(event); });
    sv.addEventListener("pointermove", event => { if(event.buttons) setSV(event); });
    sv.addEventListener("keydown", event => {
      const step=event.shiftKey?.1:.02;
      if(event.key==="ArrowLeft") state.s=clamp(state.s-step,0,1);
      else if(event.key==="ArrowRight") state.s=clamp(state.s+step,0,1);
      else if(event.key==="ArrowUp") state.v=clamp(state.v+step,0,1);
      else if(event.key==="ArrowDown") state.v=clamp(state.v-step,0,1);
      else return;
      event.preventDefault();paint();
    });
    document.addEventListener("pointerdown", event => {
      if (!wrap.contains(event.target) && !pop.hidden) { pop.hidden=true; trigger.setAttribute("aria-expanded","false"); }
    });
    document.addEventListener("keydown", event => {
      if(event.key==="Escape" && !pop.hidden) { pop.hidden=true;trigger.setAttribute("aria-expanded","false");trigger.focus(); }
    });
    paint();
  });
})();
