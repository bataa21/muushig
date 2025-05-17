// muushig_game.js

let playerScore = 15;
let botScore = 15;
let playerTricksWon = 0;
let botTricksWon = 0;
let trumpSuit = "H"; // default trump suit, update as needed
let currentPlayerTurn = "player";

const scoreDisplayPlayer = document.getElementById("score-player");
const scoreDisplayBot = document.getElementById("score-bot");
const playArea = document.getElementById("play-area");
const playerHandDiv = document.getElementById("player-hand");
const botHandDiv = document.getElementById("bot-hand");

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
    // TODO: Add new deal logic
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

function botPlay(playerCard) {
    const botCards = Array.from(botHandDiv.querySelectorAll(".card"));
    let chosen = botCards[0];
    for (let card of botCards) {
        if (!chosen || Math.random() > 0.5) chosen = card;
    }
    const botCard = cardFromElement(chosen);
    chosen.remove();
    playArea.appendChild(botCard.element);
    resolveTrick(playerCard, botCard);
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

setupCardClicks();
updateScores();
