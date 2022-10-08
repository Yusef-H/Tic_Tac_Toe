
const displayController = (function(){
    let gameBoardElement = document.querySelector('.game-board');

    const getGameBoardElement = () =>{
        return gameBoardElement;
    }
    const renderBoard = () => {
        for(let i = 0; i < 9; i++){
            const cellElement = _createBoardCell();
            gameBoardElement.appendChild(cellElement);
        }
    };

    const markSpot = (player, spotChoice) =>{
        const gameBoard = Array.from(gameBoardElement.childNodes);
        const chosenCell = gameBoard.find((cell) => spotChoice == cell);
        if(chosenCell.textContent == ""){
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
    
    return {
        letter
    }
};

const gameModule = (function(){
    // initialize players
    const firstPlayer = PlayerFactory("X");
    const secondPlayer = PlayerFactory("O");
    // initialize gameboard
    displayController.renderBoard();
    let turn = 1;

    const _initializeListeners = () =>{
        const boardElement = displayController.getGameBoardElement();
        const boardArray = Array.from(boardElement.childNodes);
        boardArray.forEach((cell) => {
            cell.addEventListener('click', () => {
                displayController.markSpot((turn == 1 ? firstPlayer:secondPlayer), cell);
                turn = 3 - turn;
            })
        })
    }
    

    _initializeListeners();



    


})();
