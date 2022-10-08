
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

    const markSpot = (player, spotChoice) =>{
        const gameBoard = Array.from(gameBoardElement.childNodes);
        const chosenCell = gameBoard.find((cell) => spotChoice == cell);
        if(chosenCell.textContent == ""){
            player.patterns.add(chosenCell.value);
            chosenCell.textContent = player.letter;
        }
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
const PlayerFactory = function(letter){
    let patterns = new Set();
    return {
        letter,
        patterns
    }
};

const gameModule = (function(){
    // initialize players
    const firstPlayer = PlayerFactory("X");
    const secondPlayer = PlayerFactory("O");
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
            displayController.markSpot((turn == 1 ? firstPlayer:secondPlayer), cell);
            turn = 3 - turn;
            if(checkWin(firstPlayer)){
                console.log("first won");
            }
            if(checkWin(secondPlayer)){
                console.log("Second won");
            }
        })
    })
    
})();
