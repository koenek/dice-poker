// One object for all HTML elements
const elements = {
    playerOneResult: document.querySelector('#result-p1'),
    playerTwoResult: document.querySelector('#result-p2'),
    playerOneHeader: document.querySelector('#player1-header'),
    playerTwoHeader: document.querySelector('#player2-header'),
    playerOneTurnCounter: document.querySelector('#p1-turn-count'),
    playerTwoTurnCounter: document.querySelector('#p2-turn-count'),
    playerOneTurnsLeft: document.querySelector('#p1-turns-left'),
    playerTwoTurnsLeft: document.querySelector('#p2-turns-left'),
    winnerDisplay: document.querySelector('.winner')
};


// Declaration of Global variables
let playerOneInput;
let playerTwoInput;
let gamePlaying = false;
let turns;
let round;
let countObj;
// create "empty" dice arrays for both players
let playerOneDiceArr = [];
let playerTwoDiceArr = [];
// create dice for both players
let playerOneDice1, playerOneDice2, playerOneDice3, playerOneDice4, playerOneDice5;
let playerTwoDice1, playerTwoDice2, playerTwoDice3, playerTwoDice4, playerTwoDice5;

// Create dice class
class Dice {
    constructor(randomNum, hold) {
        this.randomNum = randomNum;
        this.hold = hold;
    }
};

// Function used to calculate a random number between 1-6
const calcRandomNum = () => {
    return Math.floor(Math.random() * 6) + 1;
};

// Function used to get the maximum number that occurs most frequently. Used in case of a tie
const getMaxNum = arr => {
    // Get the highest number that occurs most frequent
    let mf = 1;
    let m = 0;
    let item;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (arr[i] == arr[j])
                m++;
            if (mf < m) {
                mf = m;
                item = arr[i];
            }
        }
        m = 0;
    }
    return item;
};

// Funtion to display dice. Takes 3 arguments. The current player(a string 'p1' or 'p2'), position of the dice(player 1 side or player 2 side) and the dice array of the current player
const displayDice = (player, position, arr) => {
    let diceDOM = document.querySelector(`.${player}_position_${position}`);
    diceDOM.style.display = 'block';
    diceDOM.src = `./img/dice-${arr[i].randomNum}.png`;
    document.querySelector(`#${player}-dice-grid`).style.display = 'block';
};

// Function to hold dice(prevent it from rolling when rollDice button is pressed). Takes the same arguments as displayDice function
const holdDice = (player, position, arr) => {
    if (arr.length !== 0) {
        if (arr[position - 1].hold !== true) {
            arr[position - 1].hold = true;
            let diceDOM = document.querySelector(`.${player}_position_${position}`);
            diceDOM.style.outline = '3px solid #FFDF00';
        } else {
            arr[position - 1].hold = false;
            let diceDOM = document.querySelector(`.${player}_position_${position}`);
            diceDOM.style.outline = 'none';
        }
    }
};

// Function to change active player
const changeActivePlayer = () => {
    if (activePlayer === 0) {
        elements.playerTwoHeader.style.color = '#180D00';
        elements.playerOneHeader.style.color = '#FFDF00';
        elements.playerOneTurnCounter.style.display = 'block';
        elements.playerTwoTurnCounter.style.display = 'none';
        turns = 3;
        elements.playerOneTurnsLeft.innerHTML = '';
        elements.playerOneTurnsLeft.insertAdjacentHTML('afterbegin', `<span id="p1-turns-left">${turns}</span>`);
    } else if (activePlayer === 1) {
        elements.playerOneHeader.style.color = '#180D00';
        elements.playerTwoHeader.style.color = '#FFDF00';
        elements.playerTwoTurnCounter.style.display = 'block';
        elements.playerOneTurnCounter.style.display = 'none';
        turns = 3;
        elements.playerTwoTurnsLeft.innerHTML = '';
        elements.playerTwoTurnsLeft.insertAdjacentHTML('afterbegin', `<span id="p2-turns-left">${turns}</span>`);
    }
};

// Object that contains the logic concerning the different possible results
const resultLogic = {
    fiveOfAKind: () => {
        for (let i = 0; i <= 1; i++) {
            let count = 1;
            for (let j = i + 1; j < diceArray.length; j++) {
                if (diceArray[i] == diceArray[j])
                    count++;
            }
            if (count == 5)
                return true;
        }
        return false;
    },
    fourOfAKind: () => {
        for (let i = 0; i <= 1; i++) {
            let count = 1;
            for (let j = i + 1; j < diceArray.length; j++) {
                if (diceArray[i] == diceArray[j])
                    count++;
            }
            if (count == 4) {

                return true;
            }
        }
        return false;
    },
    fullHouse: () => {
        countObj = {}
        for (let x of diceArray) {
            countObj[x] = (countObj[x] || 0) + 1;
        }
        let vals = Object.values(countObj);
        let keys = Object.keys(countObj);
        if ((vals[0] === 2 && vals[1] === 3) || (vals[1] === 2 && vals[0] === 3)) {
            return true;
        }
        return false;
    },
    sixHighStraight: () => {
        // if diceArr === 2,3,4,5,6. There should always be a 6, never a 1 and every dice should be different
        if (diceArray.includes(2) && diceArray.includes(3) && diceArray.includes(4) && diceArray.includes(5) && diceArray.includes(6)) {
            return true;
        }
        return false;
    },
    fiveHighStraight: () => {
        // if diceArr === 1,2,3,4,5. There should never be a 6 and every dice should be different
        if (diceArray.includes(1) && diceArray.includes(2) && diceArray.includes(3) && diceArray.includes(4) && diceArray.includes(5)) {
            return true;
        }
        return false;
    },
    threeOfAKind: () => {
        for (let i = 0; i <= 3; i++) {
            let count = 1;
            for (let j = i + 1; j < diceArray.length; j++) {
                if (diceArray[i] == diceArray[j])
                    count++;
            }
            if (count == 3)
                return true;
        }
        return false;
    },
    twoPair: () => {
        let countObj = {}
        for (let x of diceArray) {
            countObj[x] = (countObj[x] || 0) + 1;
        }
        let vals = Object.values(countObj);
        if (vals.filter(x => x === 2).length == 2) {
            return true;
        }
        return false;
    },
    pair: () => {
        for (let i = 0; i < diceArray.length; i++) {
            let count = 1;
            for (let j = i + 1; j < diceArray.length; j++) {
                if (diceArray[i] == diceArray[j])
                    count++;
            }
            if (count == 2) {
                return true;
            }
        }
        return false;
    }
};

// Function which gets the result out of the resultLogic object
const getResult = diceArr => {
    /* 
    rank0 Nothing — five mismatched dice forming no sequence longer than four.
    rank1 Pair — two dice showing the same value.
    rank2 Two Pairs — two pairs of dice, each showing the same value.
    rank3 Three-of-a-Kind — three dice showing the same value.
    rank4 Five High Straight — dice showing values from 1 through 5, inclusive.
    rank5 Six High Straight — dice showing values from 2 through 6, inclusive.
    rank6 Full House — Pair of one value and Three-of-a-Kind of another.
    rank7 Four-of-a-Kind — four dice showing the same value.
    rank8 Five-of-a-Kind — all five dice showing the same value.
    */
    // Create an array with only the numbers
    let dice1 = diceArr[0].randomNum;
    let dice2 = diceArr[1].randomNum;
    let dice3 = diceArr[2].randomNum;
    let dice4 = diceArr[3].randomNum;
    let dice5 = diceArr[4].randomNum;
    diceArray = [];
    diceArray.push(dice1, dice2, dice3, dice4, dice5);
    // Use that array to check what result fits the current array
    if (resultLogic.fiveOfAKind()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 8;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Five of a Kind`
        } else {
            playerTwoRank = 8;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Five of a Kind`
        }
    } else if (resultLogic.fourOfAKind()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 7;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Four of a Kind`
        } else {
            playerTwoRank = 7;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Four of a Kind`
        }
    } else if (resultLogic.fullHouse()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 6;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Full House`
        } else {
            playerTwoRank = 6;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Full House`
        }
    } else if (resultLogic.sixHighStraight()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 5;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Six High Straight`
        } else {
            playerTwoRank = 5;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Six High Straight`
        }
    } else if (resultLogic.fiveHighStraight()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 4;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Five High Straight`
        } else {
            playerTwoRank = 4;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Five High Straight`
        }
    } else if (resultLogic.threeOfAKind()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 3;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Three of a Kind`
        } else {
            playerTwoRank = 3;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Three of a Kind`
        }
    } else if (resultLogic.twoPair()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 2;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Two Pair`
        } else {
            playerTwoRank = 2;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Two Pair`
        }
    } else if (resultLogic.pair()) {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 1;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: Pair`
        } else {
            playerTwoRank = 1;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: Pair`
        }
    } else {
        if (diceArr === playerOneDiceArr) {
            playerOneRank = 1;
            playerOneMaxNum = getMaxNum(diceArray);
            elements.playerOneResult.textContent = `${playerOneInput}: High Dice`
        } else {
            playerTwoRank = 1;
            playerTwoMaxNum = getMaxNum(diceArray);
            elements.playerTwoResult.textContent = `${playerTwoInput}: High Dice`
        }
    }
};

// Function which compares the result that comes from the function getResult
const checkWinner = (playerOneRank, playerTwoRank, playerOneMaxNum, playerTwoMaxNum) => {
    if (playerOneRank > playerTwoRank) {
        elements.winnerDisplay.textContent = `${playerOneInput} Wins!!!`;  
    } else if (playerTwoRank > playerOneRank) {
        elements.winnerDisplay.textContent = `${playerTwoInput} Wins!!!`;  
    } else if (playerOneRank === playerTwoRank) {
        if (playerOneMaxNum > playerTwoMaxNum) {
            elements.winnerDisplay.textContent = `${playerOneInput} Wins!!!`; 
        } else if (playerTwoMaxNum > playerOneMaxNum) {
            elements.winnerDisplay.textContent = `${playerTwoInput} Wins!!!`;  
        } else {
            elements.winnerDisplay.textContent = `${playerOneInput} and ${playerTwoInput} are tied`;
        } 
    }
};

// Function used to end a game
const gameEnd = () => {
    getResult(playerOneDiceArr);
    getResult(playerTwoDiceArr);
    checkWinner(playerOneRank, playerTwoRank, playerOneMaxNum, playerTwoMaxNum);
    gamePlaying = false;
    document.querySelector('#results-container').style.display = "block";
}

// Event listeners

// Roll dice button
// Player 1
document.querySelector('.btn-roll-p1').addEventListener('click', () => {
    if (gamePlaying === true && activePlayer === 0) {
        // first roll
        if (playerOneDiceArr.length === 0) {
            playerOneDiceArr.push(
                playerOneDice1 = new Dice(calcRandomNum(), false),
                playerOneDice2 = new Dice(calcRandomNum(), false),
                playerOneDice3 = new Dice(calcRandomNum(), false),
                playerOneDice4 = new Dice(calcRandomNum(), false),
                playerOneDice5 = new Dice(calcRandomNum(), false)
            )
            // Display the results
            for (i = 0; i < playerOneDiceArr.length; i++) {
                displayDice('p1', i + 1, playerOneDiceArr);
            }
            // Decrease amount of turns left
            turns -= 1;
            elements.playerOneTurnsLeft.innerHTML = '';
            elements.playerOneTurnsLeft.insertAdjacentHTML('afterbegin', `<span id="p1-turns-left">${turns}</span>`);
            // Show next button
            document.querySelector('.btn-next-p1').style.display = 'block';
            // second and third roll
        } else if (playerOneDiceArr.length !== 0 && turns > 0) {
            turns -= 1;
            elements.playerOneTurnsLeft.innerHTML = '';
            elements.playerOneTurnsLeft.insertAdjacentHTML('afterbegin', `<span id="p1-turns-left">${turns}</span>`);
            for (i = 0; i < playerOneDiceArr.length; i++) {
                // check if player wants to reroll dice (is it being held or not?)
                if (playerOneDiceArr[i].hold === false) {
                    playerOneDiceArr[i] = new Dice(calcRandomNum(), false);
                    let diceDOM = document.querySelector(`.p1_position_${i + 1}`);
                    diceDOM.style.display = 'block';
                    diceDOM.src = './img/dice-' + playerOneDiceArr[i].randomNum + '.png';
                } else {
                    // Do nothing
                }
            }
        } else if (turns === 0) {
            round === 0 ? round = 1 : round = 2;
            if (round > 1) {
                gameEnd();
            } else {
                activePlayer = 1;
                changeActivePlayer();
            }
        }
    }
});

// Player 2
document.querySelector('.btn-roll-p2').addEventListener('click', () => {
    if (gamePlaying === true && activePlayer === 1) {
        // first roll
        if (playerTwoDiceArr.length === 0) {
            playerTwoDiceArr.push(
                playerTwoDice1 = new Dice(calcRandomNum(), false),
                playerTwoDice2 = new Dice(calcRandomNum(), false),
                playerTwoDice3 = new Dice(calcRandomNum(), false),
                playerTwoDice4 = new Dice(calcRandomNum(), false),
                playerTwoDice5 = new Dice(calcRandomNum(), false)
            )
            // Display the results
            for (i = 0; i < playerTwoDiceArr.length; i++) {
                displayDice('p2', i + 1, playerTwoDiceArr);
            }
            // Decrease amount of turns left
            turns -= 1;
            elements.playerTwoTurnsLeft.innerHTML = '';
            elements.playerTwoTurnsLeft.insertAdjacentHTML('afterbegin', `<span id="p2-turns-left">${turns}</span>`);
            // Show next button
            document.querySelector('.btn-next-p2').style.display = 'block';
            // second and third roll
        } else if (playerTwoDiceArr.length !== 0 && turns > 0) {
            turns -= 1;
            elements.playerTwoTurnsLeft.innerHTML = '';
            elements.playerTwoTurnsLeft.insertAdjacentHTML('afterbegin', `<span id="p2-turns-left">${turns}</span>`);
            for (i = 0; i < playerTwoDiceArr.length; i++) {
                // check if player wants to reroll dice (is it being held or not?)
                if (playerTwoDiceArr[i].hold === false) {
                    playerTwoDiceArr[i] = new Dice(calcRandomNum(), false);
                    let diceDOM = document.querySelector(`.p2_position_${i + 1}`);
                    diceDOM.style.display = 'block';
                    diceDOM.src = './img/dice-' + playerTwoDiceArr[i].randomNum + '.png';
                } else {
                    // Do nothing
                }
            }
        } else if (turns === 0) {
            round === 0 ? round = 1 : round = 2;
            if (round > 1) {
                gameEnd();
            } else {
                activePlayer = 0;
                changeActivePlayer();
            }
        }
    }
});

// Hold dice buttons

// Player 1
document.querySelector('.p1_position_1').addEventListener('click', () => {
    holdDice('p1', 1, playerOneDiceArr);
});
document.querySelector('.p1_position_2').addEventListener('click', () => {
    holdDice('p1',2, playerOneDiceArr);
});
document.querySelector('.p1_position_3').addEventListener('click', () => {
    holdDice('p1', 3, playerOneDiceArr);
});
document.querySelector('.p1_position_4').addEventListener('click', () => {
    holdDice('p1', 4, playerOneDiceArr);
});
document.querySelector('.p1_position_5').addEventListener('click', () => {
    holdDice('p1', 5, playerOneDiceArr);
});

// Player 2
document.querySelector('.p2_position_1').addEventListener('click', () => {
    holdDice('p2', 1, playerTwoDiceArr);
});
document.querySelector('.p2_position_2').addEventListener('click', () => {
    holdDice('p2', 2, playerTwoDiceArr);
});
document.querySelector('.p2_position_3').addEventListener('click', () => {
    holdDice('p2', 3, playerTwoDiceArr);
});
document.querySelector('.p2_position_4').addEventListener('click', () => {
    holdDice('p2', 4, playerTwoDiceArr);
});
document.querySelector('.p2_position_5').addEventListener('click', () => {
    holdDice('p2', 5, playerTwoDiceArr);
});

// Start button
document.querySelector('.btn-start').addEventListener('click', () => {
    playerOneInput = document.querySelector('#player1-input').value;
    playerTwoInput = document.querySelector('#player2-input').value;
    // Change game state
    gamePlaying = true;
    // Randomly select first player and show activePlayer on interface
    activePlayer = Math.round(Math.random());
    changeActivePlayer();
    round = 0;
    // Add names to UI
    if (playerOneInput.length > 0 && playerTwoInput.length > 0) {
        elements.playerOneHeader.textContent = playerOneInput;
        elements.playerTwoHeader.textContent = playerTwoInput;
    } else {
        playerOneInput = 'Player 1';
        playerTwoInput = 'Player 2';
        elements.playerOneHeader.textContent = playerOneInput;
        elements.playerTwoHeader.textContent = playerTwoInput;
    }
    // Remove welcome container from UI
    document.querySelector(`#welcome-container`).style.display = 'none';
});

// Next button
document.querySelector('.btn-next-p1').addEventListener('click', () => {
    if (round === 1) {
        gameEnd();
    } else {
        activePlayer = 1;
        round += 1;
        changeActivePlayer();
    }
});

document.querySelector('.btn-next-p2').addEventListener('click', () => {
    if (round === 1) {
        gameEnd();
    } else {
        activePlayer = 0;
        round += 1;
        changeActivePlayer();
    }
});

// Help button
document.querySelector('.btn-q').addEventListener('click', () => {
    if (document.querySelector('#help').style.display !== 'none') {
        document.querySelector('#help').style.display = 'none';
    } else {
        document.querySelector('#help').style.display = 'block';
    }
});

// Play Again button
document.querySelector('.btn-again').addEventListener('click', () => {
    // Change game state
    gamePlaying = true;
    // Randomly select first player and show activePlayer on interface
    activePlayer = Math.round(Math.random());
    changeActivePlayer();
    round = 0;
    // Remove results container from UI
    document.querySelector(`#results-container`).style.display = 'none';
    // Clear dice arrays from data and UI
    for (let i = 0; i < playerOneDiceArr.length; i++) {
        let diceDOM = document.querySelector(`.p1_position_${i + 1}`);
            diceDOM.style.outline = 'none';
    };
    for (let i = 0; i < playerTwoDiceArr.length; i++) {
        let diceDOM = document.querySelector(`.p2_position_${i + 1}`);
            diceDOM.style.outline = 'none';
    };
    document.querySelector('#p1-dice-grid').style.display = 'none';
    document.querySelector('#p2-dice-grid').style.display = 'none';
    playerOneDiceArr = [];
    playerTwoDiceArr = [];
});

// New game button
document.querySelector('.btn-new').addEventListener('click', () => {
    window.location.reload();
});