let playerHand = [];
let botHand = [];
let trumpCard = null;
let trumpSuit = "";
let playerScore = 15;
let botScore = 15;
let playCount = 0;

function getSuit(card) {
    return card.slice(-5, -4); // e.g., "10H.png" => "H"
}

function getValue(card) {
    const rank = card.replace(".png", "").slice(0, -1);
    return {"7":1,"8":2,"9":3,"10":4,"J":5,"Q":6,"K":7,"A":8}[rank];
}

function shuffleDeck() {
    const suits = ["S", "H", "D", "C"];
    const ranks = ["7", "8", "9", "10", "J", "Q", "K", "A"];
    const deck = suits.flatMap(suit => ranks.map(rank => rank + suit + ".png"));
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function dealNewRound() {
    const deck = shuffleDeck();
    playerHand = deck.splice(0, 5);
    botHand = deck.splice(0, 5);
    trumpCard = deck.pop();
    trumpSuit = getSuit(trumpCard);
    playCount = 0;
    renderHands();
    updateTrump();
    updateScores();
}

function renderHands() {
    const p = document.getElementById("player-hand");
    const b = document.getElementById("bot-hand");
    p.innerHTML = "";
    b.innerHTML = "";
    playerHand.forEach(card => {
        const img = document.createElement("img");
        img.src = "cards/" + card;
        img.className = "card";
        img.onclick = () => playTurn(card);
        p.appendChild(img);
    });
    botHand.forEach(() => {
        const img = document.createElement("img");
        img.src = "cards/card-back.png";
        img.className = "card";
        b.appendChild(img);
    });
}

function updateTrump() {
    document.getElementById("trump-card").src = "cards/" + trumpCard;
}

function updateScores() {
    document.getElementById("player-score").innerText = "Тоглогч: " + playerScore;
    document.getElementById("bot-score").innerText = "Бот: " + botScore;
}

function playTurn(playerCard) {
    const i = playerHand.indexOf(playerCard);
    if (i > -1) playerHand.splice(i, 1);

    const botCard = selectBotCard(playerCard);
    const bi = botHand.indexOf(botCard);
    if (bi > -1) botHand.splice(bi, 1);

    showTrick(playerCard, botCard);
    calculateTrickResult(playerCard, botCard);
}

function selectBotCard(playerCard) {
    const suit = getSuit(playerCard);
    const value = getValue(playerCard);
    let candidates = botHand.filter(c => getSuit(c) === suit && getValue(c) > value);
    if (candidates.length === 0) {
        candidates = botHand.filter(c => getSuit(c) === trumpSuit);
    }
    return candidates.length > 0 ? candidates[0] : botHand[0];
}

function showTrick(pCard, bCard) {
    const area = document.getElementById("play-area");
    area.innerHTML = "";
    const p = document.createElement("img");
    p.src = "cards/" + pCard;
    p.className = "card";
    const b = document.createElement("img");
    b.src = "cards/" + bCard;
    b.className = "card";
    area.appendChild(p);
    area.appendChild(b);
}

function calculateTrickResult(pCard, bCard) {
    const ps = getSuit(pCard);
    const bs = getSuit(bCard);
    const pv = getValue(pCard);
    const bv = getValue(bCard);

    let winner = "player";
    if (ps === bs && bv > pv) winner = "bot";
    else if (bs !== ps && bs === trumpSuit) winner = "bot";

    if (winner === "player") botScore--;
    else playerScore--;

    updateScores();
    playCount++;

    setTimeout(() => {
        if (playCount >= 5) {
            if (playerScore <= 0) alert("Бот тоглоомыг хожлоо!");
            else if (botScore <= 0) alert("Тоглогч тоглоомыг хожлоо!");
            else dealNewRound();
        } else {
            renderHands();
        }
    }, 1000);
}

window.onload = () => {
    dealNewRound();
};