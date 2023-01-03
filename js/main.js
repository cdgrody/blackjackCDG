/*----- constants -----*/
const suits = ["s", "h", "c", "d"];
const faces = ["02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",  "10",  "J",  "Q",  "K",  "A"]; //prettier-ignore
const cards = [];
const playerCards = [];
const dealerCards = [];
let playerTotal, dealerTotal;
const hiddenCard = null;
let bank,
  bet = 0;

/*----- app's state (variables) -----*/
let turn, tableState, winner;

/*----- cached element references -----*/
const buttonEl = document.querySelector(".buttons");
const playerEl = document.querySelector(".playerCtr");
const dealerEl = document.querySelector(".dealerCtr");
const startOverEl = document.querySelector(".startOver");
const messageEl = document.querySelector(".msgCtr");
const resultsEl = document.querySelector(".results");
const chipsEl = document.querySelector(".chips");
const bankEl = document.querySelector(".bank");
const bankTotalEl = document.querySelector(".bank div:first-child");
const betEl = document.querySelector(".bank div:last-child");

/*----- event listeners -----*/
buttonEl.addEventListener("click", handleButtonClick);
startOverEl.addEventListener("click", handleRestart);
chipsEl.addEventListener("click", placeBet);

/*----- functions -----*/
function handleButtonClick(evt) {
  const btnType = evt.target.innerHTML;
  if (btnType === "Deal") {
    if (tableState === 2) init();
    tableState = 1;
    turn = -1;
    dealCard(turn);
    turn = 1;
    dealCard(turn);
    turn = -1;
    dealCard(turn);
    turn = 1;
    dealCard(turn);
    renderChips();
    renderButtons();
    renderCards();
    renderScore();
    renderMessageBox();
  } else if (btnType === "Hit") {
    dealCard(turn);
    clearCardRenderings();
    renderCards();
    renderScore();
    if (calculateScores()[0] > 21) renderGameEnd();
  } else if (btnType === "Stand") {
    tableState = 2;
    while (calculateScores()[1] < 16) {
      dealerHit();
    }
    renderGameEnd();
  } else if(btnType === "Play Again"){
    init();
  } else if(btnType === "Reset Bet"){
    bank += bet;
    bet = 0;
    renderBank();
    tableState = 0;
    renderButtons();
  }
}

function init() {
  clearCardRenderings();
  clearHands();
  renderCardOutlines(playerEl);
  renderCardOutlines(dealerEl);
  if (!tableState) {
    shuffleDeck();
    bank = 100;
  }
  tableState = 0;
  renderChips();
  renderMessageBox();
  renderScore();
  renderBank();
  renderButtons();
}

function placeBet(evt) {
  let betAmount = parseInt(evt.target.innerHTML.split("$")[1]);
  if (bank - betAmount >= 0) {
    bet += betAmount;
    bank -= betAmount;
    tableState = 3; //ready to show the deal button
    renderButtons();
    renderBank();
    //render new bet to the screen
    //render deal button
    //render reset bet button
  } else {
    //don't update bet total
    //render message board to say bet amount is too high, bet again
  }
  //update bet total and total remaining
  //render updated totals
}

function renderBank() {
  bankTotalEl.innerHTML = `Bank: $${bank}`;
  betEl.innerHTML = `Bet: $${bet}`;
  console.log(bank);
}

function handleRestart() {
  tableState = 0;
  init();
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

function clearChipRenderings() {
  const chipLength = chipsEl.children.length;
  for (let i = 0; i < chipLength; i++) {
    chipsEl.removeChild(chipsEl.children[0]);
  }
}

function renderChips(){
  clearChipRenderings();
  if (tableState === 0){
    const bet5 = document.createElement("button");
    const bet10 = document.createElement("button");
    const bet20 = document.createElement("button");
    bet5.innerHTML = "$5"
    bet10.innerHTML = "$10"
    bet20.innerHTML = "$20"
    bet5.setAttribute("class", "preHand");
    bet5.setAttribute("class", "preHand");
    bet5.setAttribute("class", "preHand");
    chipsEl.appendChild(bet5);
    chipsEl.appendChild(bet10);
    chipsEl.appendChild(bet20);
  }
}

function clearButtonRenderings() {
  const buttonLength = buttonEl.children.length;
  for (let i = 0; i < buttonLength; i++) {
    buttonEl.removeChild(buttonEl.children[0]);
  }
}

function renderButtons() {
  clearButtonRenderings();
  if (tableState === 3) {
    const dealChild = document.createElement("button");
    const resetBetChild = document.createElement("button");
    dealChild.innerHTML = "Deal";
    resetBetChild.innerHTML = "Reset Bet";
    buttonEl.appendChild(dealChild);
    buttonEl.appendChild(resetBetChild);
  } else if (tableState === 1) {
    const hitChild = document.createElement("button");
    const standChild = document.createElement("button");
    hitChild.innerHTML = "Hit";
    buttonEl.appendChild(hitChild);
    standChild.innerHTML = "Stand";
    buttonEl.appendChild(standChild);
  } else if (tableState === 2){
    const playAgainChild = document.createElement("button");
    playAgainChild.innerHTML = "Play Again";
    buttonEl.appendChild(playAgainChild);
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
  if (playerTotal > 21)
    playerTotal = aceValueAdjustment(playerCards, playerTotal);
  dealerCards.forEach((dealerCard) => (dealerTotal += dealerCard.value));
  if (dealerTotal > 21)
    dealerTotal = aceValueAdjustment(dealerCards, dealerTotal);
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
    renderMessageBox(`Player wins $${bet}, dealer busted`);
    winner = 1;
  } else if (scores[0] > 21) {
    tableState = 2;
    renderMessageBox(`Dealer wins, player busted and loses $${bet}`);
    winner = -1;
  } else if (scores[0] > scores[1]) {
    renderMessageBox(`Player wins $${bet}`);
    winner = 1;
  } else if (scores[0] < scores[1]) {
    renderMessageBox(`Dealer wins, player loses $${bet}`);
    winner = -1;
  } else if (scores[0] === scores[1]) {
    renderMessageBox("Draw");
    winner = 0;
    bank += bet;
  } else {
    console.log(tableState, "No Result Yet");
    return;
  }
  dealerEl.children[0].setAttribute("class", dealerCards[0].cardString); //reveal hidden card!
  if (winner === 1) bank += 2 * bet;
  bet = 0;
  renderBank();
  renderButtons();
  renderScore();
}

function aceValueAdjustment(deckCards, total) {
  const aceCount = deckCards.filter((deckCard) => deckCard.cardName === "A");
  if (aceCount === 0) return total;
  for (let i = 0; i < aceCount.length; i++) {
    total -= 10;
    if (total < 22) return total;
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
