
const displayController = (function(){

    const BOARD_SIZE = 9;
    let gameBoardElement = document.querySelector('.game-board');
    const modal = document.querySelector('.modal');
    modal.classList.add('visible');

    const getGameBoardElement = () =>{
        return gameBoardElement;
    }
    const renderBoard = () => {
        for(let i = 0; i < BOARD_SIZE; i++){
            const cellElement = _createBoardCell();
            cellElement.value = i;
            gameBoardElement.appendChild(cellElement);
        }
    };

    const markSpot = (letter, spotChoice) =>{
        const gameBoard = Array.from(gameBoardElement.childNodes);
        const chosenCell = gameBoard.find((cell) => spotChoice == cell);
        if(chosenCell.textContent == ""){
            chosenCell.textContent = letter;
            return true;
        }
        return false;
    }

    const displayName = (name, playerNum) => {
        const nameDisplay = document.querySelector(`.player${playerNum} > .name`);
        nameDisplay.textContent = name;
    }

    const displayWins = (wins, playerNum) => {
        const winsDisplay = document.querySelector(`.player${playerNum} > .wins`);
        winsDisplay.textContent = "Wins: " + wins;
    }
    

    const displayHeader = (content) => {
        const headerElement = document.querySelector('.header');
        headerElement.textContent = content;
    }

    const clearBoard = () => {
        const gameBoard = Array.from(gameBoardElement.childNodes);
        gameBoard.forEach((cell) => {
            cell.textContent = "";
        })
    }

    const _createBoardCell = () => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        return cell;
    }

    return {
        getGameBoardElement,
        renderBoard,
        markSpot,
        displayName,
        displayHeader,
        displayWins,
        clearBoard
    }
})();

// letter is "X" or "O"
const PlayerFactory = function(letter, playerName){
    let name = playerName;
    let wins = 0;
    let patterns = new Set();
    const markSpot = (chosenCell) => {
        if(displayController.markSpot(letter, chosenCell) == true){
            patterns.add(chosenCell.value);
            return true;
        }    
        return false;
    }
    const clearPatterns = () => {
        patterns.clear();
    }
    return {
        name,
        wins,
        letter,
        patterns,
        markSpot,
        clearPatterns
    }
};

const gameModule = (function(){
    displayController.displayHeader("Welcome to the Game!");
    // initialize players
    const form = document.querySelector('form');
    let firstPlayerName;
    let secondPlayerName;
    let firstPlayer, secondPlayer;
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        firstPlayerName = document.getElementById('player1').value;
        secondPlayerName = document.getElementById('player2').value;
        document.querySelector('.modal').classList.remove('visible');
        firstPlayer = PlayerFactory("X", firstPlayerName);
        secondPlayer = PlayerFactory("O", secondPlayerName);
        displayController.displayName(firstPlayer.name, 1);
        displayController.displayName(secondPlayer.name, 2);
        displayController.displayWins(firstPlayer.wins, 1);
        displayController.displayWins(secondPlayer.wins, 2);
        displayController.displayHeader(firstPlayer.name + " turn");
    })
    
    // initialize gameboard
    displayController.renderBoard();
    let turn = 1;
    

    const checkWin = (player) =>{
        const choiceSet = player.patterns;
        if((player.patterns.has(0) && player.patterns.has(1) && player.patterns.has(2)) ||
        (player.patterns.has(3) && player.patterns.has(4) && player.patterns.has(5)) ||
        (player.patterns.has(6) && player.patterns.has(7) && player.patterns.has(8)) || 
        (player.patterns.has(0) && player.patterns.has(3) && player.patterns.has(6)) ||
        (player.patterns.has(1) && player.patterns.has(4) && player.patterns.has(7)) ||
        (player.patterns.has(2) && player.patterns.has(5) && player.patterns.has(8)) ||
        (player.patterns.has(0) && player.patterns.has(4) && player.patterns.has(8)) ||
        (player.patterns.has(2) && player.patterns.has(4) && player.patterns.has(6)) ){
            return true;
        }
        else{
            return false;
        }
    }
    const tieCheck = (firstPlayer, secondPlayer) => {
        const unionPatterns = new Set(firstPlayer.patterns);
        for(const e of secondPlayer.patterns)
            unionPatterns.add(e);
        for(let i = 0; i < 9; i++){
            if(!unionPatterns.has(i))
                return false;
        }
        return true;
    }

    const restartGame = () => {
        displayController.clearBoard();
        firstPlayer.clearPatterns();
        secondPlayer.clearPatterns();
        displayController.displayHeader("Let's play another round!")
        
    }

    const boardElement = displayController.getGameBoardElement();
    const boardArray = Array.from(boardElement.childNodes);
    let endFlag = false;
    
    boardArray.forEach((cell) => {
        cell.addEventListener('click', () => {
            if(!endFlag)
                displayController.displayHeader((turn == 1 ? firstPlayer.name : secondPlayer.name) + " turn");
            if(turn == 1 && endFlag == false){
                if(firstPlayer.markSpot(cell) == true)
                   turn = 3 - turn;
            }
            else if(endFlag == false){
                if(secondPlayer.markSpot(cell) == true)
                    turn = 3-turn;
            }
            
            if(checkWin(firstPlayer) && endFlag == false){
                endFlag = true;
                firstPlayer.wins++;
                displayController.displayHeader(`${firstPlayer.name} Has Won This Round!`);
                displayController.displayWins(firstPlayer.wins, 1);
                
            }
            else if(checkWin(secondPlayer) && endFlag == false){
                endFlag = true;
                secondPlayer.wins++;
                displayController.displayHeader(`${secondPlayer.name} Has Won This Round!`);
                displayController.displayWins(secondPlayer.wins, 2);
            }
            else if(tieCheck(firstPlayer, secondPlayer) && endFlag == false){
                displayController.displayHeader("It's a tie!");
                endFlag = true;
            }
        })
    })

    const restartButton = document.querySelector('.restart-btn');
    restartButton.addEventListener('click', () => {
        restartGame();
        endFlag = false;
    })
    
})();
