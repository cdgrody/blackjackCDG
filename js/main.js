/*----- constants -----*/
const suits = ["spade", "heart", "club", "diamond"];
const cardVals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
const deckQty = 1;
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

function shuffleDeck(){
    cardVals.forEach(function(cardVal) {
        cards.push({"cardName": cardVal, "qty": 4 * deckQty, "suit": suits, "value": assignCardValue(cardVal)})
    });
}

function assignCardValue(cardVal) {
    if(parseInt(cardVal)){ //if the card is a number, return that number
        return parseInt(cardVal);
    } else if (cardVal === "Ace") { //aces = 11 in blackjack
        return 11;
    } else { //royals = 10 in blackjack
        return 10;
    }
}

function dealCard(){
    if(cards.length === 0){
        console.log("we're out, lets reshuffle");
        shuffleDeck();
    }
    const cardSelector = Math.floor(Math.random() * (cards.length));
    if(cards[cardSelector].qty > 0){
        cards[cardSelector].qty -= 1;
        console.log( cards[cardSelector]);
    } else { //remove that card from the array
        console.log("delete ", cards[cardSelector].cardName)
        cards.splice(cardSelector, 1)
    }
}

//run code
init();

