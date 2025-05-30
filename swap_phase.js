// swap_phase.js

function performSwap(hand, isBot) {
  console.log(`${isBot ? "Bot" : "Player"} starts swapping...`);

  // Sort hand by value (low to high) – simple logic
  hand.sort((a, b) => cardValue(a) - cardValue(b));

  // Replace up to 2 low cards from the hand using remaining deck
  for (let i = 0; i < 2 && deck.length > 0; i++) {
    const drawnCard = deck.pop();
    const discardedCard = hand[i];
    hand[i] = drawnCard;

    console.log(`${isBot ? "Bot" : "Player"} swapped ${discardedCard} → ${drawnCard}`);
  }

  // If bot, take trumpCard too
  if (isBot && trumpCard) {
    let worst = findLowestCardIndex(hand);
    console.log(`Bot takes trump (${trumpCard}), discards ${hand[worst]}`);
    hand[worst] = trumpCard;
    trumpCard = null;
  }
}

function findLowestCardIndex(hand) {
  let minIndex = 0;
  let minValue = cardValue(hand[0]);
  for (let i = 1; i < hand.length; i++) {
    if (cardValue(hand[i]) < minValue) {
      minValue = cardValue(hand[i]);
      minIndex = i;
    }
  }
  return minIndex;
}

function cardValue(card) {
  const rank = card.slice(0, -1); // e.g., '10' from '10H'
  return ranks.indexOf(rank);
}
