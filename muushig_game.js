// muushig_game.js

let playerHand = [];
let botHand = [];
let deck = [];
let trumpCard = null;
let dealer = '';
let playerScore = 15;
let botScore = 15;

function initializeGame() {
  deck = generateDeck();
    cardData = [...deck]; // make cardData globally available
  shuffleDeck(deck);

  // Deal 10 cards to each player
  playerHand = deck.splice(0, 5);
  botHand = deck.splice(0, 5);

  // Set the trump card
  trumpCard = deck.pop();
  updateTrumpDisplay(trumpCard);

  // Randomly choose dealer
  dealer = Math.random() < 0.5 ? 'player' : 'bot';
  console.log("Dealer:", dealer);

  // Display hands
  updateHandDisplay(playerHand, 'player-hand');
  updateHandDisplay(botHand, 'bot-hand', true); // face-up for debugging

  // Clear play area
  document.getElementById('play-area').innerHTML = '';
}

function generateDeck() {
  const suits = ['H', 'D', 'S', 'C'];
  const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  let deck = [];
  for (let s of suits) {
    for (let v of values) {
      deck.push({ tag: v + s, selected: false });
    }
  }
  return deck;
}

function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateHandDisplay(hand, elementId, faceUp = false) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';
  hand.forEach(card => {
    const img = document.createElement('img');
    img.className = 'card';
    img.src = faceUp ? `cards/${card.tag}.png` : 'cards/card-back.png';
    img.alt = card.tag;
    img.onclick = () => {
      card.selected = !card.selected;
      img.classList.toggle('selected', card.selected);
    };
    container.appendChild(img);
  });
}

function updateTrumpDisplay(card) {
  const trumpCardImg = document.getElementById('trump-card');
  trumpCardImg.src = `cards/${card.tag}.png`;
  trumpCardImg.alt = card.tag;
}
