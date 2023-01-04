Blackjack CDG

Technologies Used:
javascript, HTML, and CSS

Link to Game:
<!-- <insert link> -->

Description: 
This game of Blackjack is played with a 6 decks of 52 cards. The objective of the game is to beat the dealer by having a hand value of 21 or as close to 21 as possible without going over. Players place a bet within the limits of their bank and are then dealt two cards. They can choose to "hit" and receive additional cards or "stand" with their current hand or "double" which doubles their bet and draws only one additional card. The dealer must hit on a hand value of 16 or less.  

Getting Started:
1) The message board in light blue prompts the user to their next move.  The player starts by placing a bit through clicking any one or multiple of the chips.  The amount of those chips will be subtracted from the Bank and added to the bet.  The user cannot bet anything additional once the Bank balance is 0.  
2) After the first bet is placed, two buttons appear under the player cards.If the user is not satisfied with the bet, they can hit the "Reset Bet" option and their bank account will be restored and the player can bet again.  If the player presses the "Deal" button, cards will be dealt.
3) When the cards are dealt, the user can chose between "hit," "stand," and "double."  "Hit" will add a card to the players hand.  "Stand" will prompt the dealer's cards to be dealt.  "Double" will double the player's bet, if funds allow, and draw one card from the player, then deal cards to the dealer.
4) Each time the player draws cards, the program will check if they busted (the value of their hand is over 21).  Aces are treated as a value of 11 until the player busts, in which case they decrease by 10 to prevent the bust.  The same logic then applys for the dealer's hand.
5) If neither player nor dealer busted, then the final values will be compared and a winner or draw will be determined.
6) If the player wins, then 2x the bet is added to their account (the original bet plus the winnings).  If the player loses, the bet is taken away.  If the player and dealer tie, then the original bet amount is added back to the bank.  The user will then be prompted to press the "Play Again" button which will start a new hand.  The deck will not be regenerated until all the cards run out.
7) If the player runs out of money, or just wants to start a new game, they can press the "Restart" button in the top left corner at any point.  This resets the bank, regenerates, and reshuffles the deck.  If the user's bank account drops to 0 after a hand, the "Restart" button will be the only one they can press.

Next Steps:
1) Add an option for the player to split the hand when the initial draw reveals two cards of the same value.  This will be a complicated funciton because I will essentially be creating two player hands that compete against the dealer.  It will also require me to render two player hands on the screen which will require some css magic.
2) Incorporate a 'hint' box where the player can hover their cursor and see the recommended move.  This will require me to translate blackjack strategy tables into the javascript.  These tables look at the players hand and the dealer's upcard and provide a recommendation of which move the player should make based on statistics.  I would probably create a 2D matrix to stor these tables, which a hint variable would access in order to create the html text of the next revommended move.
3) I want to create an "auto" player option where instead of hovering over the statistically recommended move, based on the strategy tables, is directly implemented after the hand is dealt. I then want to automate a betting algorithim where I can define how I want the player to bet after they lose, after they win once, or after they win (n) number of times.  Once I set the strategy, the program will play as many hands with the betting strategy until the player runs out of money.  I want to record how many hands were played, the highest earned value of the player, and when they reached that value.  By automating the game, I can test betting strategies, along with the best statistical approach to each hand, to see if I can find a way to increase the likelihood that I can make money.


Screenshots:

Initial starting screen for a new game:
![starting screen]url("images/begin_screen.png")
![first bets placed]url("images/first-bet-placed.png")
![initial cards dealt]url("images/initial_cards_dealt.png")
![player hits]url("images/player_hit.png")
![player wins]url("images/player_wins_hand.png")
![new hand begun]url("images/new_hand_with_updated_bank.png")
![game over]url("images/game_over.png")

Initial bet placed:
