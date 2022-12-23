/*----- constants -----*/
const suits = ["s", "h", "c", "d"];
const faces = ["02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",  "10",  "J",  "Q",  "K",  "A"]; //pretier-ignore
const cards = [];
let playerTotal, dealerTotal;
const hiddenCard = null;

/*----- app's state (variables) -----*/
let turn, tableState;

/*----- cached element references -----*/

/*----- event listeners -----*/

/*----- functions -----*/

function init() {
  shuffleDeck();
}

function shuffleDeck() {
  faces.forEach(function (cardVal) {
    suits.forEach(function(suit){
        cards.push({
          "cardName": cardVal,
          "suit": suit,
          "value": assignCardValue(cardVal),
        });
    })
  });
}

function assignCardValue(cardVal) {
  if (parseInt(cardVal)) {
    //if the card is a number, return that number
    return parseInt(cardVal);
  } else if (cardVal === "A") {
    //aces = 11 in blackjack
    return 11;
  } else {
    //royals = 10 in blackjack
    return 10;
  }
}

function dealCard() {
  if (cards.length === 0) {
    console.log("we're out, lets reshuffle");
    shuffleDeck();
  }
  const cardIdx = Math.floor(Math.random() * cards.length);
  console.log(cards[cardIdx])
    cards.splice(cardIdx, 1);
//   }
}

//run code
init();
