// ==============================
// Global Variable Definitions
// ==============================

const suits = ['C', 'D', 'H', 'S']; // Clubs, Diamonds, Hearts, Spades
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let botHand = [];
let trumpCard = null;

let playerScore = 15;
let botScore = 15;

let isPlayerTurn = true;
let currentPhase = 'swap'; // phases: 'swap', 'play'
