const matrixInputForm = document.getElementById('matrix-input-form');
const playInputForm = document.getElementById('play-input-form');
const resetButton = document.getElementById('reset-button');
const playSurface = document.getElementById('play-surface');
const playerTurnTitle = document.querySelector('h3');
const playerSpan1 = document.getElementById('playerNum1');
const playerSpan2 = document.getElementById('playerNum2');
const player1TallyDisplay = document.getElementById('player1TallyDisplay');
const player2TallyDisplay = document.getElementById('player2TallyDisplay');
const openBtn = document.querySelector('#openModal');
const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('#close');
const clickableLetter = document.querySelectorAll('.clickable-letter');

let connectNum = 4;
let numOfRows = 6;
let numOfColumns = 10;
let arrPlay = [];
let arrCol = [];
let arrRow = [];
let winningCells = [];
let playerMark = 1;
let relevantPlayerColor = 'red';
let playColumnNumber = 0;
let player1Tally = 0;
let player2Tally = 0;
let turnCounter = 0;
let winner = false;
let winIndex = [];

//random color function

const genRandomColor = () => {
    let red = Math.floor(Math.random()*256);
    let green = Math.floor(Math.random()* 256);
    let blue = Math.floor(Math.random()* 256);
    return `rgba(${red}, ${green}, ${blue}, 1)`
}

//clickable letters

clickableLetter.forEach((letter) => {
    letter.addEventListener('click', (ev) => {
        let randNum = Math.random();
        if(randNum >= 0.88) {
            clickableLetter.forEach((letter) => {
                letter.style.color = "white";
            })
        } else if(randNum <= 0.15) {
            clickableLetter.forEach((letter) => {
                letter.style.color = `${genRandomColor()}`;
            })
        } else if(randNum > 0.15 && randNum <= 0.2) {
            clickableLetter.forEach((letter) => {
                letter.style.color = `red`;
            })
        } else if(randNum > 0.2 && randNum <= 0.3) {
            clickableLetter.forEach((letter) => {
                letter.style.color = `blue`;
            })
        } else {
            ev.currentTarget.style.color =  genRandomColor();
        }
    });
})

//modal (modal concept patterned from GA instructional materials)

const openModal = () => {
    modal.style.display = 'block';
}

const closeModal = () => {
    modal.style.display = 'none';
}

openBtn.addEventListener('click', openModal);

closeBtn.addEventListener('click', closeModal);


//sounds

//reference: https://www.youtube.com/watch?v=eRTe4uaiSpc
//drop mp3 sounds from https://freesound.org/people/discokingmusic/sounds/271387/ 

const playSound = () => {
    let randNum = Math.floor(Math.random()*3)+1;
    let audioSource = `./sound/drop${randNum}.mp3`;
    let audio = document.createElement('audio');
    audio.src = audioSource;
    audio.volume = 0.5;
    audio.play();
}

playSurface.addEventListener('click', () => playSound());

//new game function

const newGame = () => {
    playSurface.innerText = '';
    arrPlay = [];
    playerMark = 1;
    relevantPlayerColor = 'red';
    connectNum = 4;
    numOfRows = 6;
    numOfColumns = 10;
    genPlayingArray();
    turnCounter = 0;
    winner = false;
    playerSpan1.style.opacity = '100%';
    playerSpan2.style.opacity = '30%';
    document.querySelector('h1').innerText = `connect ${connectNum}`
    winIndex = [];

}

// reset button
resetButton.onclick = () => {
    newGame();
    player1Tally = 0;
    player2Tally = 0;
    player1TallyDisplay.innerText = player1Tally;
    player2TallyDisplay.innerText = player2Tally;
}

// turn counter
let nextTurn = () => {
    turnCounter++;
    if(turnCounter === numOfColumns*numOfRows && winner !== true){
        swal('Tie!', 'No one managed to win. Play again?', 'warning', {buttons: ['No thanks', 'Yes!']})
            .then((value) => {
                if(value===true) {
                setTimeout(newGame, 3000);
                }
            });
        return;
    }
}
//Event listener to submit matrix size
matrixInputForm.onsubmit = (e) => {
    e.preventDefault();
    numOfRows = parseInt(document.getElementById('row-input-box').value);
    numOfColumns = parseInt(document.getElementById('column-input-box').value);
    connectNum = parseInt(document.getElementById('connect-number-input-box').value);
    document.querySelector('h1').innerText = `connect ${connectNum}`
    genPlayingArray();
}

//function to get column values
const getRowVals = (rowNumber) => {
    arrRow = [];
    for (let i = 0; i < numOfColumns; i++) {
       arrRow.push(arrPlay[i][rowNumber]);
    }
    return arrRow;
}

//Generate Playing Array, Draw Board, background token slide container
const genPlayingArray = () => {
    playerMark = 1;
    arrPlay = [];
    playSurface.innerText = '';
    playSurface.style.width = `${125* numOfColumns}px`;

    for (let i = 0; i < numOfColumns; i++) {
        arrCol = [];
        let newCol = document.createElement('div');
        newCol.classList.add('column');
        newCol.setAttribute('id', `col${i}`);
        newCol.addEventListener('click', () => {
            playColumnNumber = i;
            setTimeout(makePlay, 400);
        })

        for (let j = 0; j < numOfRows; j++) {
            arrCol.push(0);
            let newCell = document.createElement('div');
            newCell.classList.add('cell');
            newCell.classList.add(`row${j}`);
            newCell.setAttribute('id', `col${i}cell${j}`);
            newCell.addEventListener('click', () => {
            return true});
            newCol.prepend(newCell);
        }
        arrPlay.push(arrCol);
        playSurface.appendChild(newCol);
    }

}

// function get random reddish hue

const randomRed = () => {
    let red = Math.floor(Math.random()*56) + 200;
    let green = Math.floor(Math.random()* 50);
    let blue = Math.floor(Math.random()* 50);
    return `rgba(${red}, ${green}, ${blue}, 1)`
}

const randomBlue = () => {
    let blue = Math.floor(Math.random()*56) + 200;
    let green = Math.floor(Math.random()* 100);
    let red = Math.floor(Math.random()* 50);
    return `rgba(${red}, ${green}, ${blue}, 1)`
}

//Function to swap player marks between moves

const swapPlayers = () => {
    if (playerMark === 1) {
        relevantPlayerColor = randomBlue();
        playerSpan2.style.color = relevantPlayerColor;
        playerSpan1.style.opacity = "30%";
        playerSpan2.style.opacity = "100%";
    } else {
        relevantPlayerColor = randomRed();
        playerSpan1.style.color = relevantPlayerColor;
        playerSpan2.style.opacity = "30%";
        playerSpan1.style.opacity = "100%";
    }
    playerMark *= -1;
}

// Play-mechanic--let Player 1's move be marked by '1' and Player 2's moves be marked by '-1'

const makePlay = () => {
    let columnValues = arrPlay[playColumnNumber];
    if(columnValues[columnValues.length-1] === 0) {
        let rowIndex = columnValues.indexOf(0);
        arrPlay[playColumnNumber][rowIndex] = playerMark;
        let subjCell = document.getElementById(`col${playColumnNumber}cell${rowIndex}`);
        subjCell.style.cssText = `background-color: ${relevantPlayerColor}; background-image: var(--background-image);`;
        scanForWin();
        nextTurn();
        swapPlayers();
    } else if(winner !== true) {
        swal('Whoops!','Try again! This column is full.','warning', {button: 'Try again'});
    }
}

// Win Scan Functions

//audio source: https://freesound.org/people/MattLeschuck/sounds/511484/
const playVictorySound = () => {
    let audioSource = `./sound/success.wav`;
    let audio = document.createElement('audio');
    audio.src = audioSource;
    audio.volume = 0.5;
    audio.play();
}

const tallyWin = (player) => {
    switch (player) {
        case 'Player 1':
            player1Tally ++;
            player1TallyDisplay.innerText = player1Tally;
        break;
        case 'Player 2':
            player2Tally ++;
            player2TallyDisplay.innerText = player2Tally;
        break;
    }

}
    
const victoryPrompt = (victor) => {
    playVictorySound();
    swal(`Victory!`, `Congratulations, ${victor} has won! \nPlay Again?`, 'success', {buttons: ['No thanks', 'Yes!']})
        .then((value) => {
            if(value===true) {
            setTimeout(newGame, 3000);
            }
        });
    return;
}

const processVictory = () => {
        let victor = '';
        if(playerMark === 1 && winner !==true){
            victor = 'Player 1';
            tallyWin('Player 1');
            winner = true;
            victoryPrompt(victor);
        } else if(playerMark === -1 && winner!==true){
            victor = 'Player 2';
            tallyWin('Player 2')
            winner = true;
            victoryPrompt(victor);
        }    
        return;
};

const scanForWin = () => {
    if(winner === false){
        if(scanRows() === true){
            for(let i = 0; i < connectNum; i++){
                let rowCell = document.getElementById(`col${winIndex[0] + i}cell${winIndex[1]}`);
                let addCell = () => {
                rowCell.style.backgroundColor = 'white';
                }
                setTimeout(addCell, 500 + 500*i);
            } 
            processVictory();
        } else if (scanColumns() === true) {
            for(let i = 0; i < connectNum; i++){
                let colCell = document.getElementById(`col${winIndex[0]}cell${winIndex[1]+i}`);
                let addCell = () => {
                colCell.style.backgroundColor ='white';
                }
                setTimeout(addCell, 500 + 500*i);
            }
            processVictory();
        } else if (scanForwardDiagonals() === true) {
            for(let i = 0; i < connectNum; i++){
                let fwdDiagCell = document.getElementById(`col${winIndex[0][0]+i}cell${winIndex[0][1]+i}`);
                let addCell = () => {
                fwdDiagCell.style.backgroundColor = 'white';
                }
                setTimeout(addCell, 500 + 500*i);
            }
            processVictory();
        } else if (scanBackwardDiagonals() === true) {
            for(let i = 0; i < connectNum; i++){
                let bwdDiagCell = document.getElementById(`col${winIndex[0][0]+i}cell${winIndex[0][1]-i}`);
                let addCell = () => {
                bwdDiagCell.style.backgroundColor = 'white';
                }
                setTimeout(addCell, 500 + 500*i);
            }
            processVictory();
        }
    }
    
}

//Row Scan Function

const scanRows = () => {
    
    let arrOfRows = [];

    for (let i = 0; i < numOfRows; i++) {
        RowSlice = getRowVals(i);
        arrOfRows.push(RowSlice);
    }
    
    let equalConnectNum = (index, row, rowIndex) => {
        let sum = 0;
        let cellIndex = index;
        for(let i = 0; i < connectNum; i++) {
            sum += row[cellIndex + i];
        }
        if(Math.abs(sum) === connectNum) {   
            winIndex.push(cellIndex, rowIndex);
            return true;
        };
    }

    let enoughInARow = arrOfRows.some((row, rowIndex) => {
        return row.some((cell, index) => {
            return equalConnectNum(index, row, rowIndex);
        })
    })
    
    if(enoughInARow) {
        return true
    }

}

//Column Scan Function

const scanColumns = () => {

    let equalConnectNum = (index, column, colIndex) => {
        let sum = 0;
        let cellIndex = index;
        for(let i = 0; i < connectNum; i++) {
            sum += column[cellIndex + i]
        }
        if(Math.abs(sum) === connectNum) {
            winIndex.push(colIndex, index)
            return true;
        };
    }

    let enoughInAColumn = arrPlay.some((column, colIndex) => {
        return column.some((cell, index) => {
            return equalConnectNum(index, column, colIndex);
        })
    })
    
    if(enoughInAColumn) {
        return true;
    }
}

//Diagonal Scan Function

const scanForwardDiagonals = () => {

    let arrForwardDiagonals = [];
    let indexTracker = [];

    const genForwardDiagonals = () => {
        indexTracker = [];
        for(let i = 0; i < numOfColumns; i++) {
            for(let j = 0; j < numOfRows; j++) {
               //forward diagonals
                let newForwardDiag = [];
                let indexTrackerLine = [];
                let k = 0;
                while ((i + k < numOfColumns) && (j + k < numOfRows)) {
                    newForwardDiag.push(arrPlay[i+k][j+k]);
                    let orderedPair = [(i+k), (j+k)];
                    indexTrackerLine.push(orderedPair);
                    k++;
                }
                indexTracker.push(indexTrackerLine);
                arrForwardDiagonals.push(newForwardDiag);
                               
            }
        }
    }

    genForwardDiagonals();

    let equalConnectNum = (index, fwdDiagonal, fwdDiagonalIndex) => {
        let sum = 0;
        let cellIndex = index;
        for(i = 0; i < connectNum; i++) {
            sum += fwdDiagonal[cellIndex + i]
        }
        if(Math.abs(sum) === connectNum) {
            winIndex.push(indexTracker[fwdDiagonalIndex][index]);
            return true;
        };
    }

    let enoughInADiagonal = arrForwardDiagonals.some((fwdDiagonal, fwdDiagonalIndex) => {
        return fwdDiagonal.some((cell, index) => {
            return equalConnectNum(index, fwdDiagonal, fwdDiagonalIndex);
        })
    })
    
    if(enoughInADiagonal) {
        return true;
    }
}

//Scan Backward Diagonals
const scanBackwardDiagonals = () => {

    let arrBackwardDiagonals = [];
    let indexTracker = [];

    const genBackwardDiagonals = () => {
        indexTracker = [];
        for(let i = 0; i < numOfColumns; i++) {
            for(let j = 0; j < numOfRows; j++) {
               //backward diagonals
               let newBackwardDiag = [];
               let indexTrackerLine = [];
               let p = 0;
               while ((i + p < numOfColumns) && (j - p >= 0)) {
                   newBackwardDiag.push(arrPlay[i + p][j - p]);
                   let orderedPair = [(i + p), (j - p)];
                   indexTrackerLine.push(orderedPair);
                   p++;
               }
               indexTracker.push(indexTrackerLine);
               arrBackwardDiagonals.push(newBackwardDiag);
            }   
           
        }
     }
    

    genBackwardDiagonals();

    let equalConnectNum = (index, bwdDiagonal, bwdDiagonalIndex) => {
        let sum = 0;
        let cellIndex = index;
        for(i = 0; i < connectNum; i++) {
            sum += bwdDiagonal[cellIndex + i]
        }
        if(Math.abs(sum) === connectNum) {
            winIndex.push(IndexTracker[bwdDiagonalIndex][index]);
            return true;
        };
    }

    let enoughInADiagonal = arrBackwardDiagonals.some((bwdDiagonal, bwdDiagonalIndex) => {
        return bwdDiagonal.some((cell, index) => {
            return equalConnectNum(index, bwdDiagonal, bwdDiagonalIndex);
        })
    })
    
    if(enoughInADiagonal) {
        return true;
    }
}

//Start
newGame();