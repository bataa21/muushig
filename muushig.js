
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];

for (let suit of suits) {
  for (let rank of ranks) {
    deck.push(suit + rank);
  }
}

deck.sort(() => Math.random() - 0.5);

const dealerIsBot = Math.random() < 0.5;
const botHand = [];
const playerHand = [];
let botScore = 0;
let playerScore = 0;
const trumpCard = deck[10];

document.addEventListener("DOMContentLoaded", () => {
  const shuffleSound = document.getElementById("shuffleSound");
  shuffleSound.play();

  const botHandDiv = document.querySelector(".bot-hand");
  const playerHandDiv = document.querySelector(".player-hand");
  const trumpDiv = document.getElementById("trump-card");
  const botLabel = document.getElementById("player-top");
  const playerLabel = document.getElementById("player-bottom");
  const flyingCard = document.getElementById("flying-card");
  const deckDiv = document.getElementById("deck");
  const deckRect = deckDiv.getBoundingClientRect();
  const tableRect = document.getElementById("table").getBoundingClientRect();

  if (dealerIsBot) {
    botLabel.innerHTML = "Bot (Dealer) (<span id='bot-score'>0</span>)";
    playerLabel.innerHTML = "You (<span id='player-score'>0</span>)";
  } else {
    botLabel.innerHTML = "Bot (<span id='bot-score'>0</span>)";
    playerLabel.innerHTML = "You (Dealer) (<span id='player-score'>0</span>)";
  }

  trumpDiv.innerText = trumpCard;

  let dealIndex = 0;
  function flyTo(targetElement, callback) {
    const targetRect = targetElement.getBoundingClientRect();
    const offsetX = targetRect.left - tableRect.left;
    const offsetY = targetRect.top - tableRect.top;

    flyingCard.style.left = (deckRect.left - tableRect.left) + "px";
    flyingCard.style.top = (deckRect.top - tableRect.top) + "px";
    flyingCard.style.opacity = 1;
    void flyingCard.offsetWidth;

    flyingCard.style.left = offsetX + "px";
    flyingCard.style.top = offsetY + "px";

    setTimeout(() => {
      flyingCard.style.opacity = 0;
      callback();
    }, 500);
  }

  function dealNextCard() {
    if (dealIndex >= 5) {
      setTimeout(() => {
        dealerTakesTrump();
      }, 800);
      return;
    }

    const playerCard = dealerIsBot ? deck[dealIndex + 5] : deck[dealIndex];
    const botCard = dealerIsBot ? deck[dealIndex] : deck[dealIndex + 5];

    flyTo(botHandDiv, () => {
      botHand.push(botCard);
      botHandDiv.innerHTML = botHand.map(() => '🂠').join(' ');
      setTimeout(() => {
        flyTo(playerHandDiv, () => {
          playerHand.push(playerCard);
          playerHandDiv.innerHTML = playerHand.map(c => `<span>${c}</span>`).join(' ');
          dealIndex++;
          setTimeout(dealNextCard, 400);
        });
      }, 300);
    });
  }

  setTimeout(dealNextCard, 800);
});

function dealerTakesTrump() {
  const hand = dealerIsBot ? botHand : playerHand;
  hand.push(trumpCard);
  hand.sort((a, b) => ranks.indexOf(a.slice(1)) - ranks.indexOf(b.slice(1)));
  hand.shift();

  if (dealerIsBot) {
    document.querySelector(".bot-hand").innerHTML = botHand.map(() => '🂠').join(' ');
  } else {
    document.querySelector(".player-hand").innerHTML = playerHand.map(c => `<span>${c}</span>`).join(' ');
  }

  setTimeout(() => {
    startFirstRound();
  }, 1000);
}

function startFirstRound() {
  const playPlayer = document.getElementById("played-by-player");
  const playBot = document.getElementById("played-by-bot");
  const starterIsBot = !dealerIsBot;

  if (starterIsBot) {
    botHand.sort((a, b) => ranks.indexOf(a.slice(1)) - ranks.indexOf(b.slice(1)));
    const playedCard = botHand.shift();
    playBot.innerText = playedCard;

    const leadSuit = playedCard[0];
    let valid = playerHand.filter(c => c[0] === leadSuit && ranks.indexOf(c.slice(1)) > ranks.indexOf(playedCard.slice(1)));
    if (valid.length === 0) valid = playerHand.filter(c => c[0] === trumpCard[0]);
    if (valid.length === 0) valid = [...playerHand];

    const responseCard = valid[0];
    playerHand.splice(playerHand.indexOf(responseCard), 1);
    playPlayer.innerText = responseCard;
    document.querySelector(".player-hand").innerHTML = playerHand.map(c => `<span>${c}</span>`).join(' ');

    compareAndScore(responseCard, playedCard);
    setTimeout(() => {
      if (playerHand.length === 0 || botHand.length === 0) declareWinner();
      else startFirstRound();
    }, 1200);

  } else {
    playPlayer.innerText = "Play a card...";
    const cards = document.querySelectorAll(".player-hand span");
    cards.forEach(card => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        const chosen = card.innerText;
        playPlayer.innerText = chosen;
        playerHand.splice(playerHand.indexOf(chosen), 1);
        cards.forEach(c => c.replaceWith(c.cloneNode(true)));
        botResponds(chosen);
      });
    });
  }
}

function botResponds(leadCard) {
  const playBot = document.getElementById("played-by-bot");
  const leadSuit = leadCard[0];

  botHand.sort((a, b) => ranks.indexOf(a.slice(1)) - ranks.indexOf(b.slice(1)));
  let valid = botHand.filter(c => c[0] === leadSuit && ranks.indexOf(c.slice(1)) > ranks.indexOf(leadCard.slice(1)));
  if (valid.length === 0) valid = botHand.filter(c => c[0] === trumpCard[0]);
  if (valid.length === 0) valid = [...botHand];

  const responseCard = valid[0];
  botHand.splice(botHand.indexOf(responseCard), 1);
  playBot.innerText = responseCard;
  document.querySelector(".bot-hand").innerHTML = botHand.map(() => '🂠').join(' ');

  compareAndScore(leadCard, responseCard);
  setTimeout(() => {
    if (playerHand.length === 0 || botHand.length === 0) declareWinner();
    else startFirstRound();
  }, 1200);
}

function compareAndScore(playerCard, botCard) {
  const leadSuit = playerCard ? playerCard[0] : botCard[0];
  const trumpSuit = trumpCard[0];
  function cardValue(card) {
    if (card[0] === trumpSuit) return 100 + ranks.indexOf(card.slice(1));
    if (card[0] === leadSuit) return 50 + ranks.indexOf(card.slice(1));
    return ranks.indexOf(card.slice(1));
  }
  const playerVal = cardValue(playerCard);
  const botVal = cardValue(botCard);
  if (playerVal > botVal) playerScore++;
  else botScore++;
  document.getElementById("player-score").innerText = playerScore;
  document.getElementById("bot-score").innerText = botScore;
}

function declareWinner() {
  const playPlayer = document.getElementById("played-by-player");
  const playBot = document.getElementById("played-by-bot");
  let result = "";
  if (playerScore > botScore) result = "You win!";
  else if (playerScore < botScore) result = "Bot wins!";
  else result = "It's a tie!";
  playPlayer.innerText = "";
  playBot.innerText = "";
  const resultBox = document.createElement("div");
  resultBox.innerText = result;
  resultBox.style.fontSize = "28px";
  resultBox.style.color = "white";
  resultBox.style.backgroundColor = "black";
  resultBox.style.padding = "12px";
  resultBox.style.borderRadius = "12px";
  resultBox.style.textAlign = "center";
  resultBox.style.marginTop = "20px";
  const newGameBtn = document.createElement("button");
  newGameBtn.innerText = "New Game";
  newGameBtn.style.marginTop = "10px";
  newGameBtn.style.padding = "10px 20px";
  newGameBtn.style.fontSize = "18px";
  newGameBtn.style.borderRadius = "8px";
  newGameBtn.style.cursor = "pointer";
  newGameBtn.onclick = () => location.reload();
  const center = document.getElementById("center-area");
  center.appendChild(resultBox);
  center.appendChild(newGameBtn);
}
