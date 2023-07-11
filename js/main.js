console.log('Whoo whoo rock n roll!')
/*----- constants -----*/
const suit = ['♠', '♣', '♦', '♥'];
const rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const handRanks = {
  "Jacks or Better": "A pair of Jacks, Queens, Kings, or Aces",
  "Two Pair": 2,
  "Three of a Kind": 3,
  "Straight": "5 - of the same suit",
  "Flush": "Five cards of the same suit, not in consecutive order",
  "Full House": "Three cards of one rank and two cards of another rank", 
  "Four of a Kind": 4,
  "Straight Flush": "Five consecutive cards of the same suit",
  "Royal Flush": "A, K, Q, J, 10 of the same suit",
};

/*----- app's state (variables) -----*/
let isWinningHand;
let isGameFinished;
let handEvaluator; // hand evaluator object that counts the player arr eg {A: 2}
let playerHandArray; // eg [♠A, ..] used to evaluate game logic
let playerSuitArray; // eg [♠, ..] used to evaluate game logic
let playerRankArray; // eg [A, ..] used to evaluate game logic

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board
const statusEl = document.getElementById('gameStatus'); // the msg box
const numOfCards = 5; // the number of cards on the board

/*----- event listeners -----*/
document.getElementById('newGameButton').addEventListener('click', init); // New Game
document.getElementById('dealButton').addEventListener('click', render); // New cards
document.getElementById('gameTable').addEventListener('click', init); // TO DO: check the function that goes here

/*----- functions -----*/
init();

/*----- Cards -----*/
function gameReset() { 
  isGameFinished = false; // game play status 
  boardEl.innerHTML = ''; // clears the board
  statusEl.innerHTML = ''; // clears the msg box
  handEvaluator = {}; // clears the winning logic counter
  playerHandArray = []; // clears the [♠A, ..] array that will be used for winning logic
  playerSuitArray = []; // clears the [♠, ..] array that will be used for winning logic
  playerRankArray = [];// clears the [A, ..] array that will be used for winning logic
}

function rndCard() { // creates a single random card
  const rndSuitIdx = Math.floor(Math.random() * suit.length);
  const rndRankIdx = Math.floor(Math.random() * rank.length);
  const card = suit[rndSuitIdx] + rank[rndRankIdx]; // card string eg♠A
  playerSuitArray.push(suit[rndSuitIdx]); // eg [♠, ..] for winning logic
  playerRankArray.push(rank[rndRankIdx]); // eg [A, ..] for winning logic
  return card;
} 

function deal() { // new cards into the Games Table
  // clears all the relevant Els
  gameReset(); // clears the board, msg box, counter and playerHand arrays
  console.log(statusEl);
  console.log(handEvaluator);
  console.log(playerHandArray);
  console.log(playerSuitArray);
  console.log(playerRankArray);
  // boardEl.innerHTML = '<h6 class="hide">HOLD</h6>'; //TO DO: how do i get the H6 back
   
  for (let i=0; i < numOfCards; i++) {
     const playerCard = rndCard(); // randomly generated card
     const newDiv = document.createElement('div'); // adds a <div> to hold the card
     newDiv.classList.add('card', playerCard, 'xlarge'); // adds relevant classes to render card
     boardEl.appendChild(newDiv); // appends to Games Table
     playerHandArray.push(playerCard); // eg [♠A, ..] for winning logic
   } 
 } 

/*----- The Game logic -----*/
function getWinnerOutcome(arr) {  // counts rank/suit/rank&suit of a hand 
  handEvaluator = arr.reduce(function(acc,cur) {
    acc[cur] = acc[cur] ? acc[cur] +1 : 1
    return acc 
  }, {})
  
  console.log(statusEl);
  console.log(handEvaluator);
  console.log(playerHandArray);
  console.log(playerSuitArray);
  console.log(playerRankArray);
  console.log("The above shows the relevant playerArray used for game logic - always 5 key/value pairs on new game & deal bts");

  for (let key in handEvaluator) { // game logic for matching 2/3/4 ranks
    if (handEvaluator[key] === `${handRanks["Two Pair"]}`|| handEvaluator[key] === `${handRanks["Three of a Kind"]}` || handEvaluator[key] === `${handRanks["Four of a Kind"]}`) {
      isWinningHand = true;
      isGameFinished = true;
      break;
    } 
  } 

  // only run this logic if the game finished
  if (isGameFinished) {
    if(isWinningHand === true) { // msg in the msg box based on outcome of game logic
      statusEl.innerHTML = "<h2>You win!</h2><h2>The type of win goes here</h2>";
    } else {
      statusEl.innerHTML = "<h2>Better luck next time!</h2>";
    }
  }
}

/*----- other -----*/
function render() {  // responsible for rendering all state to the dom
  deal();
  // getWinnerOutcome(playerHandArray); // return full object do i need this?
  // getWinnerOutcome(playerSuitArray); // object of just suits
  getWinnerOutcome(playerRankArray); // object of just rank
}

function init() { // responsible for initializing the state
  render();
};