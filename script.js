
/* =========================================
   ОКНА САЙТА
========================================= */

const overlay = document.getElementById("modal-overlay");

const modals = document.querySelectorAll(".modal");

const openButtons = document.querySelectorAll("[data-modal]");

const closeButtons = document.querySelectorAll(".modal-close");


function openModal(modalId) {

  const selectedModal = document.getElementById(modalId);

  if (!selectedModal) return;

  modals.forEach(modal => {
    modal.classList.remove("active");
  });

  overlay.classList.add("active");

  selectedModal.classList.add("active");

  document.body.style.overflow = "hidden";

}


function closeModal() {

  overlay.classList.remove("active");

  modals.forEach(modal => {
    modal.classList.remove("active");
  });

  document.body.style.overflow = "";

}


// Открытие окон по нажатию кнопок

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
        "images/photos/first-1.jpg",
        "images/photos/first-2.jpg",
        "images/photos/first-3.jpg"
    ],

    // Фотографии второй рамки
    second: [
        "images/photos/second-1.jpg",
        "images/photos/second-2.jpg",
        "images/photos/second-3.jpg",
       "images/photos/second-4.jpg",
       "images/photos/second-5.jpg"


    ]

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
