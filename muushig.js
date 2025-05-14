
const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let botHand = [];
let trumpCard = '';

function initGame() {
    buildDeck();
    shuffle(deck);
    dealCards();
    setTrump();
    renderHands();
}

function buildDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(rank + suit);
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function dealCards() {
    playerHand = deck.splice(0, 5);
    botHand = deck.splice(0, 5);
}

function setTrump() {
    trumpCard = deck.pop();
    document.getElementById("trump").innerText = trumpCard;
}

function renderHands() {
    const playerDiv = document.getElementById("player-cards");
    const botDiv = document.getElementById("bot-cards");
    playerDiv.innerHTML = '';
    botDiv.innerHTML = '';

    for (let card of playerHand) {
        const span = document.createElement("span");
        span.className = "card";
        span.innerText = card;
        playerDiv.appendChild(span);
    }

    for (let i = 0; i < botHand.length; i++) {
        const span = document.createElement("span");
        span.className = "card back";
        span.innerText = "🂠";
        botDiv.appendChild(span);
    }
}

// Run game
window.onload = initGame;
