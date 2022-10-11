
const displayController = (function(){
    let gameBoardElement = document.querySelector('.game-board');

    const getGameBoardElement = () =>{
        return gameBoardElement;
    }
    const renderBoard = () => {
        for(let i = 0; i < 9; i++){
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
        }    
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
    const firstPlayer = PlayerFactory("X", "Yusef");
    const secondPlayer = PlayerFactory("O", "Halabi");
    displayController.displayName(firstPlayer.name, 1);
    displayController.displayName(secondPlayer.name, 2);
    displayController.displayWins(firstPlayer.wins, 1);
    displayController.displayWins(secondPlayer.wins, 2);
    
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

    const restartGame = () => {
        displayController.clearBoard();
        firstPlayer.clearPatterns();
        secondPlayer.clearPatterns();
        
    }

    const boardElement = displayController.getGameBoardElement();
    const boardArray = Array.from(boardElement.childNodes);
    let endFlag = false;
    boardArray.forEach((cell) => {
        cell.addEventListener('click', () => {
            if(turn == 1 && endFlag == false)
                firstPlayer.markSpot(cell);
            else if(endFlag == false)
                secondPlayer.markSpot(cell);
            
            turn = 3 - turn;
            if(checkWin(firstPlayer) && endFlag == false){
                endFlag = true;
                firstPlayer.wins++;
                displayController.displayHeader(`${firstPlayer.name} Has Won This Round!`);
                displayController.displayWins(firstPlayer.wins, 1);
                
            }
            if(checkWin(secondPlayer) && endFlag == false){
                endFlag = true;
                secondPlayer.wins++;
                displayController.displayHeader(`${secondPlayer.name} Has Won This Round!`);
                displayController.displayWins(secondPlayer.wins, 2);
            }
            console.log(firstPlayer.patterns);
        })
    })

    const restartButton = document.querySelector('.restart-btn');
    restartButton.addEventListener('click', () => {
        restartGame();
        endFlag = false;
    })
    
})();
