
const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let botHand = [];
let trumpCard = '';
let playerScore = 0;
let botScore = 0;

function initGame() {
    buildDeck();
    shuffle(deck);
    dealCards();
    setTrump();
    renderHands();
    renderButtons();
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
        span.onclick = () => playCard(card);
        playerDiv.appendChild(span);
    }

    for (let i = 0; i < botHand.length; i++) {
        const span = document.createElement("span");
        span.className = "card back";
        span.innerText = "🂠";
        botDiv.appendChild(span);
    }

    updateScores();
}

function renderButtons() {
    const btnArea = document.getElementById("buttons");
    btnArea.innerHTML = '';
    const skipBtn = document.createElement("button");
    skipBtn.innerText = "⏭️ Skip";
    skipBtn.onclick = () => skipTurn();
    btnArea.appendChild(skipBtn);
}

function playCard(card) {
    const center = document.getElementById("center");
    center.innerText = `You played: ${card}`;
    playerHand = playerHand.filter(c => c !== card);
    botMove(card);
    renderHands();
}

function skipTurn() {
    const center = document.getElementById("center");
    center.innerText = "You skipped!";
    botMove(null);
}

function botMove(playerCard) {
    const center = document.getElementById("center");
    let botCard = null;
    if (playerCard) {
        const suit = playerCard.slice(-1);
        botCard = botHand.find(c => c.slice(-1) === suit);
        if (!botCard) {
            botCard = botHand[0];
        }
        center.innerText += `
Bot played: ${botCard}`;
        botHand = botHand.filter(c => c !== botCard);

        const playerRank = ranks.indexOf(playerCard.slice(0, -1));
        const botRank = ranks.indexOf(botCard.slice(0, -1));
        if (botCard.slice(-1) === playerCard.slice(-1) && botRank > playerRank) {
            botScore++;
        } else {
            playerScore++;
        }
    } else {
        center.innerText += `
Bot takes the round by default.`;
        botScore++;
    }

    updateScores();
    setTimeout(() => {
        if (playerHand.length === 0) initGame();
    }, 2000);
}

function updateScores() {
    document.getElementById("bot-label").innerText = `Bot (${botScore})`;
    document.getElementById("player-label").innerText = `You (${playerScore})`;
}

window.onload = initGame;
