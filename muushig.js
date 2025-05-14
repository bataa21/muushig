
const suits = ['C', 'D', 'H', 'S'];
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let botHand = [];
let trumpCard = '';
let remainingDeck = [];
let selectedIndexes = [];

function buildDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(rank + suit);
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
    remainingDeck = [...deck];
}

function renderHands() {
    const playerArea = document.getElementById("player-hand");
    const botArea = document.getElementById("bot-hand");
    const trumpImg = document.getElementById("trump-card");
    const deckImg = document.getElementById("deck-card");

    playerArea.innerHTML = '';
    botArea.innerHTML = '';

    // Render player cards
    for (let i = 0; i < playerHand.length; i++) {
        const card = playerHand[i];
        const img = document.createElement("img");
        img.src = `cards/${card}.png`;
        img.className = "card";
        img.style.border = selectedIndexes.includes(i) ? "3px solid yellow" : "none";
        img.onclick = () => toggleSelect(i);
        playerArea.appendChild(img);
    }

    // Render bot card backs
    for (let i = 0; i < 5; i++) {
        const img = document.createElement("img");
        img.src = "cards/card-back.png";
        img.className = "card";
        botArea.appendChild(img);
    }

    trumpImg.src = `cards/${trumpCard}.png`;
    deckImg.src = "cards/card-back.png";
}

function toggleSelect(index) {
    if (selectedIndexes.includes(index)) {
        selectedIndexes = selectedIndexes.filter(i => i !== index);
    } else {
        if (selectedIndexes.length < 5) {
            selectedIndexes.push(index);
        }
    }
    renderHands();
}

function swapSelectedCards() {
    for (let i of selectedIndexes) {
        if (remainingDeck.length > 0) {
            const newCard = remainingDeck.shift();
            playerHand[i] = newCard;
        }
    }
    selectedIndexes = [];
    renderHands();
}

function initGame() {
    buildDeck();
    shuffleDeck();
    dealCards();
    renderHands();

    const swapButton = document.querySelector("button#swap-btn");
    if (swapButton) {
        swapButton.onclick = swapSelectedCards;
    }
}

window.onload = initGame;
