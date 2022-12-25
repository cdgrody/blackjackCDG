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
    tableState = 1;
    turn = -1;
    dealCard(turn);
    dealCard(turn);
    turn = 1;
    dealCard(turn);
    dealCard(turn);
    renderCards();
    renderScore();
    renderMessageBox();
    //remove the deal button
  } else if (btnType === "Hit") {
    dealCard(turn);
    clearCardRenderings();
    renderCards();
    renderScore();
    if (calculateScores()[0] > 21) renderGameEnd();
  } else if (btnType === "Stand") {
    tableState = 2;
    while(calculateScores()[1] < 16){
      dealerHit();
    }
    renderGameEnd();
  }
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

function renderMessageBox(message) {
  messageEl.removeChild(messageEl.children[0]);
  const messageChild = document.createElement("div");
  if (tableState === 0) {
    messageChild.innerHTML = "Press the deal button to begin the game";
  } else if (tableState === 1) {
    messageChild.innerHTML = "Hit or Stand?  Make your move...";
  } else if (tableState === 2) {
    messageChild.innerHTML = `Game over! ${message}!`;
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

function clearHands() {
  playerCards.splice(0, playerCards.length);
  dealerCards.splice(0, dealerCards.length);
}

function calculateScores() {
  let playerTotal = 0;
  let dealerTotal = 0;
  playerCards.forEach((playerCard) => (playerTotal += playerCard.value));
  if(playerTotal > 21) playerTotal = aceValueAdjustment(playerCards, playerTotal);
  dealerCards.forEach((dealerCard) => (dealerTotal += dealerCard.value));
  if(dealerTotal > 21) dealerTotal = aceValueAdjustment(dealerCards, dealerTotal);
  return [playerTotal, dealerTotal, dealerTotal - dealerCards[0].value];
}

function renderScore() {
  if (tableState === 0) {
    resultsEl.children[0].innerHTML = `Dealer: `;
    resultsEl.children[1].innerHTML = `Player: `;
  } else {
    let scores = calculateScores();
    if (tableState !== 2) {
    }
    resultsEl.children[0].innerHTML = `Dealer: ${scores[2]}`;
    if (tableState === 2)
      resultsEl.children[0].innerHTML = `Dealer: ${scores[1]}`;
    resultsEl.children[1].innerHTML = `Player: ${scores[0]}`;
  }
}

function renderGameEnd() {
  let scores = calculateScores();
  if (scores[1] > 21) {
    renderMessageBox("Player wins, dealer busted");
  } else if (scores[0] > 21) {
    tableState = 2;
    renderMessageBox("Dealer wins, player busted");
  } else if (scores[0] > scores[1]) {
    renderMessageBox("Player wins");
  } else if (scores[0] < scores[1]) {
    renderMessageBox("Dealer wins");
  } else if (scores[0] === scores[1]) {
    renderMessageBox("Draw");
  } else {
    console.log(tableState, "No Result Yet");
    return;
  }
  dealerEl.children[0].setAttribute("class", dealerCards[0].cardString); //reveal hidden card!
  renderScore();
}

function aceValueAdjustment(deckCards, total) {
  const aceCount = deckCards.filter(deckCard => deckCard.cardName === "A");
  console.log(aceCount.length);
  if(aceCount === 0) return total;
  for(let i = 0; i < aceCount.length; i++){
    total -= 10;
    if(total < 22) return total;
  }
  return total;
}

function dealerHit() {
  turn = -1;
  dealCard(turn);
  renderCards();
  renderScore();
}

//run code
init();
