// === Global Variables ===
let deck = [];
let playerHand = [];
let botHand = [];
let trumpCard = null;
let playerScore = 15;
let botScore = 15;

// === Utility Functions ===
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getCardValue(card) {
  const rank = card.slice(0, -1);
  return ['7','8','9','10','J','Q','K','A'].indexOf(rank);
}

function getCardSuit(card) {
  return card.slice(-1);
}

// === Game Setup ===
function initializeDeck() {
  const suits = ['C','D','H','S'];
  const ranks = ['7','8','9','10','J','Q','K','A'];
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(rank + suit);
    }
  }
  shuffle(deck);
}

function dealCards() {
  playerHand = deck.splice(0, 5);
  botHand = deck.splice(0, 5);
  trumpCard = deck.shift();
}

function renderHands() {
  const playerDiv = document.getElementById('player-hand');
  const botDiv = document.getElementById('bot-hand');
  const trumpDiv = document.getElementById('trump-card');
  const deckDiv = document.getElementById('deck-card');

  playerDiv.innerHTML = '';
  botDiv.innerHTML = '';

  playerHand.forEach(card => {
    const img = document.createElement('img');
    img.src = `cards/${card}.png`;
    img.className = 'card';
    img.onclick = () => playerPlay(card);
    playerDiv.appendChild(img);
  });

  botHand.forEach(() => {
    const img = document.createElement('img');
    img.src = 'cards/card-back.png';
    img.className = 'card';
    botDiv.appendChild(img);
  });

  trumpDiv.src = `cards/${trumpCard}.png`;
  deckDiv.src = 'cards/card-back.png';
}

function updateScores() {
  document.getElementById('player-score').textContent = `Тоглогч: ${playerScore}`;
  document.getElementById('bot-score').textContent = `Бот: ${botScore}`;
}

// === Play Phase Logic ===
function playerPlay(card) {
  const playArea = document.getElementById('play-area');
  playArea.innerHTML = '';

  const playerImg = document.createElement('img');
  playerImg.src = `cards/${card}.png`;
  playerImg.className = 'card';
  playArea.appendChild(playerImg);

  playerHand = playerHand.filter(c => c !== card);

  const botCard = botRespond(card);
  const botImg = document.createElement('img');
  botImg.src = `cards/${botCard}.png`;
  botImg.className = 'card';
  playArea.appendChild(botImg);

  botHand = botHand.filter(c => c !== botCard);

  evaluateTrick(card, botCard);
  renderHands();
  updateScores();
  checkRoundEnd();
}

function botRespond(playerCard) {
  const playerSuit = getCardSuit(playerCard);
  const playerVal = getCardValue(playerCard);

  let beatable = botHand.filter(c => getCardSuit(c) === playerSuit && getCardValue(c) > playerVal);
  if (beatable.length) return beatable[0];

  let trumps = botHand.filter(c => getCardSuit(c) === getCardSuit(trumpCard));
  if (trumps.length) return trumps[0];

  return botHand[0];
}

function evaluateTrick(playerCard, botCard) {
  const trumpSuit = getCardSuit(trumpCard);
  const pSuit = getCardSuit(playerCard);
  const bSuit = getCardSuit(botCard);
  const pVal = getCardValue(playerCard);
  const bVal = getCardValue(botCard);

  if (bSuit === pSuit && bVal > pVal || bSuit === trumpSuit && pSuit !== trumpSuit) {
    playerScore--;
  } else {
    botScore--;
  }
}

function checkRoundEnd() {
  if (playerHand.length === 0) {
    if (playerScore <= 0 || botScore <= 0 || playerScore <= -5 || botScore <= -5) {
      alert(playerScore <= 0 ? "Тоглогч хожлоо!" : "Бот хожлоо!");
    } else {
      startGame();
    }
  }
}

function startGame() {
  initializeDeck();
  dealCards();
  renderHands();
  updateScores();
  document.getElementById('play-area').innerHTML = '';
}
