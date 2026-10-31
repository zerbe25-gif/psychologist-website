
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

  first: [
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900"
  ],

  second: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900",
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=900"
  ]

};


const photoOne = document.getElementById("photo-one");

const photoTwo = document.getElementById("photo-two");

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
   ЕДИНЫЙ ТАЙМЕР И СМЕНА ФОТОГРАФИЙ
========================================= */

const timerProgress = document.querySelector(".timer-progress");
const timerContainer = document.querySelector(".timer-container");

const circleLength = 2 * Math.PI * 44;
const totalTime = 20000;
const photoChangeTime = 10000;

let timerStart = null;
let changeCounter = 0;

if (timerProgress && timerContainer) {

  timerProgress.style.strokeDasharray =
    `${circleLength} ${circleLength}`;

  timerProgress.style.strokeDashoffset = circleLength;

  function animateTimer(timestamp) {

    if (timerStart === null) {
      timerStart = timestamp;
    }

    const elapsed = (timestamp - timerStart) % totalTime;
    const progress = elapsed / totalTime;

    // Движение кольца
    timerProgress.style.strokeDashoffset =
      circleLength * (1 - progress);

    // Смена цвета в середине цикла
    timerProgress.style.stroke =
      elapsed < photoChangeTime ? "#608f91" : "#343330";

    requestAnimationFrame(animateTimer);
  }

  requestAnimationFrame(animateTimer);
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

  // Световой импульс при смене каждого снимка
  if (timerContainer) {

    timerContainer.classList.remove("timer-pulse");

    void timerContainer.offsetWidth;

    timerContainer.classList.add("timer-pulse");
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
