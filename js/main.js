console.log('Fix - cards to 52, fix init, switch between deal/draw betting, unclicking, add wiiingint pot to creditotal')
/*----- constants -----*/
const numOfCards = 5; // the number of cards on the board
const suit = ['♠', '♣', '♦', '♥'];
const rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const handRanks = [ // this is now an array NOT OBJECT FIX GAME
  {
    hand: "PAYOUT TABLE", 
    count: 0,
    pOdds: " xBET",
    priority: 0,
  },  
  {
    hand: "Royal Flush",
    count: 5, // "A, K, Q, J, 10 of the same suit"
    pOdds: 250,
    priority: 9,
  },
  {
    hand: "Straight Flush",
    count: 5, // "Five consecutive cards of the same suit"
    pOdds: 50,
    priority: 8,
  },
  {
    hand: "Four of a Kind",
    count: 4, // Based on playerRankArray
    pOdds: 40,
    priority: 7,
  },
  {
    hand: "Full House",
    count: 0, // "Three of one rank and two of another rank"
    pOdds: 10,
    priority: 6,
  },
  {
    hand: "Flush",
    count: 5, // Based on playerSuitArray
    pOdds: 7,
    priority: 5,
  },
  {
    hand: "Straight",
    count: 5, // TO FIX "5 relates to suit
    pOdds: 5,
    priority: 4,
  },
  {
    hand: "Three of a Kind",
    count: 3, // Based on playerRankArray
    pOdds: 3,
    priority: 3,
  },
  {
    hand: "Two Pair", 
    count: 2, // Based on playerRankArray
    pOdds: 2,
    priority: 2,
  },
  {
    hand: "Jacks or Better",  
    count: 2, // Based on playerRankArray
    pOdds: 1,
    priority: 1,
  },
];

/*----- app's state (variables) -----*/
let isWinningHand;
let isGameFinished;

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
const payoutEls = document.getElementById('payoutOdds'); // the msg box
const payoutPlayerEls = document.getElementById('payoutPlayer'); // the msg box
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

  // function getOdds() {
    let newList = document.createElement('ul'); // creates a <ul> element
    newList.id = 'pOddsHands'; // sets the ID of the <ul> element
    payoutEls.appendChild(newList); // appends the <ul> element to the 'payoutEls' element
    
    for (let i = 0; i < 9; i++) {
      let newListEls = document.createElement('li'); // creates a <li> element
      newListEls.id = i; // sets the ID of the <li> element
      // need to sort the other way
      newListEls.innerText = handRanks[i].hand + " " + handRanks[i].pOdds;
      newList.appendChild(newListEls); // appends the <li> element to the <ul> element
    }
  
    let newListPlayer = document.createElement('ul'); // creates a <ul> element
    newListPlayer.id = 'playerOddsHands'; // sets the ID of the <ul> element
    payoutPlayerEls.appendChild(newListPlayer); // appends the <ul> element to the 'payoutPlayerEls' element
    
    for (let i = 0; i < 9; i++) {
      let newListPlayerEls = document.createElement('li'); // creates a <li> element
      newListPlayerEls.id = i; // sets the ID of the <li> element
      // need to sort the other way
      newListPlayerEls.innerText = (handRanks[i].pOdds * betPot);
      newListPlayer.appendChild(newListPlayerEls); // appends the <li> element to the <ul> element
    }
  }

// }

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
function getWinnerOutcome(arr) { 
  
  // Count of the suit
  playerSuitArray = arr.reduce(function(acc, curr) { // creates the object counter
    let currSuit = curr.split("")[0]; 
    acc[currSuit] = acc[currSuit] ? acc[currSuit] +1 : 1
    return acc
  }, {})

  console.log(playerSuitArray);

  // Count of Rank
  let playerRankArray = arr.reduce(function (acc, curr) {
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

  console.log(playerRankArray);

  // matches the outcome of the counter to game logic eg handRanks object
  // HOW DO I MAKE THEM WAIT BEFORE PROCEEDING

  
  // game logic for matching 5 suits
  for (let key in playerSuitArray) { 
    if (playerSuitArray[key] === handRanks[5].count) {
      isWinningHand = true;
      break;
    } 
  }
  // game logic for matching 2/3/5 ranks
  for (let key in playerRankArray) { 
    if (playerRankArray[key] === handRanks[3].count ||
      playerRankArray[key] === handRanks[7].count ||
      playerRankArray[key] === handRanks[8].count) {
        isWinningHand = true;
        break;
    } 
  }

  // Check for "Jacks or Better" win
  for (let key in playerRankArray) {
    if ((playerRankArray[11] >= handRanks[9].count) ||
        (playerRankArray[12] >= handRanks[9].count) ||
        (playerRankArray[13] >= handRanks[9].count) ||
        (playerRankArray[14] >= handRanks[9].count)) {
          isWinningHand = true;
          break;
    }
  }
  
  isGameFinished = true;
  
  if (isGameFinished) {
    if(isWinningHand) { // msg in the msg box based on outcome of game logic
      statusEl.innerHTML = "<h2>You win!</h2><h2>The type of win goes here</h2>";
      moneyPot += handRanks[9].pOdds; // how do i get it dynamically?
      console.log(moneyPot);
    } else {
      statusEl.innerHTML = "<h2>Better luck next time!</h2>";
    }
  }
}

/*----- other -----*/
init();

function render() {  // responsible for rendering all state to the dom
  play(); // 5 upside cards
}

function init() { // responsible for initializing the state
  holdCounter = 5;
  //where can I put this so it doesn't get reset every new game
  moneyPot = 100; // sets the initial credit total
  betPot = 0; // set the initial bet count to 0
  whatIsMyBet(moneyPot, betPot);
  payoutEls.innerHTML = ''; // clear the payOut table
  payoutPlayerEls.innerHTML = ''; // clears the game table
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