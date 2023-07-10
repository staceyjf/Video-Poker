console.log('You got this!')
/*----- constants -----*/
const boardEl = document.getElementById('gameTable'); // the board
const numOfCards = 5; 

/*----- app's state (variables) -----*/
let game;

/*----- cached element references -----*/


/*----- classes -----*/
class ShufflingCard {
  constructor(boardElement) {
    this.suit = ['♠', '♣', '♦', '♥'];
    this.rank = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
    this.boardElement = boardElement;
    this.boardArray = Array.from(this.boardElement); // convert the DOM El into an array
  }

  clearBoard() { // clears the board
    boardEl.innerHTML = '';
  }

  renderRndCard() { // renders the cards into the board
   this.clearBoard();
    for (let i=0; i < numOfCards; i++) {
      const playerCard = this.rndCard(); // randomly generated card
      const newDiv = document.createElement('div'); 
      newDiv.classList.add('card', playerCard, 'xlarge');
      boardEl.appendChild(newDiv);
    } 
  } 

  rndCard() { // creates a single random card
    const rndSuitIdx = Math.floor(Math.random() * this.suit.length);
    const rndRankIdx = Math.floor(Math.random() * this.rank.length);
    const card = this.suit[rndSuitIdx] + this.rank[rndRankIdx]; // card string eg♠A
    return card;
  } 
}

class VideoPokerGame { 
  // using class to encapsulation eg bundle data and functions into an object
  // for ease of reading the code 
  // like the JS equivalent of <div>
  // to see this in the console use game
  constructor(boardElement, messageElement) {
    this.boardElement = boardElement;
    this.messageElement = messageElement; // haven't created msgEl so won't long anything
  }

  // static properties as the winningCombos never change per a class 
  static winningCombos = [
    // TO DO: game logic goes here
  ];

  play() {
    // initialize the game' state
    // this binds it to the constructor
    // ShuffingCard is responsible for rendering the cards 
    this.winnerOutcome = null; // TO DO: do i need this 
    // this.credits = ???; // TO DO: this.credits? check the player's avaiable credits?!?
    this.render();
  }

  render() { 
    deal();
    console.log('this is where i need to update render to make sure its setting up a new game'); // to check the output in console game.play()
    // TO DO: 
    // update the messaging in gamestatus based on winnerOutcome
  }
}

/*----- event listeners -----*/
document.getElementById('newGameButton').addEventListener('click', deal); // TO DO: check this is the right function
document.getElementById('dealButton').addEventListener('click', deal); // Deal Btn 

/*----- functions -----*/
function init() {
  const game = new VideoPokerGame(boardEl); //msgEl would go here if using messgaELement
  game.play(); 
};

init();

function deal() {
  const shufflingCard = new ShufflingCard(boardEl); // Intantiate a new instance
  shufflingCard.renderRndCard(); // Render the random card
}