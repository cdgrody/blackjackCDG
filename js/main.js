/*----- constants -----*/
const suits = ["s", "h", "c", "d"];
const faces = ["02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",  "10",  "J",  "Q",  "K",  "A"]; //prettier-ignore
const cards = [];
let playerTotal, dealerTotal;
const hiddenCard = null;

/*----- app's state (variables) -----*/
let turn, tableState;

/*----- cached element references -----*/
const buttonEl = document.querySelector(".buttons");
const playerEl = document.querySelector(".playerCtr");

/*----- event listeners -----*/
buttonEl.addEventListener("click", handleButtonClick);

/*----- functions -----*/
function init() {
  shuffleDeck();
}

function shuffleDeck() {
  faces.forEach(function (cardVal) {
    suits.forEach(function (suit) {
      cards.push({
        cardName: cardVal,
        suit: suit,
        value: assignCardValue(cardVal),
        cardString: `card ${suit}${cardVal}`,
      });
    });
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
  const currentCard = cards[cardIdx];
  cards.splice(cardIdx, 1);
  return currentCard;
}

function handleButtonClick(evt) {
  const btnType = evt.target.innerHTML;
  if (btnType === "Deal" || "Hit") renderPlayerCard();
}

function renderPlayerCard() {
  const currentCard = dealCard();
  const cardChild = document.createElement("div");
  cardChild.className = currentCard.cardString;
  console.log(playerEl.children[0].className);
  if (playerEl.children[0].className === "card outline") {
    playerEl.children[0].remove();
    playerEl.appendChild(cardChild);
  } else {
    playerEl.appendChild(cardChild);
  }
}

//run code
init();
