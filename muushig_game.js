// muushig_game.js

let playerScore = 15;
let botScore = 15;
let playerTricksWon = 0;
let botTricksWon = 0;
let trumpSuit = "H"; // default trump suit
let currentPlayerTurn = "player";

const scoreDisplayPlayer = document.getElementById("score-player");
const scoreDisplayBot = document.getElementById("score-bot");
const playArea = document.getElementById("play-area");
const playerHandDiv = document.getElementById("player-hand");
const botHandDiv = document.getElementById("bot-hand");
const deck = [];
let playerHand = [];
let botHand = [];

function updateScores() {
    scoreDisplayPlayer.textContent = `Тоглогч: ${playerScore}`;
    scoreDisplayBot.textContent = `Бот: ${botScore}`;
}

function resolveTrick(playerCard, botCard) {
    const playerSuit = playerCard.suit;
    const botSuit = botCard.suit;

    let winner = "";
    if (playerSuit === botSuit) {
        winner = playerCard.rank > botCard.rank ? "player" : "bot";
    } else if (botSuit === trumpSuit) {
        winner = "bot";
    } else if (playerSuit === trumpSuit) {
        winner = "player";
    } else {
        winner = "player";
    }

    if (winner === "player") {
        botScore--;
        playerTricksWon++;
        alert("Тоглогч хожлоо!");
    } else {
        playerScore--;
        botTricksWon++;
        alert("Бот хожлоо!");
    }

    updateScores();
    checkRoundEnd();
}

function checkRoundEnd() {
    const totalTricks = playerTricksWon + botTricksWon;
    if (totalTricks >= 5) {
        setTimeout(() => {
            alert("Раунд дууслаа! Шинэ раунд эхэлнэ.");
            resetRound();
        }, 500);
    }
    if (playerScore <= 0 || botScore <= -4) {
        setTimeout(() => alert("Та ялав!"), 500);
        disableGame();
    } else if (botScore <= 0 || playerScore <= -4) {
        setTimeout(() => alert("Бот ялав!"), 500);
        disableGame();
    }
}

function resetRound() {
    playerTricksWon = 0;
    botTricksWon = 0;
    playArea.innerHTML = "";
    playerHandDiv.innerHTML = "";
    botHandDiv.innerHTML = "";
    shuffleDeck();
    dealHands();
    setupCardClicks();
}

function disableGame() {
    document.querySelectorAll(".card").forEach(card => card.onclick = null);
}

function cardFromElement(el) {
    const tag = el.getAttribute("data-tag");
    return {
        suit: tag[tag.length - 1],
        rank: parseInt(tag.slice(0, -1)),
        element: el
    };
}

function createCardElement(card) {
    const img = document.createElement("img");
    img.src = `cards/${card}.png`;
    img.className = "card";
    img.setAttribute("data-tag", card);
    return img;
}

function shuffleDeck() {
    deck.length = 0;
    const suits = ["S", "H", "D", "C"];
    const ranks = [7, 8, 9, 10, 11, 12, 13, 14];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealHands() {
    playerHand = deck.splice(0, 5);
    botHand = deck.splice(0, 5);
    const trumpCard = deck.splice(0, 1)[0];
    trumpSuit = trumpCard[trumpCard.length - 1];

    document.getElementById("trump-card").src = `cards/${trumpCard}.png`;

    playerHand.forEach(card => {
        const el = createCardElement(card);
        playerHandDiv.appendChild(el);
    });
    botHand.forEach(() => {
        const el = createCardElement("card-back");
        botHandDiv.appendChild(el);
    });
}

function botPlay(playerCard) {
    let chosenCard = botHand.shift();
    const el = createCardElement(chosenCard);
    el.setAttribute("data-tag", chosenCard);
    playArea.appendChild(el);
    resolveTrick(playerCard, cardFromElement(el));
    currentPlayerTurn = "player";
}

function setupCardClicks() {
    document.querySelectorAll("#player-hand .card").forEach(card => {
        card.onclick = () => {
            if (currentPlayerTurn !== "player") return;
            const playerCard = cardFromElement(card);
            card.remove();
            playArea.appendChild(playerCard.element);
            currentPlayerTurn = "bot";
            setTimeout(() => botPlay(playerCard), 700);
        };
    });
}

shuffleDeck();
dealHands();
setupCardClicks();
updateScores();
// muushig_game.js

let playerScore = 15;
let botScore = 15;
let playerTricksWon = 0;
let botTricksWon = 0;
let trumpSuit = "H"; // default trump suit
let currentPlayerTurn = "player";

const scoreDisplayPlayer = document.getElementById("score-player");
const scoreDisplayBot = document.getElementById("score-bot");
const playArea = document.getElementById("play-area");
const playerHandDiv = document.getElementById("player-hand");
const botHandDiv = document.getElementById("bot-hand");
const deck = [];
let playerHand = [];
let botHand = [];

function updateScores() {
    scoreDisplayPlayer.textContent = `Тоглогч: ${playerScore}`;
    scoreDisplayBot.textContent = `Бот: ${botScore}`;
}

function resolveTrick(playerCard, botCard) {
    const playerSuit = playerCard.suit;
    const botSuit = botCard.suit;

    let winner = "";
    if (playerSuit === botSuit) {
        winner = playerCard.rank > botCard.rank ? "player" : "bot";
    } else if (botSuit === trumpSuit) {
        winner = "bot";
    } else if (playerSuit === trumpSuit) {
        winner = "player";
    } else {
        winner = "player";
    }

    if (winner === "player") {
        botScore--;
        playerTricksWon++;
        alert("Тоглогч хожлоо!");
    } else {
        playerScore--;
        botTricksWon++;
        alert("Бот хожлоо!");
    }

    updateScores();
    checkRoundEnd();
}

function checkRoundEnd() {
    const totalTricks = playerTricksWon + botTricksWon;
    if (totalTricks >= 5) {
        setTimeout(() => {
            alert("Раунд дууслаа! Шинэ раунд эхэлнэ.");
            resetRound();
        }, 500);
    }
    if (playerScore <= 0 || botScore <= -4) {
        setTimeout(() => alert("Та ялав!"), 500);
        disableGame();
    } else if (botScore <= 0 || playerScore <= -4) {
        setTimeout(() => alert("Бот ялав!"), 500);
        disableGame();
    }
}

function resetRound() {
    playerTricksWon = 0;
    botTricksWon = 0;
    playArea.innerHTML = "";
    playerHandDiv.innerHTML = "";
    botHandDiv.innerHTML = "";
    shuffleDeck();
    dealHands();
    setupCardClicks();
}

function disableGame() {
    document.querySelectorAll(".card").forEach(card => card.onclick = null);
}

function cardFromElement(el) {
    const tag = el.getAttribute("data-tag");
    return {
        suit: tag[tag.length - 1],
        rank: parseInt(tag.slice(0, -1)),
        element: el
    };
}

function createCardElement(card) {
    const img = document.createElement("img");
    img.src = `cards/${card}.png`;
    img.className = "card";
    img.setAttribute("data-tag", card);
    return img;
}

function shuffleDeck() {
    deck.length = 0;
    const suits = ["S", "H", "D", "C"];
    const ranks = [7, 8, 9, 10, 11, 12, 13, 14];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealHands() {
    playerHand = deck.splice(0, 5);
    botHand = deck.splice(0, 5);
    const trumpCard = deck.splice(0, 1)[0];
    trumpSuit = trumpCard[trumpCard.length - 1];

    document.getElementById("trump-card").src = `cards/${trumpCard}.png`;

    playerHand.forEach(card => {
        const el = createCardElement(card);
        playerHandDiv.appendChild(el);
    });
    botHand.forEach(() => {
        const el = createCardElement("card-back");
        botHandDiv.appendChild(el);
    });
}

function botPlay(playerCard) {
    let chosenCard = botHand.shift();
    const el = createCardElement(chosenCard);
    el.setAttribute("data-tag", chosenCard);
    playArea.appendChild(el);
    resolveTrick(playerCard, cardFromElement(el));
    currentPlayerTurn = "player";
}

function setupCardClicks() {
    document.querySelectorAll("#player-hand .card").forEach(card => {
        card.onclick = () => {
            if (currentPlayerTurn !== "player") return;
            const playerCard = cardFromElement(card);
            card.remove();
            playArea.appendChild(playerCard.element);
            currentPlayerTurn = "bot";
            setTimeout(() => botPlay(playerCard), 700);
        };
    });
}

shuffleDeck();
dealHands();
setupCardClicks();
updateScores();
