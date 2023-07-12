console.log('Figjam!')
console.log('Fix - cards to 52, betting and unclicking')
/*----- constants -----*/
const numOfCards = 5; // the number of cards on the board
const suit = ['♠', '♣', '♦', '♥'];
const rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const handRanks = [ // this is now an array NOT OBJECT FIX GAME LOGIC
  {
    hand: "Jacks or Better",
    index: 0,  
    count: 2, // fix game logic extra condition to count 2
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 1,
  }, 
  {
    hand: "Two Pair", 
    index: 1, 
    count: 2, // Based on playerRankArray
    pOdds: 2,
    playerOdds: getPlayerOdds(),
    priority: 2,
  },
  {
    hand: "Three of a Kind",
    index: 2, 
    count: 3, // Based on playerRankArray
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 3,
  },
  {
    hand: "Straight",
    index: 3, 
    count: 5, // TO FIX "5 relates to suit
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 4,
  },
  {
    hand: "Flush",
    index: 4, 
    count: 5, // Based on playerSuitArray
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 5,
  },
  {
    hand: "Full House",
    index: 5, 
    count: 0, // "Three of one rank and two of another rank"
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 6,
  },   
  {
    hand: "Four of a Kind",
    index: 6, 
    count: 4, // Based on playerRankArray
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 7,
  },
  {
    hand: "Straight Flush",
    index: 7, 
    count: 5, // "Five consecutive cards of the same suit"
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 8,
  },
  {
    hand: "Royal Flush",
    index: 8,
    count: 5, // "A, K, Q, J, 10 of the same suit"
    pOdds: 1,
    playerOdds: getPlayerOdds(),
    priority: 9,
  },           
];

/*----- app's state (variables) -----*/
let isWinningHand;
let isGameFinished;
let modplayerHandArray; // hand evaluator object that counts the player arr eg {A: 2}
let modplayerSuitArray;
let modplayerRankArray;
// TO DO: check if i need all three
let holdCounter; // count the number of cards that are held
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
document.getElementById('resetButton').addEventListener('click', init); // New Player
document.getElementById('newGameButton').addEventListener('click', play); // New Game
document.getElementById('dealButton').addEventListener('click', deal); // 1st hand
document.getElementById('gameTable').addEventListener('click', hold); // hold cards
document.getElementById('drawButton').addEventListener('click', draw); // Final hand
document.getElementById('plusButton').addEventListener('click', addMoney); // Add
document.getElementById('minusButton').addEventListener('click', minusMoney); // Minus

/*----- functions -----*/
init();

/*----- Game flow -----*/
function play() { // resetting els except moneyPot & betPot
  boardEl.innerHTML = ''; // clears the game table
  statusEl.innerHTML = ''; // clears the msg box
  isWinningHand = false; // set the card back to 'in play'
  isGameFinished = false; // sets the game back to 'in play'
  handEvaluator = {}; // clears the winning logic counter
  playerHandArray = []; // clears the [♠A, ..] array that will be used for winning logic
  playerSuitArray = []; // clears the [♠, ..] array that will be used for winning logic
  playerRankArray = [];// clears the [A, ..] array that will be used for winning logic  whatIsMyBet(moneyPot, betPot); 
   // adds 5 'backs' of cards to the Games table
  for (let i=0; i < numOfCards; i++) {
    let newDiv = document.createElement('div'); // adds a <div> to hold the card 
    newDiv.classList.add('card', 'back', 'xlarge'); // the back of 5 cards 
    boardEl.appendChild(newDiv); // appends to Games Table
    newDiv.id = i;
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

function getPlayerOdds() {

}

/*-----cards -----*/
function rndCard() { // creates a single random card
  rndSuitIdx = Math.floor(Math.random() * suit.length);
  rndRankIdx = Math.floor(Math.random() * rank.length);
  const card = suit[rndSuitIdx] + rank[rndRankIdx]; // card string eg♠A
  return card;
}

function deal() { // deals the player's first add
  const cardEls = boardEl.querySelectorAll('.card'); // card divs
  let playerCard; 

  // adds 5 random cards / updates classes 
  cardEls.forEach((card => { // replacing the non-hold cards
    playerCard = rndCard();
    card.className = `card ${playerCard} xlarge `;
    playerHandArray.push(playerCard); // eg [♠A, ..] for winning logic
  }))
 } 

 function hold(event) { // creating the HOLD Header (holdEl)
  let holdEl = document.createElement('h6'); // creates a h6
  event.target.appendChild(holdEl); // appends as a child to what card triggered i
  event.target.style.opacity = "0.5";
  // console.log(event);
  // console.log(event.target);
  // console.log(event.target.childNodes[0]); 
  
  holdCounter--;
 }

function draw() {// let's the player swop cards and then ends the game
  const cardEls = boardEl.querySelectorAll('.card'); // card divs

  let playerCard; // variable that will be assigned randomly generated card

   cardEls.forEach((card => { // replacing the non-hold cards
    playerCard = rndCard(); 
    if (!card.children[0]) { // eg
      playerHandArray.splice(card.id, 1, playerCard); // repopulating playerHandArray
      card.className = `card ${playerCard} xlarge`;
      // console.log(playerCard);
      // console.log(card.id); 
     ;
    }
  }))

  // console.log("inside draw()");
  // console.log(playerHandArray);

  getWinnerOutcome(playerHandArray); // its time to check if there was a winner
}

/*-----Did the player win logic -----*/
function getWinnerOutcome(arr) { // Count of the suit
  modplayerHandArray = arr.reduce(function(acc, curr) { // creates the object counter
    let currSuit = curr.split("")[0]; 
    acc[currSuit] = acc[currSuit] ? acc[currSuit] +1 : 1
    return acc
  }, {})

  console.log(modplayerHandArray);

  // Count of Rank
  let countedCards = arr.reduce(function (acc, curr) {
	const myDict = { J: 11, Q: 12, K: 13, A: 14 }; 
  // Giving these numerical values / other cards rep by two digits eg 08, 09, 10
	let currCardValue = curr.split("").slice(1).join(""); // ranks
	if (Number(currCardValue)) { 
		acc[currCardValue] = acc[currCardValue] ? acc[currCardValue] + 1 : 1;
	} else {
		currCardValue = myDict[currCardValue]; // if false eg !NAN than look at myDict to turn into NAN
		acc[currCardValue] = acc[currCardValue] ? acc[currCardValue] + 1 : 1;
	}
  return acc;
  }, {});

  console.log(countedCards);

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
  play(); // 5 upside cards
}

function init() { // responsible for initializing the state
  holdCounter = 5;
  //where can I put this so it doesn't get reset every new game
  moneyPot = 100; // sets the initial credit total
  betPot = 0; // set the initial bet count to 0
  whatIsMyBet(moneyPot, betPot);
  boardEl.innerHTML = ''; // clears the game table
  statusEl.innerHTML = ''; // clears the msg box
  isWinningHand = false; // set the card back to 'in play'
  isGameFinished = false; // sets the game back to 'in play'
  handEvaluator = {}; // clears the winning logic counter
  playerHandArray = []; // clears the [♠A, ..] array that will be used for winning logic
  playerSuitArray = []; // clears the [♠, ..] array that will be used for winning logic
  playerRankArray = [];// clears the [A, ..] array that will be used for winning logic  whatIsMyBet(moneyPot, betPot); 
  render();
};