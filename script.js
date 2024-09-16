// script.js

const categories = {
  fruits: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🥭"],
  animals: ["🐶", "🐱", "🦁", "🦊", "🐸", "🐧", "🐢", "🐘"],
  objects: ["🖥️", "📱", "🖊️", "📷", "🎸", "🚗", "✈️", "⏰"],
  sports: ["🏀", "🎾", "🏈", "⚾", "⚽", "🥊", "🏓", "🥎"],
};
let currentCategory = "fruits";
let cards = [...categories[currentCategory], ...categories[currentCategory]];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;

// Recupera o recorde do localStorage ou define como infinito se não houver
let record = localStorage.getItem("record")
  ? parseInt(localStorage.getItem("record"))
  : Infinity;
document.getElementById("record").textContent = `Recorde: ${
  record === Infinity ? "--" : record
}`;

const flipSound = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");
const winSound = new Audio("win.mp3");

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCardElement(value) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back" data-fruit="${value}">${value}</div>
        </div>
    `;
  card.addEventListener("click", () => handleCardClick(card, value));
  return card;
}

function initializeGameBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  shuffle(cards).forEach((value) => {
    const cardElement = createCardElement(value);
    gameBoard.appendChild(cardElement);
  });
  resetGame();
}

function handleCardClick(card, value) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;
  card.classList.add("flipped");
  playSound(flipSound);
  flippedCards.push({ card, value });

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById("moves").textContent = `Movimentos: ${moves}`;
    checkForMatch();
  }
}

function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;
  if (firstCard.value === secondCard.value) {
    matchedCards += 2;
    flippedCards.forEach(({ card }) => card.classList.add("correct"));
    playSound(matchSound);
    flippedCards = [];

    setTimeout(() => {
      if (matchedCards === cards.length) {
        playSound(winSound);
        checkForRecord();
        showVictoryModal();
      }
    }, 300);
  } else {
    flippedCards.forEach(({ card }) => card.classList.add("incorrect"));
    setTimeout(() => {
      flippedCards.forEach(({ card }) => {
        card.classList.remove("flipped", "incorrect");
      });
      flippedCards = [];
    }, 1000);
  }
}

function checkForRecord() {
  if (moves < record) {
    record = moves;
    localStorage.setItem("record", record); // Salva o recorde no localStorage
    document.getElementById("record").textContent = `Recorde: ${record}`;
  }
}

function showVictoryModal() {
  const modal = document.getElementById("victory-modal");
  const finalMoves = document.getElementById("final-moves");
  finalMoves.textContent = moves;
  modal.classList.remove("hidden");
  const modalContent = document.querySelector(".modal-content");
  setTimeout(() => modalContent.classList.add("show"), 100);
}

function resetGame() {
  matchedCards = 0;
  moves = 0;
  flippedCards = [];
  document.getElementById("moves").textContent = `Movimentos: ${moves}`;
  document.getElementById("victory-modal").classList.add("hidden");
  document.querySelector(".modal-content").classList.remove("show");
  animateEntry();
}

function animateEntry() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.style.opacity = "0";
  gameContainer.style.transform = "translateY(-50px)";
  setTimeout(() => {
    gameContainer.style.transition = "opacity 1s, transform 1s";
    gameContainer.style.opacity = "1";
    gameContainer.style.transform = "translateY(0)";
  }, 100);
}

function handleRestartClick() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.style.opacity = "0";
  setTimeout(initializeGameBoard, 500);
}

function handleCategorySelection(event) {
  const category = event.target.getAttribute("data-category");
  if (category) {
    currentCategory = category;
    cards = [...categories[currentCategory], ...categories[currentCategory]];
    initializeGameBoard();
    document.getElementById("category-modal").classList.add("hidden");
  }
}

document
  .getElementById("restart-button")
  .addEventListener("click", handleRestartClick);
document
  .getElementById("modal-restart-button")
  .addEventListener("click", handleRestartClick);
document.getElementById("category-button").addEventListener("click", () => {
  document.getElementById("category-modal").classList.remove("hidden");
  document
    .querySelector("#category-modal .modal-content")
    .classList.add("show");
});
document.querySelectorAll(".category-option").forEach((button) => {
  button.addEventListener("click", handleCategorySelection);
});

document
  .getElementById("close-category-modal")
  .addEventListener("click", () => {
    document.getElementById("category-modal").classList.add("hidden");
    document
      .querySelector("#category-modal .modal-content")
      .classList.remove("show");
  });

// Função para fechar o modal de vitória
document.getElementById("close-victory-modal").addEventListener("click", () => {
  document.getElementById("victory-modal").classList.add("hidden");
  document.querySelector(".modal-content").classList.remove("show");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch((error) => {
        console.log("Falha ao registrar o Service Worker:", error);
      });
  });
}

window.onload = () => {
  initializeGameBoard();
  animateEntry();
};
