console.log('Whoo whoo rock n roll!')
/*----- constants -----*/
const numOfCards = 5; // the number of cards on the board
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
// TO DO: check if i need all three
let holdCounter;
let playerHandArray; // eg [♠A, ..] used to evaluate game logic
let playerSuitArray; // eg [♠, ..] used to evaluate game logic
let playerRankArray; // eg [A, ..] used to evaluate game logic

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board
const statusEl = document.getElementById('gameStatus'); // the msg box
const bettingEl = document.getElementById('totalBet'); // betting total

/*----- event listeners -----*/
// TO DO: check all the functions here
document.getElementById('newGameButton').addEventListener('click', init); // New Game
document.getElementById('dealButton').addEventListener('click', deal); // 1st hand
document.getElementById('gameTable').addEventListener('click', hold); // hold cards
document.getElementById('drawButton').addEventListener('click', draw); // Final hand
document.getElementById('plusButton').addEventListener('click', addMoney); // Add
document.getElementById('minusButton').addEventListener('click', minusMoney); // Minus

/*----- functions -----*/
init();

/*----- Game flow -----*/
function varReset() { 
  statusEl.innerHTML = ''; // clears the msg box
  isWinningHand = false; // set the card back to 'in play'
  isGameFinished = false; // sets the game back to 'in play'
  handEvaluator = {}; // clears the winning logic counter
  playerHandArray = []; // clears the [♠A, ..] array that will be used for winning logic
  playerSuitArray = []; // clears the [♠, ..] array that will be used for winning logic
  playerRankArray = [];// clears the [A, ..] array that will be used for winning logic
}

function play() { // setting up the board and msg box
   // adds 5 'backs' of cards to the Games table
  for (let i=0; i < numOfCards; i++) {
    let newDiv = document.createElement('div'); // adds a <div> to hold the card 
    newDiv.classList.add('card', 'back', 'xlarge'); //the back of 5 cards 
    boardEl.appendChild(newDiv); // appends to Games Table
   } 
 }

/*-----Betting logic -----*/
function addMoney() {

}

function minusMoney() {
  
}

function deal() { // deals the player's first add
  boardEl.innerHTML = ''; // clears the divs in the board container
  varReset(); // clears msg box, counter/handEvaluator and playerHand arrays

  function rndCard() { // creates a single random card
    rndSuitIdx = Math.floor(Math.random() * suit.length);
    rndRankIdx = Math.floor(Math.random() * rank.length);
    const card = suit[rndSuitIdx] + rank[rndRankIdx]; // card string eg♠A
    return card;
  } 

  // adds 5 cards to the Games table
  for (let i=0; i < numOfCards; i++) {
     const playerCard = rndCard(); // randomly generated card
     let newDiv = document.createElement('div'); // creates a <div> to hold the card
     newDiv.classList.add('card', playerCard, 'xlarge'); // adds relevant classes to render card
     newDiv.id = i; // gives the card div a unique ID
     boardEl.appendChild(newDiv); // appends to Games Table
     playerHandArray.push(playerCard); // eg [♠A, ..] for winning logic
     playerSuitArray.push(suit[rndSuitIdx]); // eg [♠, ..] for winning logic
     playerRankArray.push(rank[rndRankIdx]); // eg [A, ..] for winning logic
   }

   console.log(playerHandArray);
 } 

 function hold(event) { 
  // creating the HOLD Header (holdEl)
  let holdEl = document.createElement('h6'); // creates a h6 
  holdEl.innerText = 'HOLD';
  event.target.appendChild(holdEl); // appends the 
  console.log(event);
  console.log(event.target);
  console.log(event.target.childNodes[0]); 
  
  holdCounter--;
 }

function draw() {// let's the player swop cards and then ends the game
  // varReset(); // clears msg box, counter/handEvaluator and playerHand arrays
  const cardEls = boardEl.querySelectorAll('.card'); // card divs
  // add something that replaces the non-hold card

  function rndCard() { // creates a single random card
    rndSuitIdx = Math.floor(Math.random() * suit.length);
    rndRankIdx = Math.floor(Math.random() * rank.length);
    const card = suit[rndSuitIdx] + rank[rndRankIdx]; // card string eg♠A
    return card;
  } 

  let playerCard; // randomly generated card

  // need to change i so that its just the number of left over cards
  // for (let i=0; i < holdCounter; i++) {  
  //   playerCard = rndCard(); 
  //   let newDiv = document.createElement('div'); // adds a <div> to hold the card
  //    newDiv.classList.add('card', playerCard, 'xlarge'); // adds relevant classes to render card
  //    boardEl.appendChild(newDiv); // appends to Games Table
  //    // TO DO: need to check this as some cards would be held
  //   //  playerHandArray.push(playerCard); // eg [♠A, ..] for winning logic
  //   //  playerSuitArray.push(suit[rndSuitIdx]); // eg [♠, ..] for winning logic
  //   //  playerRankArray.push(rank[rndRankIdx]); // eg [A, ..] for winning logic
  //  } 

   cardEls.forEach((card => { // looping through cardEls
    playerCard = rndCard(); 
    if (!card.children[0]) { // eg
      console.log(playerHandArray);
      console.log(playerCard);
      console.log(card.id); 
      playerHandArray.splice(card.id, 1, playerCard);// index of the cards that don't have hold
      card.className = `card ${playerCard} xlarge`;
    }
  }))

   getWinnerOutcome(playerRankArray); // its time to check if there was a winner
}

/*-----Did the player win logic -----*/
function getWinnerOutcome(arr) {  // counts rank/suit/rank&suit of a hand 
  handEvaluator = arr.reduce(function(acc,cur) { // the object counter
    acc[cur] = acc[cur] ? acc[cur] +1 : 1
    return acc 
  }, {})

  // matches the outcome of the counter to game logic eg handRanks object
  // game logic for matching 2/3/4 ranks
  for (let key in handEvaluator) { 
    if (handEvaluator[key] === handRanks["Two Pair"] || handEvaluator[key] === handRanks["Three of a Kind"] || handEvaluator[key] === handRanks["Four of a Kind"]) {
      isWinningHand = true;
      break;
    } 
  }

  isGameFinished = true;
  
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
  boardEl.innerHTML = ''; // clears the game table
  varReset(); // msg box, counter and playerHand arrays
  play(); // 5 upside cards
}

function init() { // responsible for initializing the state
  holdCounter = 5;
  render();
};