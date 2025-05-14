
function renderPlayView() {
    const playerArea = document.getElementById("player-hand");
    const botArea = document.getElementById("bot-hand");
    const trumpImg = document.getElementById("trump-card");
    const deckImg = document.getElementById("deck-card");

    playerArea.innerHTML = '';
    botArea.innerHTML = '';

    for (let i = 0; i < playerHand.length; i++) {
        const card = playerHand[i];
        const img = document.createElement("img");
        img.src = `cards/${card}.png`;
        img.className = "card";
        img.onclick = () => playCard(i);
        playerArea.appendChild(img);
    }

    for (let i = 0; i < botHand.length; i++) {
        const img = document.createElement("img");
        img.src = "cards/card-back.png";
        img.className = "card";
        botArea.appendChild(img);
    }

    trumpImg.src = `cards/${trumpCard}.png`;
    deckImg.src = "cards/card-back.png";
}

function playCard(index) {
    const playedCard = playerHand[index];
    playerHand.splice(index, 1);
    renderPlayView();
    setTimeout(() => botRespond(playedCard), 500);
}

function botRespond(playerCard) {
    const playerSuit = playerCard.slice(-1);
    const trumpSuit = trumpCard.slice(-1);
    let sameSuit = botHand.filter(c => c.endsWith(playerSuit));
    let trumpCards = botHand.filter(c => c.endsWith(trumpSuit));
    let chosenCard = null;

    if (sameSuit.length > 0) {
        sameSuit.sort((a, b) => cardValue(b) - cardValue(a));
        let stronger = sameSuit.find(c => cardValue(c) > cardValue(playerCard));
        chosenCard = stronger || sameSuit[sameSuit.length - 1];
    } else if (trumpCards.length > 0) {
        trumpCards.sort((a, b) => cardValue(b) - cardValue(a));
        chosenCard = trumpCards[0];
    } else {
        botHand.sort((a, b) => cardValue(a) - cardValue(b));
        chosenCard = botHand[0];
    }

    const botIndex = botHand.indexOf(chosenCard);
    botHand.splice(botIndex, 1);
    alert(`Та: ${playerCard}  | Бот: ${chosenCard}`);
    renderPlayView();
}

renderPlayView();
