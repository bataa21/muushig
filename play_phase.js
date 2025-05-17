// === Muushig 2-Player Round Logic ===

let playerHand = [];
let botHand = [];
let trumpCard = null;
let trumpSuit = "";
let currentTurn = "player";
let playerScore = 0;
let botScore = 0;
let roundNumber = 1;

// Suits: S, H, D, C (Spades, Hearts, Diamonds, Clubs)
function getSuit(card) {
    return card.slice(-5, -4); // "10H.png" => "H"
}

function getValue(card) {
    const rank = card.replace(".png", "").slice(0, -1);
    const order = ["7", "8", "9", "10", "J", "Q", "K", "A"];
    return order.indexOf(rank);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)];
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dealCards() {
    const suits = ["S", "H", "D", "C"];
    const ranks = ["7", "8", "9", "10", "J", "Q", "K", "A"];
    const deck = shuffle(suits.flatMap(suit => ranks.map(rank => rank + suit + ".png")));

    playerHand = deck.splice(0, 5);
    botHand = deck.splice(0, 5);
    trumpCard = deck.splice(0, 1)[0];
    trumpSuit = getSuit(trumpCard);

    updateHandDisplay();
    updateTrumpDisplay();
    currentTurn = "player";
}

function updateHandDisplay() {
    const playerArea = document.getElementById("player-hand");
    const botArea = document.getElementById("bot-hand");
    playerArea.innerHTML = "";
    botArea.innerHTML = "";

    playerHand.forEach(card => {
        const img = document.createElement("img");
        img.src = "cards/" + card;
        img.className = "card";
        img.onclick = () => playCard(card);
        playerArea.appendChild(img);
    });

    botHand.forEach(() => {
        const back = document.createElement("img");
        back.src = "cards/card-back.png";
        back.className = "card";
        botArea.appendChild(back);
    });
}

function updateTrumpDisplay() {
    const trumpArea = document.getElementById("trump-area");
    trumpArea.innerHTML = "";
    const back = document.createElement("img");
    back.src = "cards/card-back.png";
    back.className = "card";
    const face = document.createElement("img");
    face.src = "cards/" + trumpCard;
    face.className = "card";
    trumpArea.appendChild(back);
    trumpArea.appendChild(face);
}

function playCard(playerCard) {
    if (currentTurn !== "player") return;

    const index = playerHand.indexOf(playerCard);
    if (index > -1) playerHand.splice(index, 1);

    const botCard = chooseBotCard(playerCard);
    const botCardIndex = botHand.indexOf(botCard);
    if (botCardIndex > -1) botHand.splice(botCardIndex, 1);

    showPlay(playerCard, botCard);
    checkWinner(playerCard, botCard);
}

function chooseBotCard(playerCard) {
    const suit = getSuit(playerCard);
    const value = getValue(playerCard);

    let candidates = botHand.filter(c => getSuit(c) === suit && getValue(c) > value);
    if (candidates.length === 0) {
        candidates = botHand.filter(c => getSuit(c) === trumpSuit);
    }
    return candidates.length > 0 ? candidates[0] : botHand[0];
}

function showPlay(playerCard, botCard) {
    const playArea = document.getElementById("play-area");
    playArea.innerHTML = "";

    const pCard = document.createElement("img");
    pCard.src = "cards/" + playerCard;
    pCard.className = "card";

    const bCard = document.createElement("img");
    bCard.src = "cards/" + botCard;
    bCard.className = "card";

    playArea.appendChild(pCard);
    playArea.appendChild(bCard);
}

function checkWinner(pCard, bCard) {
    const pSuit = getSuit(pCard);
    const bSuit = getSuit(bCard);
    const pVal = getValue(pCard);
    const bVal = getValue(bCard);

    let winner = "player";

    if (pSuit === bSuit) {
        if (pVal < bVal) winner = "bot";
    } else if (bSuit === trumpSuit) {
        winner = "bot";
    }

    if (winner === "player") {
        alert("Тоглогч хожлоо!");
    } else {
        alert("Бот хожлоо!");
    }

    setTimeout(() => {
        if (playerHand.length === 0) {
            updateScore(winner);
        } else {
            updateHandDisplay();
        }
    }, 1000);
}

function updateScore(winner) {
    if (winner === "player") playerScore++;
    else botScore++;

    document.getElementById("score").textContent = 
        `Тоглогч: ${playerScore} | Бот: ${botScore}`;
    document.getElementById("next-round").style.display = "block";
}

function nextRound() {
    roundNumber++;
    dealCards();
    document.getElementById("next-round").style.display = "none";
}

window.onload = () => {
    dealCards();
    document.getElementById("next-round").onclick = nextRound;
};