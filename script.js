

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
  window.setInterval(() => changePhoto(photoOne, photoOneNext, photoSets.first), photoChangeTime);
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


/* =====================================================
   УПРАВЛЕНИЕ ФАКТУРОЙ БУМАГИ
   ===================================================== */

// 1. Выбор оттенка бумаги
function setPaperColor(colorHex, btn) {
    document.documentElement.style.setProperty(
        '--paper-bg-color',
        colorHex
    );

    document.querySelectorAll('.paper-colors button')
        .forEach(button => {
            button.classList.remove('active-color');
        });

    if (btn) {
        btn.classList.add('active-color');
    }
}

// 2. Управление выраженностью фактуры
function updateOpacity(val) {
    document.documentElement.style.setProperty(
        '--paper-opacity',
        val
    );

    const valueLabel = document.getElementById('val-opacity');

    if (valueLabel) {
        valueLabel.textContent = Math.round(val * 100) + '%';
    }

    const matrix = document.getElementById('svg-matrix');

    if (matrix) {
        const alpha = (val * 0.6).toFixed(2);

        matrix.setAttribute(
            'values',
            `0 0 0 0 0.94
             0 0 0 0 0.91
             0 0 0 0 0.85
             0 0 0 ${alpha} 0`
        );
    }
}

// 3. Управление размером зерна
function updateGrain(val) {
    document.documentElement.style.setProperty(
        '--paper-grain-scale',
        val
    );

    const label = val < 0.025
        ? 'Крупное'
        : (val > 0.05 ? 'Мелкое' : 'Среднее');

    const valueLabel = document.getElementById('val-grain');

    if (valueLabel) {
        valueLabel.textContent = label;
    }

    const turb = document.getElementById('svg-turb');

    if (turb) {
        const freqY = (val * 0.85).toFixed(3);

        turb.setAttribute(
            'baseFrequency',
            `${val} ${freqY}`
        );
    }
}

// 4. Управление мягкостью волокон
function updateBlur(val) {
    document.documentElement.style.setProperty(
        '--paper-blur',
        val + 'px'
    );

    const valueLabel = document.getElementById('val-blur');

    if (valueLabel) {
        valueLabel.textContent = val + 'px';
    }
}

// Начальные настройки
document.addEventListener('DOMContentLoaded', () => {

    updateOpacity(0.55);
    updateGrain(0.035);
    updateBlur(0.4);

    const firstColorButton = document.querySelector(
        '.paper-colors button'
    );

    if (firstColorButton) {
        firstColorButton.classList.add('active-color');
    }
});

/* =====================================================
   УПРАВЛЕНИЕ ГЛУБИНОЙ И ОБЪЁМОМ БУМАГИ
   ===================================================== */

// 5. Глубина зерна
function updateDepth(val) {
    document.documentElement.style.setProperty(
        '--paper-depth',
        val
    );

    const label = document.getElementById('val-depth');

    if (label) {
        label.textContent = Math.round(val * 100) + '%';
    }
}

// 6. Рельеф бумаги
function updateRelief(val) {
    document.documentElement.style.setProperty(
        '--paper-relief',
        val
    );

    const label = document.getElementById('val-relief');

    if (label) {
        label.textContent = Math.round(val * 100) + '%';
    }

    const depthLight = document.getElementById('svg-depth-light');

    if (depthLight) {
        const surfaceScale = (0.2 + val * 5).toFixed(2);

        depthLight.setAttribute(
            'surfaceScale',
            surfaceScale
        );
    }
}

// 7. Глубина освещения
function updateLighting(val) {
    document.documentElement.style.setProperty(
        '--paper-vignette',
        val
    );

    const label = document.getElementById('val-lighting');

    if (label) {
        label.textContent = Math.round(val * 100) + '%';
    }
}

// Начальные значения новых настроек
document.addEventListener('DOMContentLoaded', () => {
    updateDepth(0.45);
    updateRelief(0.35);
    updateLighting(0.35);
});


function togglePaperPanel() {
    const content = document.getElementById('paper-panel-content');
    const button = document.querySelector('.paper-panel-heading');
    const arrow = document.getElementById('paper-panel-arrow');

    if (!content || !button) return;

    const isOpen = !content.hidden;

    content.hidden = isOpen;
    button.setAttribute('aria-expanded', String(!isOpen));

    if (arrow) {
        arrow.textContent = isOpen ? '＋' : '－';
    }
}

// ========================================
// ПАНЕЛЬ УПРАВЛЕНИЯ ФОНОМ
// ========================================

function toggleBackgroundPanel() {
    const content = document.getElementById('background-panel-content');
    const button = document.querySelector('.background-panel-heading');
    const arrow = document.getElementById('background-panel-arrow');

    if (!content || !button) return;

    const isOpen = !content.hidden;

    content.hidden = isOpen;

    button.setAttribute('aria-expanded', String(!isOpen));

    if (arrow) {
        arrow.textContent = isOpen ? '＋' : '－';
    }
}

// =======================================================
// УПРАВЛЕНИЕ ФОНОМ: ШТРИХОВКА И ТЕНЬ ЛИСТА
// =======================================================

// 1. ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ДВУМЯ СТИЛЯМИ

function switchTechnique(techNum, btnEl) {
    const layers = [
        'tech-hatching',
        'tech-floating-paper',
        'tech-watercolor',
        'tech-ambient-light'
    ];

    const controls = [
        'controls-hatching',
        'controls-paper-shadow',
        'controls-watercolor',
        'controls-ambient-light'
    ];

    if (techNum < 1 || techNum > 4) return;

    document.querySelectorAll('#background-control-panel .tech-tab')
        .forEach(button => button.classList.remove('active'));

    if (btnEl) btnEl.classList.add('active');

    document.body.classList.remove(
        'tech-1-active',
        'tech-2-active',
        'tech-3-active',
        'tech-4-active'
    );

    document.body.classList.add(`tech-${techNum}-active`);

    layers.forEach((id, index) => {
        const layer = document.getElementById(id);
        if (layer) {
            layer.classList.toggle('active-tech', index === techNum - 1);
        }
    });

    controls.forEach((id, index) => {
        const panel = document.getElementById(id);
        if (panel) {
            panel.hidden = index !== techNum - 1;
        }
    });
}

// 2. НАСТРОЙКИ ТЕХНИКИ 1: ШТРИХОВКА

function updateHatchAngle(val) {
    document.documentElement.style.setProperty('--hatch-angle', val + 'deg');

    const label = document.getElementById('val-hatch-angle');
    if (label) label.textContent = val + '°';
}

function updateHatchOpacity(val) {
    document.documentElement.style.setProperty('--hatch-opacity', val);

    const label = document.getElementById('val-hatch-opacity');
    if (label) label.textContent = Math.round(val * 100) + '%';
}

function updateHatchSpacing(val) {
    document.documentElement.style.setProperty('--hatch-spacing', val + 'px');

    const label = document.getElementById('val-hatch-spacing');
    if (label) label.textContent = val + 'px';
}

function setHatchColor(colorHex, btnEl) {
    document.documentElement.style.setProperty('--hatch-color', colorHex);

    if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll('button').forEach(button => {
            button.classList.remove('selected');
        });

        btnEl.classList.add('selected');
    }
}


// 3. НАСТРОЙКИ ТЕХНИКИ 2: ТЕНЬ ЛИСТА

function updateShadowElevation(val) {
    document.documentElement.style.setProperty('--paper-elevation-y', val + 'px');

    const label = document.getElementById('val-shadow-elevation');
    if (label) label.textContent = val + 'px';
}

function updateShadowBlur(val) {
    document.documentElement.style.setProperty('--paper-shadow-blur', val + 'px');

    const label = document.getElementById('val-shadow-blur');
    if (label) label.textContent = val + 'px';
}

function updateShadowOpacity(val) {
    document.documentElement.style.setProperty('--paper-shadow-opacity', val);

    const label = document.getElementById('val-shadow-opacity');
    if (label) label.textContent = Math.round(val * 100) + '%';
}

function updateShadowAngle(val) {
    document.documentElement.style.setProperty('--paper-elevation-x', val + 'px');

    const label = document.getElementById('val-shadow-angle');
    if (label) label.textContent = val + 'px';
}


// =======================================================
// ЕДИНОЕ СОХРАНЕНИЕ НАСТРОЕК ФОНА
// =======================================================

const backgroundStorageKey = 'psychologistBackgroundSettings';
const watercolorStorageKey = 'psychologistWatercolorSettings';

const watercolorPalettes = {

  blue: {
    first: '#829BAA',
    second: '#C6D2D2',
    third: '#D8C9B5'
  },

  olive: {
    first: '#A1A889',
    second: '#D2CFB5',
    third: '#D5BDA3'
  },

  rose: {
    first: '#C99E98',
    second: '#E4C9BE',
    third: '#B7B9B0'
  },

  sand: {
    first: '#C9B99C',
    second: '#E6DCCB',
    third: '#A9B6B4'
  }

};

let currentWatercolorPalette = 'blue';


// Сохранение всех настроек фона

function saveBackgroundSettings() {

  const getValue = (id, fallback) =>
    document.getElementById(id)?.value ?? fallback;

  const activeTab = document.querySelector(
    '#background-control-panel .tech-tab.active'
  );

  const tabs = Array.from(
    document.querySelectorAll('#background-control-panel .tech-tab')
  );

  const settings = {

    technique: activeTab ? tabs.indexOf(activeTab) + 1 : 3,

    hatchAngle: getValue('hatch-angle-input', '45'),
    hatchOpacity: getValue('hatch-opacity-input', '0.12'),
    hatchSpacing: getValue('hatch-spacing-input', '12'),
    hatchColor: getComputedStyle(document.documentElement)
      .getPropertyValue('--hatch-color').trim() || '#2B4C6F',

    shadowElevation: getValue('shadow-elevation-input', '18'),
    shadowBlur: getValue('shadow-blur-input', '36'),
    shadowOpacity: getValue('shadow-opacity-input', '0.08'),
    shadowAngle: getValue('shadow-angle-input', '0'),

    watercolorOpacity: getValue('watercolor-opacity-input', '0.45'),
    watercolorSize: getValue('watercolor-size-input', '100'),
    watercolorBlur: getValue('watercolor-blur-input', '35'),
    watercolorOrigin: getValue('watercolor-origin-input', '25'),
    watercolorPalette: currentWatercolorPalette,

    ambientOpacity: getValue('ambient-opacity-input', '0.35'),
    ambientSize: getValue('ambient-size-input', '100'),
    ambientSpeed: getValue('ambient-speed-input', '20')

  };

  try {

    localStorage.setItem(
      backgroundStorageKey,
      JSON.stringify(settings)
    );

  } catch (error) {

    console.warn('Не удалось сохранить настройки фона.', error);

  }

}


// Управление акварелью

function updateWatercolorOpacity(val) {

  document.documentElement.style.setProperty(
    '--watercolor-opacity', val
  );

  const label = document.getElementById('val-watercolor-opacity');

  if (label) label.textContent = Math.round(val * 100) + '%';

}

function updateWatercolorSize(val) {

  document.documentElement.style.setProperty(
    '--watercolor-size', val + '%'
  );

  const label = document.getElementById('val-watercolor-size');

  if (label) label.textContent = val + '%';

}

function updateWatercolorBlur(val) {

  document.documentElement.style.setProperty(
    '--watercolor-blur', val + 'px'
  );

  const label = document.getElementById('val-watercolor-blur');

  if (label) label.textContent = val + 'px';

}

function updateWatercolorOrigin(val) {

  document.documentElement.style.setProperty(
    '--watercolor-origin', val + '%'
  );

  const label = document.getElementById('val-watercolor-origin');

  if (label) label.textContent = val + '%';

}


// Выбор палитры акварели

function setWatercolorPalette(name, btnEl) {

  const palette = watercolorPalettes[name];

  if (!palette) return;

  currentWatercolorPalette = name;

  document.documentElement.style.setProperty(
    '--watercolor-color-1', palette.first
  );

  document.documentElement.style.setProperty(
    '--watercolor-color-2', palette.second
  );

  document.documentElement.style.setProperty(
    '--watercolor-color-3', palette.third
  );

  document.querySelectorAll('.watercolor-palettes button')
    .forEach(button => button.classList.remove('selected'));

  if (btnEl) btnEl.classList.add('selected');

}


// Восстановление настроек при открытии сайта

function initializeBackgroundSettings() {

  let settings = {};

  try {

    const saved = localStorage.getItem(backgroundStorageKey);

    if (saved) {

      settings = JSON.parse(saved);

    } else {

      // Перенос ранее сохранённых настроек акварели

      const oldSaved = localStorage.getItem(watercolorStorageKey);

      if (oldSaved) {

        const old = JSON.parse(oldSaved);

        settings = {

          watercolorOpacity: old.opacity,
          watercolorSize: old.size,
          watercolorBlur: old.blur,
          watercolorOrigin: old.origin,
          watercolorPalette: old.palette

        };

      }

    }

  } catch (error) {

    console.warn('Не удалось прочитать настройки фона.', error);

  }


  const defaults = {

    technique: 3,

    hatchAngle: '45',
    hatchOpacity: '0.12',
    hatchSpacing: '12',
    hatchColor: '#2B4C6F',

    shadowElevation: '18',
    shadowBlur: '36',
    shadowOpacity: '0.08',
    shadowAngle: '0',

    watercolorOpacity: '0.45',
    watercolorSize: '100',
    watercolorBlur: '35',
    watercolorOrigin: '25',
    watercolorPalette: 'blue',

    ambientOpacity: '0.35',
    ambientSize: '100',
    ambientSpeed: '20'

  };

  settings = { ...defaults, ...settings };


  // Восстанавливаем положения ползунков

  const inputSettings = {

    'hatch-angle-input': settings.hatchAngle,
    'hatch-opacity-input': settings.hatchOpacity,
    'hatch-spacing-input': settings.hatchSpacing,

    'shadow-elevation-input': settings.shadowElevation,
    'shadow-blur-input': settings.shadowBlur,
    'shadow-opacity-input': settings.shadowOpacity,
    'shadow-angle-input': settings.shadowAngle,

    'watercolor-opacity-input': settings.watercolorOpacity,
    'watercolor-size-input': settings.watercolorSize,
    'watercolor-blur-input': settings.watercolorBlur,
    'watercolor-origin-input': settings.watercolorOrigin,

    'ambient-opacity-input': settings.ambientOpacity,
    'ambient-size-input': settings.ambientSize,
    'ambient-speed-input': settings.ambientSpeed

  };

  Object.entries(inputSettings).forEach(([id, value]) => {

    const input = document.getElementById(id);

    if (input && value !== undefined && value !== null) {
      input.value = value;
    }

  });


  // Применяем настройки штриховки

  updateHatchAngle(settings.hatchAngle);
  updateHatchOpacity(settings.hatchOpacity);
  updateHatchSpacing(settings.hatchSpacing);

  const hatchButton = Array.from(
    document.querySelectorAll('#background-control-panel .hatch-color-buttons button')
  ).find(button =>
    button.getAttribute('onclick')?.includes(settings.hatchColor)
  );

  setHatchColor(settings.hatchColor, hatchButton);


  // Применяем настройки тени листа

  updateShadowElevation(settings.shadowElevation);
  updateShadowBlur(settings.shadowBlur);
  updateShadowOpacity(settings.shadowOpacity);
  updateShadowAngle(settings.shadowAngle);


  // Применяем настройки акварели

  currentWatercolorPalette =
    watercolorPalettes[settings.watercolorPalette]
      ? settings.watercolorPalette
      : 'blue';

  updateWatercolorOpacity(settings.watercolorOpacity);
  updateWatercolorSize(settings.watercolorSize);
  updateWatercolorBlur(settings.watercolorBlur);
  updateWatercolorOrigin(settings.watercolorOrigin);

  const paletteButton = document.querySelector(
    `.watercolor-palettes button[onclick*="${currentWatercolorPalette}"]`
  );

  setWatercolorPalette(currentWatercolorPalette, paletteButton);


  // Применяем настройки световой вуали

  updateAmbientOpacity(settings.ambientOpacity);
  updateAmbientSize(settings.ambientSize);
  updateAmbientSpeed(settings.ambientSpeed);


  // Восстанавливаем выбранную технику

  const technique = Math.min(
    4,
    Math.max(1, Number(settings.technique) || 3)
  );

  const tabs = document.querySelectorAll(
    '#background-control-panel .tech-tab'
  );

  switchTechnique(technique, tabs[technique - 1]);

}


// Сохраняем изменения ползунков

document.addEventListener('input', function(event) {

  if (
    event.target.matches(
      '#background-control-panel input[type="range"]'
    )
  ) {

    saveBackgroundSettings();

  }

});


// Сохраняем выбор техники и цветовых кнопок

document.addEventListener('click', function(event) {

  if (
    event.target.closest(
      '#background-control-panel .tech-tab, ' +
      '#background-control-panel .hatch-color-buttons button'
    )
  ) {

    saveBackgroundSettings();

  }

});


// Запуск восстановления после загрузки страницы

document.addEventListener('DOMContentLoaded', function() {

  initializeBackgroundSettings();

});


// =======================================================
// ТЕХНИКА 4: УПРАВЛЕНИЕ СВЕТОВОЙ ВУАЛЬЮ
// =======================================================

function updateAmbientOpacity(val) {
    document.documentElement.style.setProperty(
        '--ambient-opacity', val
    );

    const label = document.getElementById('val-ambient-opacity');
    if (label) label.textContent = Math.round(val * 100) + '%';
}

function updateAmbientSize(val) {
    document.documentElement.style.setProperty(
        '--ambient-size', val + '%'
    );

    const label = document.getElementById('val-ambient-size');
    if (label) label.textContent = val + '%';
}

function updateAmbientSpeed(val) {
    document.documentElement.style.setProperty(
        '--ambient-speed', val + 's'
    );

    const label = document.getElementById('val-ambient-speed');
    if (label) label.textContent = val + ' сек.';
}

// =======================================================
// ЕДИНАЯ ПАНЕЛЬ РАЗРАБОТКИ
// =======================================================

function toggleDevPanelSection(section) {
    const content = document.getElementById('developer-panel-content');

   
const sections = {
    animation: document.getElementById('animation-control-panel'),
    background: document.getElementById('background-control-panel'),
    photos: document.getElementById('photos-panel-content'),
    cost: document.getElementById('cost-control-panel'),
    appointment: document.getElementById('appointment-control-panel')
};

    if (!content || !sections[section]) return;

    const clickedSectionIsOpen =
        !content.hidden && !sections[section].hidden;

    // Закрываем все разделы
    Object.values(sections).forEach(panel => {
        panel.hidden = true;
    });

    document.querySelectorAll('.developer-panel-tab').forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    });

    if (clickedSectionIsOpen) {
        content.hidden = true;
        return;
    }

    // Открываем выбранный раздел
    content.hidden = false;
    sections[section].hidden = false;

    const activeButton = document.querySelector(
        `.developer-panel-tab[data-panel-section="${section}"]`
    );

    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-expanded', 'true');
    }
}


// =======================================================
// УПРАВЛЕНИЕ ГЛАВНОЙ ФОТОРАМКОЙ — ЭФФЕКТ ЛИНЗА
// =======================================================

function getLensFrame() {
    return document.querySelector('.photo-frame-1');
}

function setLensValue(property, value) {
    const frame = getLensFrame();
    if (frame) {
        frame.style.setProperty(property, value);
    }
}

function updateLensRadius(value) {
    setLensValue('--lens-radius', value + 'px');
    document.getElementById('val-lens-radius').textContent =
        value + ' px';
}

function updateLensShadowY(value) {
    setLensValue('--lens-shadow-y', value + 'px');
    document.getElementById('val-lens-shadow-y').textContent =
        value + ' px';
}

function updateLensShadowBlur(value) {
    setLensValue('--lens-shadow-blur', value + 'px');
    document.getElementById('val-lens-shadow-blur').textContent =
        value + ' px';
}

function updateLensShadowDepth(value) {
    setLensValue('--lens-shadow-opacity', Number(value) / 100);
    document.getElementById('val-lens-shadow-depth').textContent =
        value + '%';
}

function updateLensGlare(value) {
    setLensValue('--lens-glare-opacity', Number(value) / 100);
    document.getElementById('val-lens-glare').textContent =
        value + '%';
}



/* =========================================
   ЕДИНАЯ ИНФОРМАЦИОННАЯ ШТОРКА
========================================= */

(function () {
    const drawer = document.getElementById("sideDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const closeButton = document.getElementById("drawerClose");
    const title = document.getElementById("drawerTitle");

    if (!drawer || !backdrop || !closeButton || !title) return;

    const titles = {
        method: "О Методе",
        requests: "С какими запросами я работаю",
        format: "Формат работы",
        education: "Образование и профессиональная подготовка",
        articles: "Статьи",
        price: "Стоимость",
        contacts: "Контактные данные"
    };

    const widths = {
        method: "850px",
        requests: "700px",
        format: "950px",
        education: "600px",
        articles: "1100px",
        price: "600px",
        contacts: "700px"
    };

    const wheelSections = [
        "method",
        "requests",
        "format",
        "education",
        "articles",
        "price",
        "contacts"
    ];

    let drawerOpen = false;
    let previousFocus = null;
    let activeSection = null;
    let sectionSwitchTimer = null;
    let wheelLocked = false;
    let wheelLockTimer = null;

    function showDrawerSection(sectionName) {
        const panel = drawer.querySelector(
            `[data-drawer-panel="${sectionName}"]`
        );

        if (!panel || activeSection === sectionName) return;

        const inner = drawer.querySelector(".drawer-inner");
        if (!inner) return;

        if (sectionSwitchTimer !== null) {
            clearTimeout(sectionSwitchTimer);
            sectionSwitchTimer = null;
        }

        function applySection() {
            title.textContent = titles[sectionName] || "Информация";

            drawer.querySelectorAll("[data-drawer-panel]").forEach(item => {
                item.hidden = item !== panel;
            });

            drawer.querySelectorAll("[data-drawer-tab]").forEach(button => {
                const isActive = button.dataset.drawerTab === sectionName;

                button.classList.toggle("active", isActive);
                button.setAttribute(
                    "aria-current",
                    isActive ? "page" : "false"
                );
            });

            drawer.style.setProperty(
                "--drawer-width",
                widths[sectionName] || "700px"
            );

            activeSection = sectionName;
        }

        if (activeSection === null) {
            applySection();

            inner.classList.remove("is-switching", "is-revealing");
            void inner.offsetWidth;
            inner.classList.add("is-revealing");

            return;
        }

        inner.classList.remove("is-revealing");
        inner.classList.add("is-switching");

        sectionSwitchTimer = setTimeout(() => {
            applySection();

            inner.classList.remove("is-switching");
            void inner.offsetWidth;
            inner.classList.add("is-revealing");

            sectionSwitchTimer = null;
        }, 240);
    }

    function openDrawer(sectionName) {
        if (!titles[sectionName]) return;

        if (!drawerOpen) {
            previousFocus = document.activeElement;
            drawerOpen = true;

            backdrop.classList.add("is-open");
            drawer.classList.add("is-open");
            document.body.classList.add("drawer-is-open");

            drawer.setAttribute("aria-hidden", "false");
            backdrop.setAttribute("aria-hidden", "false");
        }

        showDrawerSection(sectionName);
        closeButton.focus();
    }

    function closeDrawer() {
        if (!drawerOpen) return;

        drawerOpen = false;

        if (wheelLockTimer !== null) {
            clearTimeout(wheelLockTimer);
            wheelLockTimer = null;
        }

        wheelLocked = false;

        if (sectionSwitchTimer !== null) {
            clearTimeout(sectionSwitchTimer);
            sectionSwitchTimer = null;
        }

        activeSection = null;

        const inner = drawer.querySelector(".drawer-inner");

        if (inner) {
            inner.classList.remove(
                "is-switching",
                "is-revealing",
                "is-wheel-next",
                "is-wheel-prev"
            );
        }

        drawer.classList.remove("is-open");
        backdrop.classList.remove("is-open");
        document.body.classList.remove("drawer-is-open");

        drawer.setAttribute("aria-hidden", "true");
        backdrop.setAttribute("aria-hidden", "true");

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    // Открытие разделов кнопками главного меню
    document.querySelectorAll("[data-drawer-open]").forEach(button => {
        button.addEventListener("click", () => {
            openDrawer(button.dataset.drawerOpen);
        });
    });

    // Переключение вкладок внутри шторки
    drawer.querySelectorAll("[data-drawer-tab]").forEach(button => {
        button.addEventListener("click", () => {
            showDrawerSection(button.dataset.drawerTab);
        });
    });

    // Закрытие кнопкой и кликом по фону
    closeButton.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    // Закрытие клавишей Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && drawerOpen) {
            closeDrawer();
        }
    });

    // Переключение разделов колёсиком
    drawer.addEventListener("wheel", event => {
        if (!drawerOpen || wheelLocked) return;

        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (Math.abs(event.deltaY) < 35) return;

        const direction = event.deltaY > 0 ? 1 : -1;

        // Если прокручивается вложенная область,
        // сначала даём ей прокрутиться до края
        const scrollable = event.target.closest(
            ".drawer-panel-scroll"
        );

        if (scrollable) {
            const atTop = scrollable.scrollTop <= 1;
            const atBottom =
                scrollable.scrollTop + scrollable.clientHeight >=
                scrollable.scrollHeight - 2;

            if (direction > 0 && !atBottom) return;
            if (direction < 0 && !atTop) return;
        } else {
            const atTop = drawer.scrollTop <= 1;
            const atBottom =
                drawer.scrollTop + drawer.clientHeight >=
                drawer.scrollHeight - 2;

            if (direction > 0 && !atBottom) return;
            if (direction < 0 && !atTop) return;
        }

        const currentIndex = wheelSections.indexOf(activeSection);
        if (currentIndex === -1) return;

        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= wheelSections.length) return;

        event.preventDefault();
        wheelLocked = true;

        const inner = drawer.querySelector(".drawer-inner");

        if (inner) {
            inner.classList.remove("is-wheel-next", "is-wheel-prev");
            void inner.offsetWidth;

            inner.classList.add(
                direction > 0 ? "is-wheel-next" : "is-wheel-prev"
            );
        }

        showDrawerSection(wheelSections[nextIndex]);

        drawer.scrollTop = 0;

        if (wheelLockTimer !== null) {
            clearTimeout(wheelLockTimer);
        }

        wheelLockTimer = setTimeout(() => {
            wheelLocked = false;
            wheelLockTimer = null;

            if (inner) {
                inner.classList.remove("is-wheel-next", "is-wheel-prev");
            }
        }, 750);
    }, { passive: false });

})();


/* =========================================
   ОКНО СТОИМОСТИ — УПРАВЛЕНИЕ
========================================= */

(function () {
    const backdrop = document.getElementById("costBackdrop");
    const modal = document.getElementById("costModal");

    if (!backdrop || !modal) return;

    const closeButtons = modal.querySelectorAll("[data-cost-close]");
    const openButtons = document.querySelectorAll("[data-cost-open]");
    const serviceButtons = modal.querySelectorAll("[data-cost-method]");

    let costOpen = false;
    let previousFocus = null;

    function openCost() {
        if (costOpen) return;

        previousFocus = document.activeElement;
        costOpen = true;

        backdrop.classList.add("is-open");
        modal.classList.add("is-open");

        backdrop.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("cost-modal-open");

        modal.scrollTop = 0;
    }

    function closeCost() {
        if (!costOpen) return;

        costOpen = false;

        modal.classList.remove("is-open");
        backdrop.classList.remove("is-open");

        modal.setAttribute("aria-hidden", "true");
        backdrop.setAttribute("aria-hidden", "true");

        document.body.classList.remove("cost-modal-open");

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

})();


/* ===== FINAL FIX: ОКНА И ПАНЕЛЬ ===== */

window.toggleDevPanelSection = function(section) {
  const content = document.getElementById("developer-panel-content");

  if (!content) return;

  // Открываем саму панель
  content.hidden = false;
  content.style.display = "block";

  const panels = {
    animation: document.getElementById("animation-control-panel"),
    background: document.getElementById("background-control-panel"),
    photos: document.getElementById("photos-panel-content"),
    cost: document.getElementById("cost-control-panel"),
    appointment: document.getElementById("appointment-control-panel")
  };

  // Показываем только выбранный раздел
  Object.entries(panels).forEach(([name, panel]) => {
    if (!panel) return;

    panel.hidden = name !== section;
    panel.style.display = name === section ? "block" : "none";
  });

  // Подсвечиваем выбранную вкладку
  document.querySelectorAll(".developer-panel-tab[data-panel-section]")
    .forEach(button => {
      const active = button.dataset.panelSection === section;

      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
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
        teenagers: "Работа с подростками",
        coaching: "Коучинг",
        "text-therapy": "Текстовая терапия"
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



/* =========================================
   ТЕМА V3 — КАМЕРНЫЙ НОЧНОЙ ТИЛ
========================================= */

const NIGHT_TEAL_THEME_KEY = "psychologistSiteTheme";

function applySiteTheme(v) {
    const root = document.documentElement;
    const body = document.body;
    const button = document.getElementById("theme-v3-toggle");

 if (v === "v3") {
    body.classList.add("theme-v3");

    root.style.setProperty("--bg-base", "#1E292B");
    root.style.setProperty("--text-main", "#F2F7F6");
    root.style.setProperty("--accent-primary", "#34797E");
    root.style.setProperty("--accent-gold", "#DCB573");
    root.style.setProperty("--glow-1", "rgba(52, 121, 126, 0.45)");
    root.style.setProperty("--glow-2", "rgba(220, 181, 115, 0.25)");
    root.style.setProperty("--drawer-bg", "rgba(35, 50, 53, 0.92)");

        // Связываем новую палитру с переменными действующего сайта
        root.style.setProperty("--background-color", "#1E292B");
        root.style.setProperty("--text-color", "#F2F7F6");
        root.style.setProperty("--accent-color", "#34797E");
        root.style.setProperty("--white", "#34797E");
        root.style.setProperty("--header-color", "rgba(30, 41, 43, 0.92)");
        root.style.setProperty("--panel-color", "#233235");

    } else {
        body.classList.remove("theme-v3");

        [
            "--bg-base",
            "--text-main",
            "--accent-primary",
            "--accent-gold",
            "--glow-1",
            "--glow-2",
            "--drawer-bg",
            "--background-color",
                      "--text-color",
            "--accent-color",
            "--white",
            "--header-color",
            "--panel-color"
        ].forEach(property => root.style.removeProperty(property));
    }

    if (button) {
        button.classList.toggle("active", v === "v3");
        button.setAttribute("aria-pressed", String(v === "v3"));
    }
}

function toggleNightTealTheme() {
    const currentTheme = localStorage.getItem(NIGHT_TEAL_THEME_KEY);
    const nextTheme = currentTheme === "v3" ? "default" : "v3";

    applySiteTheme(nextTheme);

    try {
        localStorage.setItem(NIGHT_TEAL_THEME_KEY, nextTheme);
    } catch (error) {
        console.warn("Не удалось сохранить цветовую тему.", error);
    }
}

// Восстанавливаем выбранную тему после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    let savedTheme = "default";

    try {
        savedTheme = localStorage.getItem(NIGHT_TEAL_THEME_KEY) || "default";
    } catch (error) {
        console.warn("Не удалось прочитать сохранённую тему.", error);
    }

    applySiteTheme(savedTheme);
});

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
  window.resetCostSettings=()=>{s={...defaults};apply();try{localStorage.setItem(key,JSON.stringify(s));}catch(error){}};
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
function toggleBackgroundLabBlock(panelId, button) {
  const content = document.getElementById('developer-panel-content');
  const panels = ['lab-presets','lab-base','lab-glow1','lab-glow2','lab-optics']
    .map(id => document.getElementById(id)).filter(Boolean);
  const target = document.getElementById(panelId);
  if (!content || !target || !button) return;

  const willOpen = content.hidden || target.hidden;
  panels.forEach(panel => { panel.hidden = true; });
  document.querySelectorAll('.background-lab-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-expanded','false');
  });
  if (!willOpen) {
    content.hidden = true;
    return;
  }
  ['animation-control-panel','background-control-panel','photos-panel-content',
   'cost-control-panel','appointment-control-panel'].forEach(id => {
    const panel = document.getElementById(id);
    if (panel) panel.hidden = true;
  });
  document.querySelectorAll('.developer-panel-tab:not(.background-lab-tab)').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-expanded','false');
  });
  content.hidden = false;
  target.hidden = false;
  button.classList.add('active');
  button.setAttribute('aria-expanded','true');
}


/* Карусель вкладок лаборатории фона + пресеты настроения */
window.scrollBackgroundLabTabs = function(direction){
  const track=document.getElementById('background-lab-tab-track');
  if(track) track.scrollBy({left:direction*Math.max(150,track.clientWidth*.65),behavior:'smooth'});
};
window.applyBackgroundMood = function(mood){
  const root=document.documentElement;
  const body=document.body;
  const presets={
    balanced:{base:'#1E292B',teal:'rgba(52,121,126,.45)',gold:'rgba(220,181,115,.25)',drawer:'rgba(35,50,53,.92)'},
    deep:{base:'#10191B',teal:'rgba(38,89,93,.35)',gold:'rgba(179,142,82,.12)',drawer:'rgba(20,30,32,.94)'},
    amber:{base:'#202827',teal:'rgba(52,121,126,.30)',gold:'rgba(220,181,115,.42)',drawer:'rgba(36,43,39,.92)'}
  };
  const p=presets[mood]; if(!p)return;
  body.classList.add('theme-v3');
  root.style.setProperty('--bg-base',p.base);
  root.style.setProperty('--background-color',p.base);
  root.style.setProperty('--panel-color',p.drawer);
  root.style.setProperty('--glow-1',p.teal);
  root.style.setProperty('--glow-2',p.gold);
  root.style.setProperty('--drawer-bg',p.drawer);
  root.style.setProperty('--text-main','#F2F7F6');
  root.style.setProperty('--text-color','#F2F7F6');
  root.style.setProperty('--accent-primary','#34797E');
  root.style.setProperty('--accent-gold','#DCB573');
  try{localStorage.setItem('psychologistBackgroundMood',mood);localStorage.setItem('psychologistNightTealTheme','v3');}catch(e){}
  const themeButton=document.getElementById('theme-v3-toggle');
  if(themeButton){themeButton.classList.add('active');themeButton.setAttribute('aria-pressed','true');}
};


/* НОВАЯ ЛАБОРАТОРИЯ ФОНА — независимая палитра и два источника света */
(function(){
  const root=document.documentElement;
  const key="psychologistBackgroundLabSettings";
  const defaults={
    base:"#1E292B",vignette:35,grain:35,
    glow1:{color:"#34797E",opacity:45,x:82,y:18,size:60},
    glow2:{color:"#DCB573",opacity:22,x:15,y:85,size:55},
    effectsLinked:true,optics:{color:"#233235",opacity:92,blur:12,saturation:120}
  };
  let state={...defaults,glow1:{...defaults.glow1},glow2:{...defaults.glow2}};
  try{
    const saved=JSON.parse(localStorage.getItem(key)||localStorage.getItem("psychologistBackgroundBaseSettings")||"{}");
    state={...state,...saved,glow1:{...defaults.glow1,...saved.glow1},glow2:{...defaults.glow2,...saved.glow2},optics:{...defaults.optics,...saved.optics}};
  }catch(e){}
  function setVar(name,value){root.style.setProperty(name,String(value));}
  const colorKeys=["lab-base-color","lab-glow1-color","lab-glow2-color","lab-optics-color"];
  function hexToRgb(hex){const m=/^#?([0-9a-f]{6})$/i.exec(hex);if(!m)return null;const n=parseInt(m[1],16);return {r:n>>16,g:(n>>8)&255,b:n&255};}
  function rgbToHex(r,g,b){return "#"+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(Number(v)))).toString(16).padStart(2,"0")).join("").toUpperCase();}
  function syncColorPicker(id,color){const rgb=hexToRgb(color);if(!rgb)return;const swatch=document.getElementById(id+"-picker"),field=document.getElementById(id+"-text");if(swatch)swatch.value=color;if(field)field.value=rgb.r+", "+rgb.g+", "+rgb.b;}
  function setLabColor(id,color){if(!/^#[0-9a-f]{6}$/i.test(color))return;const upper=color.toUpperCase();if(id==="lab-base-color")window.updateBackgroundBase(upper);else if(id==="lab-glow1-color")window.updateBackgroundGlow(1,"color",upper);else if(id==="lab-glow2-color")window.updateBackgroundGlow(2,"color",upper);else if(id==="lab-optics-color")window.updateBackgroundOptics("color",upper);}
  window.updateLabColor=(id,color)=>setLabColor(id,color);
  window.updateLabColorText=(id,value)=>{const nums=value.split(/[ ,;]+/).filter(Boolean).map(Number);if(nums.length!==3||nums.some(n=>!Number.isFinite(n)||n<0||n>255))return;setLabColor(id,rgbToHex(...nums));};


  const labPicker={key:null,h:180,s:0.2,v:0.25};
  function labRgb(){const c=labPicker.v*labPicker.s,x=c*(1-Math.abs((labPicker.h/60)%2-1)),m=labPicker.v-c/2;let a=0,b=0,d=0;const h=labPicker.h;if(h<60){a=c;b=x}else if(h<120){a=x;b=c}else if(h<180){b=c;d=x}else if(h<240){b=x;d=c}else if(h<300){a=x;d=c}else{a=c;d=x}return {r:Math.round((a+m)*255),g:Math.round((b+m)*255),b:Math.round((d+m)*255)};}
  function labHex(rgb){return "#"+[rgb.r,rgb.g,rgb.b].map(v=>v.toString(16).padStart(2,"0")).join("").toUpperCase();}
  function labHslFromHex(hex){const rgb=hexToRgb(hex);if(!rgb)return {h:180,s:.2,v:.25};const r=rgb.r/255,g=rgb.g/255,b=rgb.b/255,max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){if(max===r)h=60*(((g-b)/d)%6);else if(max===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4);if(h<0)h+=360;}return {h,s:max?d/max:0,v:max};}
  function labPickerPaint(){const sv=document.getElementById("lab-color-sv"),cur=document.getElementById("lab-color-sv-cursor"),hue=document.getElementById("lab-color-hue"),preview=document.getElementById("lab-color-preview"),rgbInput=document.getElementById("lab-color-rgb");if(!sv)return;sv.style.backgroundColor="hsl("+labPicker.h+",100%,50%)";if(cur){cur.style.left=(labPicker.s*100)+"%";cur.style.top=((1-labPicker.v)*100)+"%";}if(hue)hue.value=labPicker.h;const rgb=labRgb(),hex=labHex(rgb);if(preview)preview.style.background=hex;if(rgbInput)rgbInput.value=rgb.r+", "+rgb.g+", "+rgb.b;}
  window.openLabColorPicker=(key)=>{labPicker.key=key;const current=document.getElementById(key+"-picker");const hex=current?current.value:"#233235";Object.assign(labPicker,labHslFromHex(hex));const modal=document.getElementById("lab-color-modal");modal.hidden=false;modal.setAttribute("aria-hidden","false");labPickerPaint();};
  function labPickerClose(){const modal=document.getElementById("lab-color-modal");modal.hidden=true;modal.setAttribute("aria-hidden","true");}
  function labPickerApply(){const hex=labHex(labRgb());setLabColor(labPicker.key,hex);labPickerClose();}
  function labPickerSVFromPointer(e){const box=document.getElementById("lab-color-sv").getBoundingClientRect();labPicker.s=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width));labPicker.v=1-Math.max(0,Math.min(1,(e.clientY-box.top)/box.height));labPickerPaint();}
  function labPickerSVKey(e){const step=e.shiftKey?.1:.01;if(e.key==="ArrowLeft")labPicker.s=Math.max(0,labPicker.s-step);else if(e.key==="ArrowRight")labPicker.s=Math.min(1,labPicker.s+step);else if(e.key==="ArrowUp")labPicker.v=Math.min(1,labPicker.v+step);else if(e.key==="ArrowDown")labPicker.v=Math.max(0,labPicker.v-step);else return;e.preventDefault();labPickerPaint();}
  document.addEventListener("DOMContentLoaded",()=>{const sv=document.getElementById("lab-color-sv"),hue=document.getElementById("lab-color-hue"),rgb=document.getElementById("lab-color-rgb");if(!sv)return;let dragging=false;sv.addEventListener("pointerdown",e=>{dragging=true;sv.setPointerCapture(e.pointerId);labPickerSVFromPointer(e);});sv.addEventListener("pointermove",e=>{if(dragging)labPickerSVFromPointer(e);});sv.addEventListener("pointerup",()=>dragging=false);sv.addEventListener("pointercancel",()=>dragging=false);sv.addEventListener("keydown",labPickerSVKey);hue.addEventListener("input",()=>{labPicker.h=Number(hue.value);labPickerPaint();});rgb.addEventListener("change",()=>{const n=rgb.value.split(/[ ,;]+/).filter(Boolean).map(Number);if(n.length!==3||n.some(v=>!Number.isFinite(v)||v<0||v>255)){labPickerPaint();return;}Object.assign(labPicker,labHslFromHex(labHex({r:n[0],g:n[1],b:n[2]})));labPickerPaint();});document.getElementById("lab-color-apply").addEventListener("click",labPickerApply);document.getElementById("lab-color-cancel").addEventListener("click",labPickerClose);document.getElementById("lab-color-close").addEventListener("click",labPickerClose);document.getElementById("lab-color-modal").addEventListener("click",e=>{if(e.target.id==="lab-color-modal")labPickerClose();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!document.getElementById("lab-color-modal").hidden)labPickerClose();});});
  function render(){
    document.body.classList.toggle("lab-effects-isolated",!state.effectsLinked);
    const link=document.getElementById("lab-effects-link");if(link)link.checked=state.effectsLinked;
    setVar("--lab-bg-base",state.base);
    setVar("--lab-vignette",Number(state.vignette)/100);
    setVar("--lab-grain",Number(state.grain)+"%");
    setVar("--lab-grain-opacity",Number(state.grain)/100);
    [1,2].forEach(n=>{
      const light=state["glow"+n];
      Object.entries(light).forEach(([prop,value])=>{
        const cssProp=prop==="opacity"?"opacity":prop;
        setVar("--lab-glow"+n+"-"+cssProp,prop==="opacity"?Number(value)+"%":prop==="size"?Number(value)+"%":prop==="x"||prop==="y"?Number(value)+"%":value);
        const input=document.getElementById("lab-glow"+n+"-"+prop);
        const output=document.getElementById("lab-glow"+n+"-"+prop+"-value");
        if(input)input.value=value;
        if(output)output.textContent=prop==="color"?String(value).toUpperCase():value+"%";
      });
    });
    const base=document.getElementById("lab-base-color"),baseOut=document.getElementById("lab-base-color-display");
    const vignette=document.getElementById("lab-vignette"),vOut=document.getElementById("lab-vignette-value");
    const grain=document.getElementById("lab-grain"),gOut=document.getElementById("lab-grain-value");
    const optics=state.optics;
    setVar("--lab-drawer-color",optics.color);setVar("--lab-drawer-opacity",Number(optics.opacity)+"%");setVar("--lab-drawer-blur",Number(optics.blur)+"px");setVar("--lab-drawer-saturation",Number(optics.saturation)+"%");
    /* Применяем оптику напрямую к реальной информационной шторке, независимо от темы. */
    const drawer=document.getElementById("sideDrawer");
    if(drawer){
      drawer.style.setProperty("background","color-mix(in srgb,"+optics.color+" "+Number(optics.opacity)+"%,transparent)","important");
      drawer.style.setProperty("backdrop-filter","blur("+Number(optics.blur)+"px) saturate("+Number(optics.saturation)+"%)","important");
      drawer.style.setProperty("-webkit-backdrop-filter","blur("+Number(optics.blur)+"px) saturate("+Number(optics.saturation)+"%)","important");
      drawer.style.setProperty("border-right-color","color-mix(in srgb,"+optics.color+" 35%,transparent)","important");
    }
    syncColorPicker("lab-base-color",state.base);
    syncColorPicker("lab-glow1-color",state.glow1.color);
    syncColorPicker("lab-glow2-color",state.glow2.color);
    syncColorPicker("lab-optics-color",optics.color);
    [["color","lab-optics-color","lab-optics-color-value",v=>String(v).toUpperCase()],["opacity","lab-optics-opacity","lab-optics-opacity-value",v=>v+"%"],["blur","lab-optics-blur","lab-optics-blur-value",v=>v+" px"],["saturation","lab-optics-saturation","lab-optics-saturation-value",v=>v+"%"]].forEach(([key,id,out,fmt])=>{const input=document.getElementById(id),label=document.getElementById(out);if(input)input.value=optics[key];if(label)label.textContent=fmt(optics[key]);});
    if(base)base.value=state.base;if(baseOut)baseOut.textContent=state.base.toUpperCase();
    if(vignette)vignette.value=state.vignette;if(vOut)vOut.textContent=state.vignette+"%";
    if(grain)grain.value=state.grain;
    if(gOut)gOut.textContent=state.grain<30?"Тонкая":state.grain>70?"Выраженная":"Средняя";
  }
  function save(){render();try{localStorage.setItem(key,JSON.stringify(state));}catch(e){}}
  window.updateBackgroundBase=value=>{state.base=value;save();};
  window.updateBackgroundEffectsLink=value=>{state.effectsLinked=Boolean(value);save();};
  window.updateBackgroundOptics=(property,value)=>{if(!(property in defaults.optics))return;state.optics[property]=property==="color"?value:Number(value);save();};
  window.updateBackgroundVignette=value=>{state.vignette=Number(value);save();};
  window.updateBackgroundGrain=value=>{state.grain=Number(value);save();};
  window.updateBackgroundGlow=(number,property,value)=>{
    if(![1,2].includes(Number(number))||!(property in defaults.glow1))return;
    state["glow"+number][property]=property==="color"?value:Number(value);
    save();
  };
  render();

  /* Пресеты задают общую цветовую основу обоим новым источникам света. */
  const originalApplyMood=window.applyBackgroundMood;
  if(typeof originalApplyMood==="function"){
    window.applyBackgroundMood=function(mood){
      originalApplyMood(mood);
      const presets={
        balanced:{base:"#1E292B",vignette:35,grain:35,optics:{color:"#233235",opacity:92,blur:12,saturation:120},glow1:{color:"#34797E",opacity:45,x:82,y:18,size:60},glow2:{color:"#DCB573",opacity:22,x:15,y:85,size:55}},
        deep:{base:"#10191B",vignette:65,grain:55,optics:{color:"#141E20",opacity:95,blur:16,saturation:110},glow1:{color:"#26595D",opacity:35,x:75,y:22,size:55},glow2:{color:"#B38E52",opacity:12,x:20,y:80,size:45}},
        amber:{base:"#202827",vignette:30,grain:25,optics:{color:"#242B27",opacity:91,blur:14,saturation:135},glow1:{color:"#34797E",opacity:30,x:78,y:25,size:50},glow2:{color:"#DCB573",opacity:42,x:20,y:78,size:78}}
      };
      if(presets[mood]){
        state={...state,...presets[mood],glow1:{...presets[mood].glow1},glow2:{...presets[mood].glow2},optics:{...presets[mood].optics}};
        save();
      }
    };
  }
})();
