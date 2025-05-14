
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


function botSwapAndTakeTrump() {
    // Step 1: Bot randomly selects 2-4 cards to swap
    let numToSwap = Math.min(remainingDeck.length, Math.floor(Math.random() * 4) + 1);
    for (let i = 0; i < numToSwap; i++) {
        if (remainingDeck.length > 0) {
            botHand[i] = remainingDeck.shift();
        }
    }

    // Step 2: Bot takes trump card, replaces weakest card
    let lowestIndex = 0;
    for (let i = 1; i < botHand.length; i++) {
        if (cardValue(botHand[i]) < cardValue(botHand[lowestIndex])) {
            lowestIndex = i;
        }
    }
    botHand[lowestIndex] = trumpCard;

    renderHands();
}

// Utility to evaluate card strength for trump pickup
function cardValue(card) {
    const rankOrder = {'7':1, '8':2, '9':3, '10':4, 'J':5, 'Q':6, 'K':7, 'A':8};
    let rank = card.slice(0, -1);
    return rankOrder[rank] || 0;
}

// Link bot swap to "Play" button for now
function initGame() {
    buildDeck();
    shuffleDeck();
    dealCards();
    renderHands();

    const swapButton = document.querySelector("button#swap-btn");
    if (swapButton) {
        swapButton.onclick = swapSelectedCards;
    }

    const playButton = document.querySelector("button#play-btn");
    if (playButton) {
        playButton.onclick = botSwapAndTakeTrump;
    }
}
