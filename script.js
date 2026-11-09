

// =========================================
// ОКНА САЙТА
// =========================================

const overlay = document.getElementById("modal-overlay");

const modals = document.querySelectorAll(".modal");

const openButtons = document.querySelectorAll("[data-modal]");

const closeButtons = document.querySelectorAll(".modal-close");

let drawerOverlayTimer = null;


// Открытие окна

function openModal(modalId) {

  const selectedModal = document.getElementById(modalId);

  if (!selectedModal || !overlay) return;

  // Отменяем предыдущее закрытие, если оно ещё выполняется

  if (drawerOverlayTimer !== null) {

    clearTimeout(drawerOverlayTimer);

    drawerOverlayTimer = null;

  }

  // Закрываем остальные окна

  modals.forEach(modal => {

    modal.classList.remove("active");

  });

  // Определяем тип открываемого окна

  const isDrawer = selectedModal.classList.contains("content-modal");

  overlay.classList.toggle("drawer-mode", isDrawer);

  // Показываем фон и выбранное окно

  overlay.classList.add("active");

  selectedModal.classList.add("active");

  document.body.style.overflow = "hidden";

}


// Закрытие окна

function closeModal() {

  const isDrawer = overlay.classList.contains("drawer-mode");

  // Запускаем обратную анимацию

  overlay.classList.remove("active");

  modals.forEach(modal => {

    modal.classList.remove("active");

  });

  document.body.style.overflow = "";


  // Не удаляем режим бокового окна,
  // пока не завершится выезд и размытие

  if (isDrawer) {

    if (drawerOverlayTimer !== null) {

      clearTimeout(drawerOverlayTimer);

    }

    drawerOverlayTimer = setTimeout(() => {

      overlay.classList.remove("drawer-mode");

      drawerOverlayTimer = null;

    }, 2000);

  } else {

    overlay.classList.remove("drawer-mode");

  }

}


// Открытие по кнопкам
openButtons.forEach(button => {
  button.addEventListener("click", () => {
    const modalId = button.dataset.modal;
    openModal(modalId);

  });

});


// Закрытие по крестику

closeButtons.forEach(button => {

  button.addEventListener("click", closeModal);

});


// Закрытие при нажатии за пределами окна
overlay.addEventListener("click", event => {
  if (event.target === overlay) {
    closeModal();

  }
});


// Закрытие клавишей Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
  }
});



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

const photoTwo = document.getElementById("photo-two");

// Интервал смены фотографии — 10 секунд
const photoChangeTime = 10000;

let firstPhotoIndex = 0;
let secondPhotoIndex = 0;
let changeCounter = 0;


function changePhoto(imageElement, images, currentIndex) {

  const nextIndex = (currentIndex + 1) % images.length;

  imageElement.classList.add("changing");

  const newImage = new Image();

  newImage.onload = () => {

    imageElement.src = images[nextIndex];

    imageElement.classList.remove("changing");

  };

  newImage.onerror = () => {

    imageElement.classList.remove("changing");

  };

  newImage.src = images[nextIndex];

  return nextIndex;

}

/* =========================================
   СМЕНА ФОТОГРАФИЙ И СВЕТОВОЙ ИМПУЛЬС
========================================= */


setInterval(() => {

  changeCounter++;

  if (changeCounter % 2 === 1) {

    firstPhotoIndex = changePhoto(
      photoOne,
      photoSets.first,
      firstPhotoIndex
    );

  } else {

    secondPhotoIndex = changePhoto(
      photoTwo,
      photoSets.second,
      secondPhotoIndex
    );

  }

}, photoChangeTime);

/* =========================================
   ФОРМА ЗАПИСИ
========================================= */

const appointmentForm = document.getElementById("appointment-form");


appointmentForm.addEventListener("submit", event => {

  event.preventDefault();

  alert(
    "Форма пока находится в демонстрационном режиме. " +
    "Подключение отправки заявок мы сделаем отдельно."
  );

});


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
        photos: document.getElementById('photos-panel-content')
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
   АВТОМАТИЧЕСКАЯ ДИАГОНАЛЬ РАЗДЕЛА «ЗАПРОСЫ»
========================================= */

function updateRequestsDiagonal() {

    const modal = document.getElementById("requests-modal");

    if (!modal) return;

    const items = modal.querySelectorAll(
        ".requests-list > li"
    );

    const cut = parseFloat(
        getComputedStyle(modal)
            .getPropertyValue("--modal-cut")
    ) || 15;

    // Максимальное смещение последних пунктов
    const maxShift = cut * 0.65;

    const lastIndex = Math.max(items.length - 1, 1);

    items.forEach((item, index) => {

        const progress = index / lastIndex;

        // Автоматический номер для анимации
        item.style.setProperty(
            "--item-order",
            index
        );

        // Автоматическое смещение по диагонали
        item.style.setProperty(
            "--item-shift",
            (maxShift * progress).toFixed(2) + "%"
        );

    });
}

// Первоначальный расчёт
updateRequestsDiagonal();

// Пересчёт при изменении размера окна
window.addEventListener(
    "resize",
    updateRequestsDiagonal
);


/* =========================================
   НОВАЯ ШТОРКА — УПРАВЛЕНИЕ
========================================= */

(function () {
    const drawer = document.getElementById("sideDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const closeButton = document.getElementById("drawerClose");

    if (!drawer || !backdrop || !closeButton) return;

    let drawerOpen = false;
    let previousFocus = null;

    function openDrawer() {
        if (drawerOpen) return;

        drawerOpen = true;
        previousFocus = document.activeElement;

        backdrop.classList.add("is-open");
        drawer.classList.add("is-open");
        document.body.classList.add("drawer-is-open");

        drawer.setAttribute("aria-hidden", "false");
        backdrop.setAttribute("aria-hidden", "false");

        closeButton.focus();
    }

    function closeDrawer() {
        if (!drawerOpen) return;

        drawerOpen = false;

        drawer.classList.remove("is-open");
        backdrop.classList.remove("is-open");
        document.body.classList.remove("drawer-is-open");

        drawer.setAttribute("aria-hidden", "true");
        backdrop.setAttribute("aria-hidden", "true");

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    closeButton.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && drawerOpen) {
            closeDrawer();
        }
    });

    // Временный способ проверить шторку из консоли браузера
    window.openTestDrawer = openDrawer;
    window.closeTestDrawer = closeDrawer;
})();



/* =========================================
   АВТОМАТИЧЕСКАЯ ДИАГОНАЛЬ «ОБРАЗОВАНИЕ»
========================================= */

function updateEducationDiagonal() {

    const modal = document.getElementById("education-modal");

    if (!modal) return;

    const items = modal.querySelectorAll(".education-entry");

    const cut = parseFloat(
        getComputedStyle(modal)
            .getPropertyValue("--modal-cut")
    ) || 15;

    const maxShift = cut * 0.65;
    const lastIndex = Math.max(items.length - 1, 1);

    items.forEach((item, index) => {

        const progress = index / lastIndex;

        item.style.setProperty("--education-order", index);

        item.style.setProperty(
            "--education-shift",
            (maxShift * progress).toFixed(2) + "%"
        );

    });
}

// Первоначальный расчёт
updateEducationDiagonal();

// Пересчёт при изменении размера окна
window.addEventListener("resize", updateEducationDiagonal);
