/*----- constants -----*/
const suits = ["s", "h", "c", "d"];
const faces = ["02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",  "10",  "J",  "Q",  "K",  "A"]; //prettier-ignore
const cards = [];
const playerCards = [];
const dealerCards = [];
let playerTotal, dealerTotal;
const hiddenCard = null;

/*----- app's state (variables) -----*/
let turn, tableState;

/*----- cached element references -----*/
const buttonEl = document.querySelector(".buttons");
const playerEl = document.querySelector(".playerCtr");
const dealerEl = document.querySelector(".dealerCtr");
const startOverEl = document.querySelector(".startOver");
const messageEl = document.querySelector(".msgCtr");
const resultsEl = document.querySelector(".results");

/*----- event listeners -----*/
buttonEl.addEventListener("click", handleButtonClick);
startOverEl.addEventListener("click", init);

/*----- functions -----*/
function init() {
  clearCardRenderings();
  clearHands();
  renderCardOutlines(playerEl);
  renderCardOutlines(dealerEl);
  tableState = 0;
  renderMessageBox();
  shuffleDeck();
  renderScore();
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

function dealCard(turn) {
  if (cards.length === 0) {
    console.log("we're out, lets reshuffle");
    shuffleDeck();
  }
  const cardIdx = Math.floor(Math.random() * cards.length);
  if (turn === 1) {
    playerCards.push(cards[cardIdx]);
  } else {
    dealerCards.push(cards[cardIdx]);
  }
  cards.splice(cardIdx, 1);
}

function handleButtonClick(evt) {
  const btnType = evt.target.innerHTML;
  if (btnType === "Deal") {
    turn = -1;
    dealCard(turn);
    dealCard(turn);
    turn = 1;
    dealCard(turn);
    dealCard(turn);
    renderCards();
    tableState = 1;
    renderMessageBox();
    renderScore();
    //render message box to say "your move"
    //make turn state -1 to indicate it's the dealer's turn to receive cards
    //render dealer hand to have a face down card and a face up card
    //store card value in the dealerCards array
    //make turn state 1 to indicate it's the players's turn to receive cards
    //render player two face up cards
    //store player cards in the playerCards array
    //render total messages for player and dealer
    //remove the deal button
  } else if (btnType === "Hit") {
    dealCard(turn);
    clearCardRenderings();
    renderCards();
    renderScore();
  } else if (btnType === "Stand") {
  }
  // console.log(dealerCards);
  // console.log(playerCards);
}

function renderCards() {
  clearCardRenderings();
  playerCards.forEach(function (playerCard) {
    const cardChild = document.createElement("div");
    cardChild.className = playerCard.cardString;
    playerEl.appendChild(cardChild);
  });
  dealerCards.forEach(function (dealerCard) {
    const cardChild = document.createElement("div");
    // console.log("dealer card length" + dealerEl.children.length)
    if (!dealerEl.children.length) {
      cardChild.className = "card back";
      dealerEl.appendChild(cardChild);
    } else {
      cardChild.className = dealerCard.cardString;
      dealerEl.appendChild(cardChild);
    }
  });
}

function renderCardOutlines(element) {
  const cardChild = document.createElement("div");
  cardChild.className = "card outline";
  element.appendChild(cardChild);
}

function renderMessageBox(){
  messageEl.removeChild(messageEl.children[0]);
  const messageChild = document.createElement("div");
  if(tableState === 0){
    messageChild.innerHTML = "Press the deal button to begin the game";
  } else if (tableState === 1){
    messageChild.innerHTML = "Hit or Stand?  Make your move...";
  } else if (tableState === 2){
    messageChild.innerHTML = "Game over!";
  }
  messageEl.appendChild(messageChild);
}

function clearCardRenderings() {
  const playerDeckLength = playerEl.children.length;
  const dealerDeckLength = dealerEl.children.length;
  for (let i = 0; i < playerDeckLength; i++) {
    playerEl.removeChild(playerEl.children[0]);
  }
  for (let i = 0; i < dealerDeckLength; i++) {
    dealerEl.removeChild(dealerEl.children[0]);
  }
}

function clearHands(){
  playerCards.splice(0, playerCards.length);
  dealerCards.splice(0, dealerCards.length);
}

function calculateScores(){
  let playerTotal = 0;
  let dealerTotal = 0;
  playerCards.forEach(playerCard => playerTotal += playerCard.value);
  dealerCards.forEach(dealerCard => dealerTotal += dealerCard.value);
  return [playerTotal, dealerTotal, dealerTotal - dealerCards[0].value]
}

function renderScore(){
  if(tableState === 0 || tableState === 2){
    resultsEl.children[0].innerHTML = `Dealer: `;
    resultsEl.children[1].innerHTML = `Player: `;
  } else {
    let scores = calculateScores();
    resultsEl.children[0].innerHTML = `Dealer: ${scores[2]}`;
    resultsEl.children[1].innerHTML = `Player: ${scores[0]}`;
  }
}


//run code
init();
