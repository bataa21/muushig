
const suits = ['C', 'D', 'H', 'S'];
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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

function toggleSelect(index) {
    if (selectedIndexes.includes(index)) {
        selectedIndexes = selectedIndexes.filter(i => i !== index);
    } else {
        if (selectedIndexes.length < 5) selectedIndexes.push(index);
    }
    renderSwapView();
}

function renderSwapView() {
    const playerArea = document.getElementById("player-hand");
    const botArea = document.getElementById("bot-hand");
    const trumpImg = document.getElementById("trump-card");

    playerArea.innerHTML = '';
    botArea.innerHTML = '';

    for (let i = 0; i < playerHand.length; i++) {
        const card = playerHand[i];
        const img = document.createElement("img");
        img.src = `cards/${card}.png`;
        img.className = "card";
        img.style.border = selectedIndexes.includes(i) ? "3px solid yellow" : "none";
        img.onclick = () => toggleSelect(i);
        playerArea.appendChild(img);
    }

    for (let i = 0; i < 5; i++) {
        const img = document.createElement("img");
        img.src = "cards/card-back.png";
        img.className = "card";
        botArea.appendChild(img);
    }

    trumpImg.src = `cards/${trumpCard}.png`;
    deckImg.src = "cards/card-back.png";
}

function swapSelectedCards() {
    for (let i of selectedIndexes) {
        if (remainingDeck.length > 0) {
            playerHand[i] = remainingDeck.shift();
        }
    }
    selectedIndexes = [];
    renderSwapView();
}

function botSwapAndTakeTrump() {
    let numToSwap = Math.min(remainingDeck.length, Math.floor(Math.random() * 4) + 1);
    for (let i = 0; i < numToSwap; i++) {
        if (remainingDeck.length > 0) botHand[i] = remainingDeck.shift();
    }

    let lowestIndex = 0;
    for (let i = 1; i < botHand.length; i++) {
        if (cardValue(botHand[i]) < cardValue(botHand[lowestIndex])) {
            lowestIndex = i;
        }
    }
    botHand[lowestIndex] = trumpCard;
}

function cardValue(card) {
    const order = {'7':1, '8':2, '9':3, '10':4, 'J':5, 'Q':6, 'K':7, 'A':8};
    return order[card.slice(0, -1)] || 0;
}

function completeSwapPhase() {
    swapSelectedCards();
    botSwapAndTakeTrump();
    setTimeout(() => {
        const script = document.createElement("script");
        script.src = "play_phase.js";
        document.body.appendChild(script);
    }, 500);
}

window.onload = () => {
    buildDeck();
    shuffleDeck();
    dealCards();
    renderSwapView();
    document.getElementById("swap-btn").onclick = swapSelectedCards;
    document.getElementById("play-btn").onclick = completeSwapPhase;
};
