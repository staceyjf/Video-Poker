console.log('You got this superstar!')
/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();
renderDeckInContainer(originalDeck, document.getElementById('original-deck-container')); 

/*----- app's state (variables) -----*/
let shuffledDeck;

/*----- cached element references -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');

/*----- event listeners -----*/
document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

/*----- functions -----*/
// RETURNS THE WHOLE shuffled deck of cards
// ADDED numCards so need to check the logic here
function getNewShuffledDeck(numCards) {
    // Create a copy of the originalDeck (shallow copy of the references to the card object)
    // card object never changes for this code BUT if you want to store extra properties 
    // eg what player holds that card which changes you may want to build the card objects from scratch every time 
    const tempDeck = [...originalDeck]; 
    const newShuffledDeck = [];
    while (tempDeck.length < numCards) { //this is what set the number of remaining cards
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array 
      // and we just want the card object in that array
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
      // ADD THIS NEED TO CHECK IT WORKS
    //   if (newShuffledDeck.length === numCards) {
    //     break;
    //   }
    }
    return newShuffledDeck;
  }

  function renderNewShuffledDeck() {
    // Create a copy of the originalDeck (leave originalDeck untouched!)
    shuffledDeck = getNewShuffledDeck();
    renderDeckInContainer(shuffledDeck, shuffledContainer);
  }
  
  function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the cards as a string of HTML
    let cardsHtml = '';
    deck.forEach(function(card) {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    });
    // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
    // const cardsHtml = deck.reduce(function(html, card) {
    //   return html + `<div class="card ${card.face}"></div>`;
    // }, '');
    container.innerHTML = cardsHtml;
  }

// Build a clean deck of cards
function buildOriginalDeck() {
    const deck = [];
    // Use nested forEach to generate card objects eg deck
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property is to blackjack where all cards 
          //, except ace has the same value CHANGE THIS TO VIDEO POKER 
          // GAME LOGIC???????
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
  }

  renderNewShuffledDeck();