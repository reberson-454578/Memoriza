// script.js

const categories = {
  fruits: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🥭"],
  animals: ["🐶", "🐱", "🦁", "🦊", "🐸", "🐧", "🐢", "🐘"],
  objects: ["🖥️", "📱", "🖊️", "📷", "🎸", "🚗", "✈️", "⏰"],
  sports: ["🏀", "🎾", "🏈", "⚾", "⚽", "🥊", "🏓", "🥎"],
  plants: ["🌱", "🌵", "🍀", "🍄", "🌾", "🌲", "🌻", "🌹"],
  foods: ["🍕", "🍔", "🍟", "🍣", "🍰", "🍩", "🍜", "🍤"],
  clothes: ["👕", "👖", "🩳", "🧦", "🩲", "👗", "🧣", "🩱"],
};

let currentCategory = "fruits";
let cards = [...categories[currentCategory], ...categories[currentCategory]];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;

// Inicializa o objeto de recordes para armazenar recordes por categoria
let records = JSON.parse(localStorage.getItem("memoryGameRecords")) || {};

// Verifica se existe um recorde para a categoria atual; caso contrário, define como null
function initializeRecordForCategory(category) {
  if (!records[category]) {
    records[category] = null; // Inicia o recorde como null se não houver um para esta categoria
  }
}

// Atualiza o recorde para a categoria atual quando o jogador vence
function updateRecord(moves, category) {
  initializeRecordForCategory(category);

  // Verifica se o recorde deve ser atualizado
  if (records[category] === null || moves < records[category]) {
    records[category] = moves;
    localStorage.setItem("memoryGameRecords", JSON.stringify(records)); // Salva o novo recorde no armazenamento local
  }
  displayRecord(category); // Atualiza a exibição do recorde na tela
}

// Exibe o recorde para a categoria atual na interface do usuário
function displayRecord(category) {
  initializeRecordForCategory(category);

  const record = records[category];
  document.getElementById("record").textContent = `Recorde: ${
    record !== null ? record : "--"
  }`;
}

// Funções de áudio
const flipSound = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");
const winSound = new Audio("win.mp3");

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

// Função para embaralhar as cartas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para criar elementos de carta
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

// Inicializa o tabuleiro do jogo
function initializeGameBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  shuffle(cards).forEach((value) => {
    const cardElement = createCardElement(value);
    gameBoard.appendChild(cardElement);
  });
  resetGame();
  displayRecord(currentCategory); // Exibe o recorde da categoria atual
}

// Lida com o clique em uma carta
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

// Verifica se há uma correspondência entre duas cartas viradas
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
        updateRecord(moves, currentCategory); // Atualiza o recorde para a categoria atual
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

// Mostra o modal de vitória
function showVictoryModal() {
  const modal = document.getElementById("victory-modal");
  const finalMoves = document.getElementById("final-moves");
  finalMoves.textContent = moves;
  modal.classList.remove("hidden");
  const modalContent = document.querySelector(".modal-content");
  setTimeout(() => modalContent.classList.add("show"), 100);
}

// Reseta o jogo
function resetGame() {
  matchedCards = 0;
  moves = 0;
  flippedCards = [];
  document.getElementById("moves").textContent = `Movimentos: ${moves}`;
  document.getElementById("victory-modal").classList.add("hidden");
  document.querySelector(".modal-content").classList.remove("show");
  animateEntry();
}

// Anima a entrada do jogo
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

// Lida com o clique para reiniciar o jogo
function handleRestartClick() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.style.opacity = "0";
  setTimeout(initializeGameBoard, 500);
}

// Lida com a seleção de categoria
function handleCategorySelection(event) {
  const category = event.target.getAttribute("data-category");
  if (category) {
    currentCategory = category;
    cards = [...categories[currentCategory], ...categories[currentCategory]];
    initializeGameBoard();
    document.getElementById("category-modal").classList.add("hidden");
  }
}

// Eventos de clique para fechar modais
document.getElementById("close-victory-modal").addEventListener("click", () => {
  document.getElementById("victory-modal").classList.add("hidden");
  document.querySelector(".modal-content").classList.remove("show");
});

document
  .getElementById("close-category-modal")
  .addEventListener("click", () => {
    document.getElementById("category-modal").classList.add("hidden");
    document.querySelector(".modal-content").classList.remove("show");
  });

// Eventos de clique para os botões
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

// Inicializa o jogo ao carregar a página
window.onload = () => {
  initializeGameBoard();
  animateEntry();
};
