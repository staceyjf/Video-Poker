console.log('You got this superstar!')
/*----- constants -----*/
const rndCard = { // creates a single random card
    suit: ['♠', '♣', '♦', '♥'],
    rank: ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'],
    dealtCard:function() {
      const rndSuitIdx = Math.floor(Math.random() * this.suit.length);
      const rndRankIdx = Math.floor(Math.random() * this.rank.length);
      return cardFace = [this.suit[rndSuitIdx] + this.rank[rndRankIdx]]; //card str eg♠A
    }
  };

/*----- app's state (variables) -----*/
let game;

/*----- cached element references -----*/
const boardEl = document.getElementById('gameTable'); // the board

/*----- classes -----*/
class videoPokerGame { 
  // using class to encapsulation eg bundle data and functions into an object
  // for ease of reading the code 
  // like the JS equivalent of <div>
  // to see this in the console use game
  constructor(boardElement, messageElement) {
    // this keyword is the new object
    // don't need a return in constructor
    this.boardElement = boardElement;
    // this.messageElement = messageElement; // haven't created msgEl so won't long anthing
    this.cardEls = [...boardElement.querySelectorAll('div')]; // [] and ... convert NodeList into an array
  }

  // static properties as the winningCombos never change per a class 
  static winningCombos = [
    // TO DO: game logic goes here
  ];

  play() {
    // initialize the game' state
    // this binds it to the constructor 
    this.winnerOutcome = null; // TO DO: do i need this 
    this.playerHand = this.cardEls.map((div) => {
      const playerCard = rndCard.dealtCard(); // randommly generated card
      div.classList.add(`card.${playerCard}`);
    });
    // this.credits = ???; // TO DO: this.credits? check the player's avaiable credits?!?
    this.render();
  }

  render() { 
    console.log('Render game to see the render() is working...'); // to check the output in console game.play()
    // TO DO: 
    // update the messaging in gamestatus based on winnerOutcome
  }
}

/*----- event listeners -----*/

/*----- functions -----*/
init();

function init() {
  game = new videoPokerGame(boardEl); //msgEl would go here if using messgaELement
  game.play(); 
};