console.log('You got this!')
/*----- constants -----*/
const numOfCards = 5;

/*----- app's state (variables) -----*/
let game;

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board
let playerHandArray = [];

/*----- classes -----*/
class ShufflingCard {
  constructor() {
    this.suit = ['♠', '♣', '♦', '♥'];
    this.rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
  }

  clearBoard() { // clears the board
    boardEl.innerHTML = '';
  }

  playerHandArrayRndCard() { // playerHandArrays the cards into the board
   this.clearBoard();
    for (let i=0; i < numOfCards; i++) {
      const playerCard = this.rndCard(); // randomly generated card
      const newDiv = document.createElement('div'); 
      newDiv.classList.add('card', playerCard, 'xlarge');
      boardEl.appendChild(newDiv);
      playerHandArray.push(playerCard); // do i need this?
      // console.log(this.handString);
    } 
  } 

  static staticHandString = this.handString;

  rndCard() { // creates a single random card
    const rndSuitIdx = Math.floor(Math.random() * this.suit.length);
    const rndRankIdx = Math.floor(Math.random() * this.rank.length);
    const card = this.suit[rndSuitIdx] + this.rank[rndRankIdx]; // card string eg♠A
    console.log(this.suit[rndSuitIdx]);
    console.log(this.rank[rndRankIdx]);
    return card;
  } 
}

class VideoPokerGame { 
  // using class to encapsulation eg bundle data and functions into an object
  // like the JS equivalent of <div>
  constructor(messageElement) {
    this.messageElement = messageElement; // haven't created msgEl so won't long anything
  }

  // static properties as the winningCombos never change per a class 
  // static winningCombos = [

  // ];

  handCount(arr) {  // passes the converted array 
    console.log(arr);
    const count = arr.reduce(function(acc,cur) {
      acc[cur] = acc[cur] ? acc[cur] +1 : 1
      return acc 
    }, {})
    console.log(count);
  }

  play() {
    // initialize the game' state
    // this binds it to the constructor
    // ShuffingCard is responsible for playerHandArraying the cards 
    this.winnerOutcome = null; // TO DO: do i need this 
    // this.credits = ???; // TO DO: this.credits? check the player's avaiable credits?!?
    this.render();
  }

  render() { 
    deal(); // is this the right function for here? 
    console.log('is function deal the best to playerHandArray a new game'); // to check the output in console game.play()
    // TO DO: 
    // update the messaging in gamestatus based on winnerOutcome
  }
}

/*----- event listeners -----*/
document.getElementById('newGameButton').addEventListener('click', deal); // TO DO: check this is the right function
document.getElementById('dealButton').addEventListener('click', deal); // Deal Btn 

/*----- functions -----*/
function init() {
  const game = new VideoPokerGame(); //msgEl would go here if using messgaELement
  game.play(); 
};

init();

function deal() {
  const shufflingCard = new ShufflingCard(); // Intantiate a new instance
  shufflingCard.playerHandArrayRndCard(); // playerHandArray the random card
}

function getWinnerOutcome() {
  const videoPokerGame = new VideoPokerGame(); // Intantiate a new instance
  videoPokerGame.handCount(playerHandArray);
}

getWinnerOutcome();