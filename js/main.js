console.log('Figjam!')
/*----- constants -----*/
const numOfCards = 5; // the number of cards on the board
const suit = ['♠', '♣', '♦', '♥'];
const rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const handRanks = { // game logic / payoutodds / pa 
  "Jacks or Better": "A pair of Jacks, Queens, Kings, or Aces",
  "Two Pair": 2,
  "Three of a Kind": 3,
  "Straight": "5 - of the same suit",
  "Flush": "Five cards of the same suit, not in consecutive order",
  "Full House": "Three cards of one rank and two cards of another rank", 
  "Four of a Kind": 4,
  "Straight Flush": "Five consecutive cards of the same suit",
  "Straight Flush": "A, K, Q, J, 10 of the same suit",
};

/*----- app's state (variables) -----*/
let isWinningHand;
let isGameFinished;
let handEvaluator; // hand evaluator object that counts the player arr eg {A: 2}
// TO DO: check if i need all three
let holdCounter;
let moneyPot;
let betPot;
let playerHandArray; // eg [♠A, ..] used to evaluate game logic
let playerSuitArray; // eg [♠, ..] used to evaluate game logic
let playerRankArray; // eg [A, ..] used to evaluate game logic

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board
const statusEl = document.getElementById('gameStatus'); // the msg box
const coinEl = document.getElementById('creditTotal'); // player's available coin
const betEl = document.getElementById('totalBet');
const bettingEl = document.getElementById('totalBet'); // betting total

/*----- event listeners -----*/
// TO DO: check all the functions here
document.getElementById('newGameButton').addEventListener('click', play); // New Game
document.getElementById('resetButton').addEventListener('click', init); // New Player
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
  varReset();
  // ocapity for cards.....
  boardEl.innerHTML = ''; // clears the divs in the board container
   // adds 5 'backs' of cards to the Games table
  for (let i=0; i < numOfCards; i++) {
    let newDiv = document.createElement('div'); // adds a <div> to hold the card 
    newDiv.classList.add('card', 'back', 'xlarge'); // the back of 5 cards 
    boardEl.appendChild(newDiv); // appends to Games Table
   } 
 }

/*-----Betting logic -----*/
function whatIsMyBet(betTotal, myBet) {// moneyPot var
  coinEl.innerText = `You have ${betTotal} coins`;
  betEl.innerText = `${myBet} coin`;
}

function addMoney() {
  moneyPot--;
  betPot++;
  whatIsMyBet(moneyPot, betPot);
}

function minusMoney() {
  moneyPot++;
  betPot--;
  whatIsMyBet(moneyPot, betPot); 
}

function rndCard() { // creates a single random card
  rndSuitIdx = Math.floor(Math.random() * suit.length);
  rndRankIdx = Math.floor(Math.random() * rank.length);
  const card = suit[rndSuitIdx] + rank[rndRankIdx]; // card string eg♠A
  return card;
}

function deal() { // deals the player's first add
  // varReset(); // clears msg box, counter/handEvaluator and playerHand arrays
  const cardEls = boardEl.querySelectorAll('.card'); // card divs
  let playerCard; 

  console.log(cardEls);

  // adds 5 random cards / updates classes 
   cardEls.forEach((card => { // replacing the non-hold cards
    console.log(card);
    playerCard = rndCard();
    console.log(playerCard);
    card.className = `card ${playerCard} xlarge `;
    playerHandArray.push(playerCard); // eg [♠A, ..] for winning logic
    playerSuitArray.push(suit[rndSuitIdx]); // eg [♠, ..] for winning logic
    playerRankArray.push(rank[rndRankIdx]); // eg [A, ..] for winning logic
  }))

   console.log(playerHandArray);
 } 

 function hold(event) { // creating the HOLD Header (holdEl)
  let holdEl = document.createElement('h6'); // creates a h6
  event.target.appendChild(holdEl); // appends as a child to what card triggered i
  event.target.style.opacity = "0.5";
  // console.log(event);
  console.log(event.target);
  // console.log(event.target.childNodes[0]); 
  
  holdCounter--;
 }

function draw() {// let's the player swop cards and then ends the game
  const cardEls = boardEl.querySelectorAll('.card'); // card divs

  let playerCard; // variable that will be assigned randomly generated card

   cardEls.forEach((card => { // replacing the non-hold cards
    playerCard = rndCard(); 
    if (!card.children[0]) { // eg
      // console.log(playerHandArray);
      // console.log(playerCard);
      // console.log(card.id); 
      playerHandArray.splice(card.id, 1, playerCard);// populating playerHandArray with the non-hold cards
      card.className = `card ${playerCard} xlarge`;
    }
  }))

   getWinnerOutcome(playerRankArray, ); // its time to check if there was a winner
}

/*-----Did the player win logic -----*/
function getWinnerOutcome(arr) {  // counts rank/suit/rank&suit of a hand 
  handEvaluator = arr.reduce(function(acc,cur) { // the object counter
    acc[cur] = acc[cur] ? acc[cur] +1 : 1
    return acc 
  }, {})

  console.log(handEvaluator);

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
    if(isWinningHand) { // msg in the msg box based on outcome of game logic
      statusEl.innerHTML = "<h2>You win!</h2><h2>The type of win goes here</h2>";
    } else {
      statusEl.innerHTML = "<h2>Better luck next time!</h2>";
    }
  }
}

/*----- other -----*/
function render() {  // responsible for rendering all state to the dom
  boardEl.innerHTML = ''; // clears the game table
  play(); // 5 upside cards
}

function init() { // responsible for initializing the state
  holdCounter = 5;
  //where can I put this so it doesn't get reset every new game
  moneyPot = 100; // sets the initial credit total
  betPot = 0; // set the initial bet to 1
  varReset(); // msg box, counter and playerHand arrays // clean up divs in deal
  whatIsMyBet(moneyPot, betPot); 
  render();
};