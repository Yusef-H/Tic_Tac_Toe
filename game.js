
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

    const _createBoardCell = () => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        return cell;
    }

   

    return {
        getGameBoardElement,
        renderBoard,
        markSpot
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
    return {
        name,
        wins,
        letter,
        patterns,
        markSpot
    }
};

const gameModule = (function(){
    // initialize players
    const firstPlayer = PlayerFactory("X", "yusef");
    const secondPlayer = PlayerFactory("O", "halabi");
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

    const boardElement = displayController.getGameBoardElement();
    const boardArray = Array.from(boardElement.childNodes);
    boardArray.forEach((cell) => {
        cell.addEventListener('click', () => {
            if(turn == 1)
                firstPlayer.markSpot(cell);
            else
                secondPlayer.markSpot(cell);
            
            turn = 3 - turn;
            if(checkWin(firstPlayer)){
                console.log("first won");
                firstPlayer.wins++;

            }
            console.log(firstPlayer.wins);
            if(checkWin(secondPlayer)){
                console.log("Second won");
            }
        })
    })
    
})();
