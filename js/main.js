/*----- constants -----*/
const suits = ["s", "h", "c", "d"];
const faces = ["02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",  "10",  "J",  "Q",  "K",  "A"]; //prettier-ignore
const cards = [];
const playerCards = [];
const dealerCards = [];
let playerTotal, dealerTotal;
const hiddenCard = null;
let bank;
let bet = 0;
let numberOfDecks = 6;

/*----- app's state (variables) -----*/
let turn, tableState, winner, blackJackState;
let firstMove = 0;

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
chipsEl.addEventListener("click", handleBet);

/*----- ALL FUNCTIONS -----*/
/*----- Event Handler Functions -----*/
function handleButtonClick(evt) {
  const btnType = evt.target.innerHTML;
  if (btnType === "Deal") {
    if (tableState === 2) init();
    tableState = 1;
    initialDeal();
    renderChips();
    renderCards();
    renderScore();
    renderMessageBox();
    firstMove = 1;
    renderButtons();
    checkBlackJack();
  } else if (btnType === "Hit") {
    firstMove = 0;
    dealCard(turn);
    renderButtons();
    renderCards();
    renderScore();
    if (calculateScores()[0] > 21) determineWinner(); //check if the player busted
  } else if (btnType === "Stand") {
    firstMove = 0;
    renderButtons();
    tableState = 2;
    while (calculateScores()[1] <= 16) dealerHit();
    determineWinner(); //determine the iwnner of the hand
  } else if(btnType === "Double"){
    if (bank - bet >= 0){ //if there is enough money in the bank, double the bet
      firstMove = 0;
      tableState = 2;
      bank -= bet;
      bet += bet;
      renderBank();
      dealCard(turn);
      while (calculateScores()[1] <= 16) dealerHit();
      determineWinner();
    } else {
      renderMessageBox();
    }
  } else if(btnType === "Play Again"){
    init(); //start a new hand but don't reshuffle or reset the bank
  } else if(btnType === "Reset Bet"){
    bank += bet;
    bet = 0;
    renderBank();
    tableState = 0;
    renderButtons();
    renderMessageBox("Place your bet to begin the game");
  }
}
function handleRestart() {
  tableState = 0;
  init();
}

function handleBet(evt) {
  let betAmount = parseInt(evt.target.innerHTML.split("$")[1]);
  if (bank - betAmount >= 0) {
    bet += betAmount;
    bank -= betAmount;
    tableState = 3; //ready to show the deal button
    renderButtons();
    renderBank();
  } else {
    renderMessageBox("Bet amount cannot exceed bank total!");
  }
}

/*----- Initialization Functions -----*/
function init() {
  clearCardRenderings();
  clearHands();
  renderCardOutlines(playerEl);
  renderCardOutlines(dealerEl);
  if (!tableState) {
    shuffleDeck();
    bet = 0;
    bank = 100;
  }
  tableState = 0;
  renderChips();
  renderMessageBox("Place your bet to begin the game");
  renderScore();
  renderBank();
  renderButtons();
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

function shuffleDeck() {
  faces.forEach(function (cardVal) {
    suits.forEach(function (suit) {
      for(let i = 0; i < numberOfDecks; i++){
        cards.push({
          cardName: cardVal,
          suit: suit,
          value: assignCardValue(cardVal),
          cardString: `card ${suit}${cardVal}`,
        });
      }
    });
  });
}

/*----- Controller Functions -----*/

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

function checkBlackJack(){
  if(calculateScores()[1] === 21 || calculateScores()[0] === 21){
    tableState = 2;
    blackJackState = 1;
    determineWinner();
  }
}

function determineWinner() {
  let scores = calculateScores(); //player is index 0, dealer is index 1
  if (scores[1] > 21) {
    renderMessageBox(`Player wins $${bet}, dealer busted`);
    winner = 1;
  } else if (scores[0] > 21) {
    tableState = 2;
    renderMessageBox(`Dealer wins, player busted and loses $${bet}`);
    winner = -1;
  } else if (scores[0] > scores[1]) {
    if(blackJackState === 1) renderMessageBox(`Blackjack! Player wins $${bet+=1.5*bet}`);
    renderMessageBox(`Player wins $${bet}`);
    winner = 1;
  } else if (scores[0] < scores[1]) {
    if(blackJackState === 1) renderMessageBox(`Blackjack! Player loses $${bet}`);
    renderMessageBox(`Dealer wins, player loses $${bet}`);
    winner = -1;
  } else if (scores[0] === scores[1]) {
    renderMessageBox("Draw");
    winner = 0;
    bank += bet;
  }
  dealerEl.children[0].setAttribute("class", dealerCards[0].cardString); //reveal hidden card!
  if (winner === 1 && !blackJackState) bank += 2 * bet;
  if (winner === 1 && !!blackJackState) bank += 2.5 * bet;
  blackJackState = 0;
  bet = 0;
  renderBank();
  renderButtons();
  renderScore();
  if (bank === 0) renderEndgame();
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

function dealCard(turn) {
  if (cards.length === 0) {
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

function initialDeal(){
  turn = -1;
  dealCard(turn);
  turn = 1;
  dealCard(turn);
  turn = -1;
  dealCard(turn);
  turn = 1;
  dealCard(turn);
}


/*----- Render Functions -----*/
function renderBank() {
  bankTotalEl.innerHTML = `Bank: $${bank}`;
  betEl.innerHTML = `Bet: $${bet}`;
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
  if (tableState === 0 || tableState === 3 || tableState === 4) {
    messageChild.innerHTML = `${message}`;
  } else if (tableState === 1) {
    messageChild.innerHTML = "Make your move...";
    if(firstMove) messageChild.innerHTML = "Sorry. Not enough funds available to double.";
  } else if (tableState === 2) {
    messageChild.innerHTML = `Game over! ${message}!`;
  }
  messageEl.appendChild(messageChild);
}

function renderChips(){
  clearChipRenderings();
  if (tableState === 0){
    bets = ["bet5","bet10","bet20"];
    betValues = [5, 10, 20];
    bets.forEach(function(bet){
      const betValue = bet.split("t")[1];
      bet = document.createElement("button");
      bet.innerHTML = `$${betValue}`
      bet.setAttribute("class", "preHand");
      chipsEl.appendChild(bet);
    })
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
    const doubleChild = document.createElement("button");
    hitChild.innerHTML = "Hit";
    buttonEl.appendChild(hitChild);
    standChild.innerHTML = "Stand";
    buttonEl.appendChild(standChild);
    doubleChild.innerHTML = "Double";
    if(firstMove) buttonEl.appendChild(doubleChild);
  } else if (tableState === 2){
    const playAgainChild = document.createElement("button");
    playAgainChild.innerHTML = "Play Again";
    buttonEl.appendChild(playAgainChild);
  }
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

function renderEndgame(){
  clearButtonRenderings();
  clearChipRenderings();
  tableState = 4;
  renderMessageBox("Game over! You ran out of money.")
}

function clearHands() {
  playerCards.splice(0, playerCards.length);
  dealerCards.splice(0, dealerCards.length);
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

function clearButtonRenderings() {
  const buttonLength = buttonEl.children.length;
  for (let i = 0; i < buttonLength; i++) {
    buttonEl.removeChild(buttonEl.children[0]);
  }
}
//run code
init();
