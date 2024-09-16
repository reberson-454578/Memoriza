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

    // Verifica se o jogo foi vencido após um pequeno delay para garantir a sincronia com a animação
    setTimeout(() => {
      if (matchedCards === cards.length) {
        playSound(winSound);
        showVictoryModal();
      }
    }, 300); // Tempo de espera para a animação de virar a carta
  } else {
    flippedCards.forEach(({ card }) => card.classList.add("incorrect"));
    setTimeout(() => {
      flippedCards.forEach(({ card }) => {
        card.classList.remove("flipped", "incorrect");
      });
      flippedCards = [];
    }, 1000); // Espera 1 segundo para virar a carta de volta antes de continuar
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

// Função para fechar o modal de categorias
document
  .getElementById("close-category-modal")
  .addEventListener("click", () => {
    document.getElementById("category-modal").classList.add("hidden");
    document
      .querySelector("#category-modal .modal-content")
      .classList.remove("show");
  });

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

window.onload = () => {
  initializeGameBoard();
  animateEntry();
};
