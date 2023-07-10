console.log('You got this!')
/*----- constants -----*/
const numOfCards = 5;
const suit = ['♠', '♣', '♦', '♥'];
const rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

/*----- app's state (variables) -----*/
let game;
// let winnerOutcome = 0;

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board
const statusEl = document.getElementById('gameStatus'); // the board
let playerHandArray = [];
let playerSuitArray = [];
let playerRankArray = [];

/*----- event listeners -----*/
document.getElementById('newGameButton').addEventListener('click', init); // TO DO: check this is the right function
document.getElementById('dealButton').addEventListener('click', render); // Deal Btn 

/*----- functions -----*/
init();

/*----- Cards -----*/
function clearBoard() { // clears the board
  boardEl.innerHTML = '';
}

function rndCard() { // creates a single random card
  const rndSuitIdx = Math.floor(Math.random() * suit.length);
  const rndRankIdx = Math.floor(Math.random() * rank.length);
  const card = suit[rndSuitIdx] + rank[rndRankIdx]; // card string eg♠A
  playerSuitArray.push(suit[rndSuitIdx]);
  playerRankArray.push(rank[rndRankIdx]); 
  return card;
} 

function deal() { // playerHandArrays the cards into the board
  clearBoard();
   for (let i=0; i < numOfCards; i++) {
     const playerCard = rndCard(); // randomly generated card
     const newDiv = document.createElement('div'); 
     newDiv.classList.add('card', playerCard, 'xlarge');
     boardEl.appendChild(newDiv);
     playerHandArray.push(playerCard); // do i need this?
   } 
 } 

/*----- The Game logic -----*/
// function clearCounter() { // clears the message box
//   statusEl.innerHTML = '';
// }

function getWinnerOutcome(arr) {  // counts rank/suit/rank&suit of a hand 
  let counter = arr.reduce(function(acc,cur) {
    acc[cur] = acc[cur] ? acc[cur] +1 : 1
    return acc 
  }, {})

  let winnerOutcome = false;

  for (let key in counter) { //game logic for matching 2/3/5
    if (counter[key] === 2|| counter[key] === 3 || counter[key] === 5) {
      winnerOutcome = true;
      break;
    } 
  } 
   
  if(winnerOutcome) { // 
    statusEl.innerHTML = "<h2>You win!</h2><h2>The type of win goes here</h2>";
    counter ={};
  } else {
    statusEl.innerHTML = "<h2>Better luck next time!</h2>";
    counter ={}; 
  }
}

/*----- other -----*/
function render() {  // responsible for rending all state to the dom?
  deal(); // is this the right function for here?
  // clearCounter(); // not clearing the div #gameStatus
  // getWinnerOutcome(playerHandArray); // return full object do i need this?
  // getWinnerOutcome(playerSuitArray); // object of just suits
  getWinnerOutcome(playerRankArray); // object of just rank
}

function init() { // responsible for initializing the state
  render();
};