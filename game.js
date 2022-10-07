
const displayController = (function(){
    let gameBoardElement = document.querySelector('.game-board');

    const renderBoard = () => {
        for(let i = 0; i < 9; i++){
            const cellElement = _createBoardCell();
            gameBoardElement.appendChild(cellElement);
            console.log("hi");

        }
    };

    const _createBoardCell = () => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        return cell;
    }

    return {
        gameBoardElement,
        renderBoard
    }
})();


const gameBoardModule = (function(){
    // Will make render board function from display controller
    displayController.renderBoard();
    gameBoard = [];

})()

const gameModule = (function(){
    // initialize players
    // initialize gameboard


})();

const playerFactory = function(){

};