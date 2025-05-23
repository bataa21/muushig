// ==============================
// Muushig 2-Player Game Logic
// ==============================

// --- Global Variables (from globals.js) ---
// suits, ranks, deck, playerHand, botHand, trumpCard, playerScore, botScore, isPlayerTurn, currentPhase

const suits = ['C', 'D', 'H', 'S']; // Clubs, Diamonds, Hearts, Spades
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let botHand = [];
let trumpCard = null;
let playerScore = 15;
let botScore = 15;
let isPlayerTurn = true;
let currentPhase = 'swap';


// --- Utility Functions ---
function createDeck() {
  deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCards() {
  playerHand = deck.splice(0, 5);
  botHand = deck.splice(0, 5);
  trumpCard = deck.pop();
}

function updateScores() {
  document.getElementById('player-score').innerText = playerScore;
  document.getElementById('bot-score').innerText = botScore;
}

function updatePhaseDisplay() {
  const phaseEl = document.getElementById('phase-indicator');
  if (phaseEl) phaseEl.innerText = currentPhase.toUpperCase();
}

function displayPlayerHand() {
  const playerHandDiv = document.getElementById('player-hand');
  playerHandDiv.innerHTML = '';
  playerHand.forEach((card, i) => {
    const img = document.createElement('img');
    img.src = `cards/${card}.png?v=${Date.now()}`;
    img.alt = card;
    img.classList.add('card');
    if (i === selectedCardIndex) img.classList.add('selected');
    img.addEventListener('click', () => {
      if (currentPhase === 'play') {
        playerPlaysCard(i);
      } else {
        selectedCardIndex = i;
        displayPlayerHand();
      }
    });
    playerHandDiv.appendChild(img);
  });
}

function displayBotHand() {
  const botHandDiv = document.getElementById('bot-hand');
  botHandDiv.innerHTML = '';
  botHand.forEach(() => {
    const img = document.createElement('img');
    img.src = 'cards/back.png?v=' + Date.now();
    img.alt = 'Hidden';
    img.classList.add('card');
    botHandDiv.appendChild(img);
  });
}

function displayTrumpCard() {
  const trumpImg = document.getElementById('trump');
  if (trumpCard) {
    trumpImg.src = `cards/${trumpCard}.png?v=${Date.now()}`;
    trumpImg.alt = trumpCard;
  } else {
    trumpImg.src = '';
    trumpImg.alt = '';
  }
}

function displayPlayArea() {
  const playArea = document.getElementById('play-area');
  if (!playArea) return;
  playArea.innerHTML = '';

  if (lastBotCard) {
    const botCardImg = document.createElement('img');
    botCardImg.src = `cards/${lastBotCard}.png?v=${Date.now()}`;
    botCardImg.alt = lastBotCard;
    botCardImg.classList.add('card');
    playArea.appendChild(botCardImg);
  }

  if (lastPlayerCard) {
    const playerCardImg = document.createElement('img');
    playerCardImg.src = `cards/${lastPlayerCard}.png?v=${Date.now()}`;
    playerCardImg.alt = lastPlayerCard;
    playerCardImg.classList.add('card');
    playArea.appendChild(playerCardImg);
  }
}

function startGame() {
  createDeck();
  shuffleDeck();
  dealCards();
  updateScores();
  displayPlayerHand();
  displayBotHand();
  displayTrumpCard();
  lastPlayerCard = null;
  lastBotCard = null;
  displayPlayArea();
  currentPhase = 'swap';
  updatePhaseDisplay();
  console.log('New game started. Phase:', currentPhase);
}

function performSwap() {
  if (currentPhase !== 'swap') return;

  playerHand.sort((a, b) => ranks.indexOf(a.slice(0, -1)) - ranks.indexOf(b.slice(0, -1)));
  for (let i = 0; i < 2 && deck.length > 0; i++) {
    playerHand[i] = deck.pop();
  }

  botHand.sort((a, b) => ranks.indexOf(a.slice(0, -1)) - ranks.indexOf(b.slice(0, -1)));
  for (let i = 0; i < 2 && deck.length > 0; i++) {
    botHand[i] = deck.pop();
  }

  if (trumpCard) {
    let weakest = 0;
    for (let i = 1; i < botHand.length; i++) {
      if (ranks.indexOf(botHand[i].slice(0, -1)) < ranks.indexOf(botHand[weakest].slice(0, -1))) {
        weakest = i;
      }
    }
    botHand[weakest] = trumpCard;
    trumpCard = null;
  }

  displayPlayerHand();
  displayBotHand();
  displayTrumpCard();

  currentPhase = 'play';
  updatePhaseDisplay();
  console.log("Swapping done. Moving to phase:", currentPhase);
}

function playerPlaysCard(index) {
  if (currentPhase !== 'play') return;
  const playedCard = playerHand.splice(index, 1)[0];
  lastPlayerCard = playedCard;
  selectedCardIndex = null;
  displayPlayerHand();
  displayPlayArea();
  setTimeout(() => botPlaysCard(playedCard), 1000);
}

function botPlaysCard(playerCard) {
  const playerRank = playerCard.slice(0, -1);
  const playerSuit = playerCard.slice(-1);
  const trumpSuit = trumpCard?.slice(-1);

  let options = botHand.filter(c => c.slice(-1) === playerSuit && ranks.indexOf(c.slice(0, -1)) > ranks.indexOf(playerRank))
    .sort((a, b) => ranks.indexOf(a.slice(0, -1)) - ranks.indexOf(b.slice(0, -1)));

  if (options.length === 0 && trumpSuit) {
    options = botHand.filter(c => c.slice(-1) === trumpSuit)
      .sort((a, b) => ranks.indexOf(a.slice(0, -1)) - ranks.indexOf(b.slice(0, -1)));
  }

  if (options.length === 0) {
    options = botHand.sort((a, b) => ranks.indexOf(a.slice(0, -1)) - ranks.indexOf(b.slice(0, -1)));
  }

  const botCard = options[0];
  botHand.splice(botHand.indexOf(botCard), 1);
  lastBotCard = botCard;
  displayBotHand();
  displayPlayArea();

  const botWins = ranks.indexOf(botCard.slice(0, -1)) > ranks.indexOf(playerCard.slice(0, -1));
  if (botWins) playerScore--;
  else botScore--;

  updateScores();
  setTimeout(() => {
    lastPlayerCard = null;
    lastBotCard = null;
    displayPlayArea();
    checkForGameEnd();
  }, 1500);
}

function startPlay() {
  if (currentPhase !== 'play') return;
  alert("Play phase started. Click a card to play.");
  console.log("Play phase active.");
}

function checkForGameEnd() {
  if (playerScore <= 0) {
    alert("Player loses the match!");
  } else if (botScore <= 0) {
    alert("Bot loses the match! You win!");
  }
}

// Auto-run game setup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-button').addEventListener('click', startGame);
  document.getElementById('play-button').addEventListener('click', startPlay);
  document.getElementById('swap-button').addEventListener('click', performSwap);
  startGame();
});
