console.log('Welcome to Video Poker')
console.log('Areas of improvement')
console.log('Intro some guards, fix unhold and some additional game logic')

/*----- constants -----*/
const numOfCards = 5; // the number of cards on the board
const suit = ['♠', '♣', '♦', '♥'];
const rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const handRanks = [ 
  {
    hand: "Royal Flush",
    count: 5, // A, K, Q, J, 10 of the same suit
    pOdds: 250,
  },
  {
    hand: "Straight Flush",
    count: 5, // Five consecutive cards of the same suit
    pOdds: 50,
  },
  {
    hand: "Four of a Kind",
    count: 4, // Four cards of the same rank
    pOdds: 40,
  },
  {
    hand: "Full House",
    count: 0, // Three of one rank and two of another rank
    pOdds: 10,
  },
  {
    hand: "Flush",
    count: 5, // Five cards of the same suit, not in consecutive order
    pOdds: 7,
  },
  {
    hand: "Straight",
    count: 5, // Five consecutive cards of mixed suits
    pOdds: 5,
  },
  {
    hand: "Three of a Kind",
    count: 3, // Three cards of the same rank
    pOdds: 3,
  },
  {
    hand: "Two Pair", 
    count: 2, // Two sets of two cards of the same rank
    pOdds: 2,
  },
  {
    hand: "Jacks or Better",  
    count: 2, // A pair of Jacks, Queens, Kings, or Aces
    pOdds: 1,
  },
];

/*----- app's state (variables) -----*/
let deck;
let isGameFinished;
let isFirstDealClick;
let clickCount;
let winningCoins;
let moneyPot;
let betPot;
let playerHandArray; // eg [♠A, ..] used to evaluate game logic
let playerSuitObject; // eg {♠: 1, ..} used to evaluate game logic
let playerRankObject; // eg {A: 2, ..} used to evaluate game logic

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board
const statusEl = document.getElementById('gameStatus'); // the msg box
const payoutEls = document.getElementById('payoutOdds'); // the payout table
const payoutPlayerEls = document.getElementById('payoutPlayer'); // the player's payout table
const coinEl = document.getElementById('creditTotal'); // player's available coin
const betEl = document.getElementById('totalBet');// betting total
const dealBtn = document.getElementById('dealButton');

/*----- event listeners -----*/
// TO DO: check all the functions here
document.getElementById('resetButton').addEventListener('click', init); // New Player
document.getElementById('newGameButton').addEventListener('click', play); // New Game
document.getElementById('dealButton').addEventListener('click', deal);
document.getElementById('gameTable').addEventListener('click', hold); // hold cards
document.getElementById('plusButton').addEventListener('click', addMoney); // Add
document.getElementById('minusButton').addEventListener('click', minusMoney); // Minus

/*----- functions -----*/
/*----- Payout table set up -----*/
function getOdds() { 
  newList = document.createElement('ul'); // creates the Payout table
  newList.id = 'pOddsHands'; 
  payoutEls.appendChild(newList); 
  
  for (let i = 0; i < 9; i++) {
    newListEls = document.createElement('li'); // creates the odds
    newListEls.id = i; 
    newListEls.innerText = handRanks[i].hand + " " + handRanks[i].pOdds;
    newList.appendChild(newListEls); 
  }
 
  newListPlayer = document.createElement('ul'); // creates the Player's Payout table
  newListPlayer.id = 'playerOddsHands';
  payoutPlayerEls.appendChild(newListPlayer); 
  
  for (let i = 0; i < 9; i++) {
    newListPlayerEls = document.createElement('li'); // updates player's specific odds
    newListPlayerEls.id = i; 
    newListPlayerEls.innerText = (handRanks[i].pOdds * betPot);
    newListPlayer.appendChild(newListPlayerEls); 
  }
}


/*----- Wager render eg coins and updates odds on player payout table -----*/
function whatIsMyBet(betTotal, myBet) { // updates the total coins, the bet total and the player payout table
  updateOdds();
  coinEl.innerText = `You have ${betTotal} coins`;
  betEl.innerText = `${myBet} coins`;
  }

function addMoney() {
  moneyPot -= 5;
  betPot += 5;
  whatIsMyBet(moneyPot, betPot);
}

function minusMoney() {
  moneyPot += 5;
  betPot -= 5;
  whatIsMyBet(moneyPot, betPot); 
}

function updateOdds() {
  const payoutPlayerUL = document.getElementById('playerOddsHands'); 
  const createdPlayerEl = payoutPlayerUL.querySelectorAll('li');

  winningCoins = [];

  for (let i = 0; i < 9; i++) { // update player payout table against their bet
    createdPlayerEl[i].innerText = handRanks[i].pOdds * betPot;
    winningCoins.push(createdPlayerEl[i].innerText);
    } 
}

/*-----Rnd cards -----*/
function rndCard() { // creates deck as a guard
  if (deck.length === 0) {
    for (let i = 0; i < suit.length; i++) {
      for (let ii = 0; ii < rank.length; ii++) {
        deck.push(suit[i] + rank[ii]);
      }
    }
  }

  // Generate a random card
  const index = Math.floor(Math.random() * deck.length);
  const card = deck[index];
  deck.splice(index, 1); // Remove the selected card from the deck
  return card;
}

/*----- Game flow -----*/
function play() {
  boardEl.innerHTML = ''; // clears the game table
  statusEl.innerHTML = '<h2>Place your bets!</h2><h2>Ready to play?<br>Hit deal</h2>'; 
  isGameFinished = false; // sets the game back to 'in play'
  deck = []; // clears the deck array
  clickCount = false;
  playerHandArray = []; // clears the [♠A, ..] array that will be used for winning logic
  playerSuitObject = {}; // clears the {♠, ..}  that will be used for winning logic
  playerRankObject = {};// clears the {A, ..}  that will be used for winning logic 
  isFirstDealClick = true; // ensure that old deal() runs first
  whatIsMyBet(moneyPot, betPot); // retains the coin total

  // adds 5 'backs' of cards to the Games table
  for (let i=0; i < numOfCards; i++) {
    let newDiv = document.createElement('div'); // adds a <div> to hold the card 
    newDiv.classList.add('card', 'back', 'xlarge'); // the back of 5 cards 
    boardEl.appendChild(newDiv); // appends to Games Table
    newDiv.id = i;
   } 
 }

function deal() {
  if (isFirstDealClick) { // guard so deal() doesn't run twice
    // deals the player's first hand
    const cardEls = boardEl.querySelectorAll('.card');
    statusEl.innerHTML = "<h2>Click cards to hold</h2><h2>Hit DRAW when ready!</h2>";
    isFirstDealClick = false;
    dealBtn.textContent = 'DRAW';
    let playerCard;

    cardEls.forEach((card => { // adds 5 random cards 
      playerCard = rndCard();
      // console.log(playerCard);
      card.className = `card ${playerCard} xlarge `;
      playerHandArray.push(playerCard); // eg [♠A, ..] for winning logic
    })) 
    } else {
      
      // let's the player swop cards and then ends the game
      const cardEls = boardEl.querySelectorAll('.card');
      let playerCard; // variable that will be assigned randomly generated card

      cardEls.forEach((card => { // replacing the non-hold cards
      playerCard = rndCard();
      if (!card.children[0]) { // if the Div doesn't have h6
        playerHandArray.splice(card.id, 1, playerCard); // repopulating playerHandArray
        card.className = `card ${playerCard} xlarge`;}
      }))
      getWinnerOutcome(playerHandArray); // its time to check if there was a winner
    }
  }

function hold(event) {
  if (!clickCount) {  // holds the card when clicked eg. if it doesn't have h6
    let holdEl = document.createElement('h6'); // creates a h6
    event.target.appendChild(holdEl); // appends as a child to what card triggered it
    event.target.style.opacity = "0.5";
    clickCount = true;
  } else { // changes it back if clicked again
    event.target.style.opacity = "1";
    clickCount = false;
  }
}

/*-----Did the player win logic -----*/
function getWinnerOutcome(arr) { 
  // Count of the suit
  playerSuitObject = arr.reduce((acc, curr) => { // creates the object counter
    let currSuit = curr.split("")[0]; 
    acc[currSuit] = acc[currSuit] ? acc[currSuit] +1 : 1
    return acc
  }, {})

  // Count of Rank
  let playerRankObject = arr.reduce((acc, curr) => {
	const myDict = { J: 11, Q: 12, K: 13, A: 14 }; 
  // Giving these numerical values as other cards rep by two digits eg 08, 09, 10
	let currCardValue = curr.split("").slice(1).join(""); // ranks
	if (Number(currCardValue)) { 
		acc[currCardValue] = acc[currCardValue] ? acc[currCardValue] + 1 : 1;
	} else {
		currCardValue = myDict[currCardValue]; // if false eg !NAN than look at myDict to turn into NAN
		acc[currCardValue] = acc[currCardValue] ? acc[currCardValue] + 1 : 1;
	}
  return acc;
  }, {});

  // payout based on best odds
  let isRoyalFlush = false;
  let isStraightFlush = false;
  let isFourPair = false;
  let isFullHouse = false;
  let isFlush = false;
  let isStraight = false;
  let isThreePair = false;
  let isTwoPair = false;
  let isJacksOrBetter = false;

  // matches the outcome of the counter to game logic eg handRanks object
   // game logic for matching 5 suits & suits above Jacks eg Royal Flush
  for (let key in playerSuitObject) {
    if (playerSuitObject[key] >= handRanks[0].count) {// if count is 5 means they are all of the same suit
      for (let rankKey in playerRankObject) {
        if (rankKey > 10) { //implies that the card is Jack +
          isRoyalFlush = true;
          break;
        }
      }
    }
  }

  // game logic for matching 5 suits eg Flush
  for (let key in playerSuitObject) { 
    if (playerSuitObject[key] === handRanks[4].count) {
      isFlush = true;
      break;
    } 
  }

  // game logic for matching 2/3/4 ranks
  for (let key in playerRankObject) {
    if (playerRankObject[key] === handRanks[2].count) {
      isFourPair = true;
      break;
    } else if (playerRankObject[key] === handRanks[6].count) {
      isThreePair = true;
      break;
    } else if (playerRankObject[key] === handRanks[7].count) {
      isTwoPair = true;
      break;
    }
  }

  // game logic for  "Jacks or Better" win
  for (let key in playerRankObject) {
    if (((playerRankObject[11] >= handRanks[8].count) ||
        (playerRankObject[12] >= handRanks[8].count) ||
        (playerRankObject[13] >= handRanks[8].count) ||
        (playerRankObject[14] >= handRanks[8].count)) && (playerRankObject[key] === handRanks[2].count)) {
          isJacksOrBetter = true;
          break;
    }
  }
  
  isGameFinished = true;

  // Check winning conditions in a specific order
  if (isGameFinished){
    if (isRoyalFlush) {
        statusEl.innerHTML = "<h2>You win!</h2><h2>Royal Flush</h2><h2>What a win!</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
        moneyPot += Number(winningCoins[0]);
        coinEl.innerText = `You have ${moneyPot} coins`;
      } else if (isFourPair) {
        statusEl.innerHTML = "<h2>You win!</h2><h2>A Flush</h2><h2>Great hand!</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
        moneyPot += Number(winningCoins[2]);
        coinEl.innerText = `You have ${moneyPot} coins`;
      } else if (isFlush) {
        statusEl.innerHTML = "<h2>You win!</h2><h2>Four of a Kind/h2><h2>Whoozer!</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
        moneyPot += Number(winningCoins[4]);
        coinEl.innerText = `You have ${moneyPot} coins`;
      } else if (isThreePair) {
        statusEl.innerHTML = "<h2>You win!</h2><h2>Three of a Kind</h2><h2>Not bad - enjoy those coins!</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
        moneyPot += Number(winningCoins[6]);
        coinEl.innerText = `You have ${moneyPot} coins`;
      } else if (isTwoPair) {
        statusEl.innerHTML = "<h2>You win!</h2><h2>Two Pair</h2><h2>Could be worse!</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
        moneyPot += Number(winningCoins[7]);
        coinEl.innerText = `You have ${moneyPot} coins`;
      } else if (isJacksOrBetter) {
        statusEl.innerHTML = "<h2>You win!</h2><h2>Jacks or Better</h2><h2>Least you gained a coin</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
        moneyPot += Number(winningCoins[8]);
        coinEl.innerText = `You have ${moneyPot} coins`;
      } else {
        statusEl.innerHTML = "<h2>Better luck next time!</h2><h2>Ready for a new game?</h2><h2>Hit NEW GAME</2>";
      }
  }
}

/*----- other -----*/
init();

function render() {  // responsible for rendering all state to the dom
  getOdds() // sets up both payout tables
  play(); // 5 upside cards & coin total
  coinEl.innerText = `You have ${moneyPot} coins`;
  betEl.innerText = `${betPot} coin`;
}

function init() { // responsible for initializing the state
  payoutEls.innerText = ''; // clears the paytable
  payoutPlayerEls.innerText = ''; // clears the player's payout table
  moneyPot = 100; // sets the initial credit total
  betPot = 0; // set the initial bet count to 0
  render(); 
}