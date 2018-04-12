
var playerName;
var playerCards;
var playerClues;
var computerCards;
var potentialCards;
var winningCards;
var suspects;
var rooms;
var weapons;
var deck;
var guessHistory;
var historyShown;
var scoreShown;
var gameHistory;


// initial start of game, instantiates localStorage variables if needed
function startGame() {
    playerName = document.getElementById("nameInput").value;
    historyShown = false;
    scoreShown = false;
    if (localStorage.playerScore === undefined) {
        localStorage.playerScore = 0;
        localStorage.computerScore = 0;
    }
        
    newGame();
    document.getElementById("guessButton").disabled = false;
}

// new game
function newGame() {
    playerCards = [];
    playerClues = [];
    computerCards = [];
    potentialCards = {rooms: [], suspects: [], weapons: []};
    winningCards = {suspect: "", room: "", weapon: ""};
    suspects = ["Mrs. Peacock", "Mrs. Green", "Miss Scarlet", "Colonel Mustard", "Professor Plum", "Mrs. White"];
    rooms = ["Kitchen", "Ballroom", "Conservatory", "Billiard Room", "Library", "Study", "Hall", "Lounge", "Dining Room"];
    weapons = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Wrench"];
    deck = [];
    guessHistory = [];
    gameHistory = "";
    clearGame();
    shuffle();
    buildGame();
    debug();
    document.getElementById("hello").innerHTML = "Hello " + playerName + ", you hold the cards for " + getPlayerCards();
}

function buildGame() {
    // reinstantialize cards as winning set was removed during shuffle()
    suspects = ["Mrs. Peacock", "Mrs. Green", "Miss Scarlet", "Colonel Mustard", "Professor Plum", "Mrs. White"];
    rooms = ["Kitchen", "Ballroom", "Conservatory", "Billiard Room", "Library", "Study", "Hall", "Lounge", "Dining Room"];
    weapons = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Wrench"];
    var choices = "Rooms: ";
    
    // build card display
    for (var i = 0; i < rooms.length; i++) {
        choices += rooms[i];
        if (i < rooms.length -1)
            choices += ", ";
    }
    choices += "</br>Guests: ";
    for (i = 0; i < suspects.length; i++) {
        choices += suspects[i];
        if (i < suspects.length -1)
            choices += ", ";
    }
    choices += "</br>Weapons: ";
    for (i = 0; i < weapons.length; i++) {
        choices += weapons[i];
        if (i < weapons.length -1)
            choices += ", ";
    }
    document.getElementById("choices").innerHTML = choices;
    
    var roomSelect = document.getElementById("roomSelect");
    var suspectSelect = document.getElementById("suspectSelect");
    var weaponSelect = document.getElementById("weaponSelect");
    
    // Reset selects
    while (roomSelect.options.length > 0) {                
        roomSelect.remove(0);
    }
    while (suspectSelect.options.length > 0) {                
        suspectSelect.remove(0);
    }
    while (weaponSelect.options.length > 0) {                
        weaponSelect.remove(0);
    }
    
    
    // build selects
    var option
    for (i = 0; i<suspects.length; i++) {
        if (playerCards.indexOf(suspects[i]) == -1) {
            option =  document.createElement("option");
            option.value = suspects[i];
            option.text = suspects[i];
            suspectSelect.appendChild(option);
        }
    }
    for (i = 0; i<rooms.length; i++) {
        if (playerCards.indexOf(rooms[i]) == -1) {
            option =  document.createElement("option");
            option.value = rooms[i];
            option.text = rooms[i];
            roomSelect.appendChild(option);
        }
    }
    for (i = 0; i<weapons.length; i++) {
        if (playerCards.indexOf(weapons[i]) == -1) {
            option =  document.createElement("option");
            option.value = weapons[i];
            option.text = weapons[i];
            weaponSelect.appendChild(option);
        }
    }
    

}

// shuffles and distributes cards
function shuffle() {
    // Get winning card indexes
    var suspectIndex = Math.floor(Math.random()*6);
    var roomIndex = Math.floor(Math.random()*9);
    var weaponIndex = Math.floor(Math.random()*6);
    var cardIndex;
    var deckSize;
    // set winning cards
    winningCards.suspect = suspects[suspectIndex];    
    winningCards.room = rooms[roomIndex];
    winningCards.weapon = weapons[weaponIndex];
    // remove winning cards from deck
    suspects.splice(suspectIndex,1);
    rooms.splice(roomIndex,1);
    weapons.splice(weaponIndex,1);
    // create deck
    for (var i = 0; i < suspects.length; i++) {
        deck.push(suspects[i]);
    }
    for (i = 0; i < rooms.length; i++) {
        deck.push(rooms[i]);
    }
    for (i = 0; i < weapons.length; i++) {
        deck.push(weapons[i]);
    }
    // distribute cards
    deckSize = deck.length;
    for (i =0; i < deckSize/2; i++) {
        cardIndex = Math.floor(Math.random()*deck.length);
        playerCards.push(deck[cardIndex]);
        deck.splice(cardIndex,1);
        cardIndex = Math.floor(Math.random()*deck.length);
        computerCards.push(deck[cardIndex]);
        deck.splice(cardIndex,1);
    }
    
    // instantiate potential card tracker for computer
    potentialCards.rooms.push(winningCards.room);
    potentialCards.suspects.push(winningCards.suspect);
    potentialCards.weapons.push(winningCards.weapon);
    for (i = 0; i < rooms.length; i++) {
        if (computerCards.indexOf(rooms[i]) == -1) {
            potentialCards.rooms.push(rooms[i]);
        }
    }
    for (i = 0; i < suspects.length; i++) {
        if (computerCards.indexOf(suspects[i]) == -1) {
            potentialCards.suspects.push(suspects[i]);
        }
    }
    for (i = 0; i < weapons.length; i++) {
        if (computerCards.indexOf(weapons[i]) == -1) {
            potentialCards.weapons.push(weapons[i]);
        }
    }
}
    
function getPlayerCards() {
    var cards = "";
    for(var i = 0; i < playerCards.length; i++) {
        if (i != playerCards.length - 1) {
           cards += playerCards[i] + ", " 
        }
        else {
            cards += "and " + playerCards[i];
        }
    }
    return cards;
}

function getWinningCards() {
    return winningCards.suspect + " did it with the " + winningCards.weapon + " in the " + winningCards.room + "!";
}


// player guess, disables guess button
function playerGuess(){
    document.getElementById("guessButton").disabled = true;
    var game = document.getElementById("game");
    var guess = {room:document.getElementById("roomSelect").value, suspect:document.getElementById("suspectSelect").value, weapon:document.getElementById("weaponSelect").value};
    
    if(guess.room != winningCards.room) {
        // add card to clues if not already clue
        if (playerClues.indexOf(guess.room) == -1) {
            playerClues.push(guess.room);
        }
        game.innerHTML = "Sorry that was an incorrect guess! The Computer holds the card for " + guess.room + ".</br>Click to continue: <button id='continueButton' onclick='continueGame()'>Continue</button>";
    } 
    else if (guess.suspect != winningCards.suspect) {
        if (playerClues.indexOf(guess.suspect) == -1) {
            playerClues.push(guess.suspect);
        }
        game.innerHTML = "Sorry that was an incorrect guess! The Computer holds the card for " + guess.suspect + ".</br>Click to continue: <button id='continueButton' onclick='continueGame()'>Continue</button>";
    }
    else if (guess.weapon != winningCards.weapon) {
        if (playerClues.indexOf(guess.weapon) == -1) {
            playerClues.push(guess.weapon);
        }
        game.innerHTML = "Sorry that was an incorrect guess! The Computer holds the card for " + guess.weapon + ".</br>Click to continue: <button id='continueButton' onclick='continueGame()'>Continue</button>";
    }
    else {
        game.innerHTML = "That was the correct guess! " + getWinningCards() + "</br>Click to start a new game: <button id='newGameButton' onclick='newGame()'>New Game</button>";
        localStorage.playerScore++;
        
        showScore();
    }
    var historyInput = (guessHistory.length + 1) + '. ' + playerName + ' guessed "' + guess.suspect + " in the " + guess.room + " with the " + guess.weapon + '"</br>';
    guessHistory.push(historyInput);
    showHistory();
}

// Continue after player guess
function continueGame() {
    computerGuess();
}

// computer guess
function computerGuess() {
    var game = document.getElementById("game");
    var guess = {room: "", suspect: "", weapon: ""};
    var roomIndex = Math.floor(Math.random()*potentialCards.rooms.length);
    var suspectIndex = Math.floor(Math.random()*potentialCards.suspects.length);
    var weaponIndex = Math.floor(Math.random()*potentialCards.weapons.length);
    guess.room = potentialCards.rooms[roomIndex];
    guess.suspect = potentialCards.suspects[suspectIndex];
    guess.weapon = potentialCards.weapons[weaponIndex];
    if(guess.room != winningCards.room) {
        // remove card from potentialCards
        potentialCards.rooms.splice(roomIndex,1);
        game.innerHTML = 'The Computer guessed "' + guess.suspect + " in the " + guess.room + " with the " + guess.weapon + '"</br>The computer made an incorrect guess! You hold the card for ' + guess.room + ".</br>Click to continue: <button id='continueButton' onclick='clearGame()'>Continue</button>";
    } 
    else if (guess.suspect != winningCards.suspect) {
        potentialCards.suspects.splice(suspectIndex,1);
        game.innerHTML = 'The Computer guessed "' + guess.suspect + " in the " + guess.room + " with the " + guess.weapon + '"</br>The computer made an incorrect guess! You hold the card for ' + guess.suspect + ".</br>Click to continue: <button id='continueButton' onclick='clearGame()'>Continue</button>";
    }
    else if (guess.weapon != winningCards.weapon) {
        potentialCards.weapons.splice(weaponIndex,1);
        game.innerHTML = 'The Computer guessed "' + guess.suspect + " in the " + guess.room + " with the " + guess.weapon + '"</br>The computer made an incorrect guess! You hold the card for ' + guess.weapon + ".</br>Click to continue: <button id='continueButton' onclick='clearGame()'>Continue</button>";
    }
    else {
        game.innerHTML = 'The Computer guessed "' + guess.suspect + " in the " + guess.room + " with the " + guess.weapon + '"</br>The computer made the correct guess! ' + getWinningCards() + "</br>Click to start a new game: <button id='newGameButton' onclick='newGame()'>New Game</button>";
        localStorage.computerScore++;
        
        showScore();
    }
    var historyInput = (guessHistory.length + 1) + '. The Computer guessed "' + guess.suspect + " in the " + guess.room + " with the " + guess.weapon + '"</br>';
    guessHistory.push(historyInput);
    showHistory();
}

// clears game feed and enables guess button after computer guess
function clearGame() {
    document.getElementById("guessButton").disabled = false;
    document.getElementById("game").innerHTML = "";
}


function toggleHistory(){
    var historyButton = document.getElementById("historyButton");
    if (historyShown) {
        historyShown = false;
        historyButton.innerHTML = "Show History";
        hideHistory();
    }
    else {
        historyShown = true;
        historyButton.innerHTML = "Hide History";
        showHistory();
    }
}

function updateHistory() {
    gameHistory = "";
    for (var i = 0; i < guessHistory.length; i++) {
        // even - player move
        gameHistory += guessHistory[i];
    }
    
}

function showHistory() {
    if (historyShown) {
        updateHistory();
        document.getElementById("guessHistory").innerHTML = gameHistory;
    }
}

function hideHistory() {
    document.getElementById("guessHistory").innerHTML = "";
}

function toggleScore() {
    var scoreButton = document.getElementById("scoreButton");
    if (scoreShown) {
        scoreShown = false;
        scoreButton.innerHTML = "Show Score";
        hideScore();
    }
    else {
        scoreShown = true;
        scoreButton.innerHTML = "Hide Score";
        showScore();
    }
}

function updateScore() {
    
}

function showScore() {
    if (scoreShown) {
         document.getElementById("score").innerHTML = "" + playerName + ": " + localStorage.playerScore + ", The Computer: " + localStorage.computerScore;
    }
}

function hideScore() {
    document.getElementById("score").innerHTML = "";
}



function debug() {
    document.getElementById("debug").innerHTML = getWinningCards();
}

