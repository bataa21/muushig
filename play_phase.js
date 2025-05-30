// play_phase.js

function playerPlaysCard(index) {
  if (!isPlayerTurn || index < 0 || index >= playerHand.length) return;

  const playedCard = playerHand.splice(index, 1)[0];
  console.log(`Player plays: ${playedCard}`);

  const botResponse = botResponds(playedCard);
  resolveTrick(playedCard, botResponse);
}

function botResponds(leadCard) {
  // Bot looks for higher same-suit card or uses trump, else lowest card
  const leadSuit = leadCard.slice(-1);
  let choices = botHand.filter(c => c.slice(-1) === leadSuit && cardValue(c) > cardValue(leadCard));

  if (choices.length === 0) {
    choices = botHand.filter(c => trumpCard && c.slice(-1) === trumpCard.slice(-1));
  }

  const chosen = choices.length > 0 ? choices[0] : findLowestCard(botHand);
  botHand.splice(botHand.indexOf(chosen), 1);

  console.log(`Bot responds with: ${chosen}`);
  return chosen;
}

function resolveTrick(playerCard, botCard) {
  const playerWins = compareCards(playerCard, botCard);
  if (playerWins) {
    console.log("Player wins trick");
    botScore--;
  } else {
    console.log("Bot wins trick");
    playerScore--;
  }

  updateScores();
  displayPlayerHand();
  displayBotHand();

  isPlayerTurn = playerWins;
  checkForGameEnd();
}

function compareCards(cardA, cardB) {
  const suitA = cardA.slice(-1);
  const suitB = cardB.slice(-1);
  const rankA = cardValue(cardA);
  const rankB = cardValue(cardB);
  const trumpSuit = trumpCard ? trumpCard.slice(-1) : null;

  if (suitA === suitB) return rankA > rankB;
  if (suitA === trumpSuit && suitB !== trumpSuit) return true;
  if (suitB === trumpSuit && suitA !== trumpSuit) return false;
  return false;
}

function cardValue(card) {
  const rank = card.slice(0, -1);
  return ranks.indexOf(rank);
}

function findLowestCard(hand) {
  return hand.reduce((minCard, c) => cardValue(c) < cardValue(minCard) ? c : minCard);
}
