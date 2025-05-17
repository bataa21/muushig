// muushig_game.js

let playerScore = 15;
let botScore = 15;
let playerTricksWon = 0;
let botTricksWon = 0;

const scoreDisplayPlayer = document.getElementById("score-player");
const scoreDisplayBot = document.getElementById("score-bot");
const playArea = document.getElementById("play-area");

function updateScores() {
    scoreDisplayPlayer.textContent = `Тоглогч: ${playerScore}`;
    scoreDisplayBot.textContent = `Бот: ${botScore}`;
}

function resolveTrick(playerCard, botCard, trumpSuit) {
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
    } else {
        playerScore--;
        botTricksWon++;
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
    // Add your reset/deal logic here
}

function disableGame() {
    // Disable all game interactions
    document.querySelectorAll(".card").forEach(card => card.onclick = null);
}
