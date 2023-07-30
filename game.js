
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
            chosenCell.style.fontSize = "clamp(20px, min(5vw, 5vh), 100px)"; 
            chosenCell.style.color = "black"; 
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
        if(content.includes('Has Won') || content.includes('tie')){
            headerElement.classList.add('won');
        }
        else{
            headerElement.classList.remove('won');
        }
    }

    const clearBoard = () => {
        const gameBoard = Array.from(gameBoardElement.childNodes);
        gameBoard.forEach((cell) => {
            cell.textContent = "";
            console.log(cell.tagName);
            if(cell.tagName === 'DIV'){
                cell.style.fontSize = "12px";
                cell.style.color = "brown"; 
            }
        })
    }

    const isMarked = (cellToCheck) => {
        const gameBoard = Array.from(gameBoardElement.childNodes);
        const myCell = gameBoard.find((cell) => cellToCheck == cell);
        if(myCell.textContent == "")
            return false;
        return true;
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
        isMarked,
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

    function resetGameStatus(){
        this.wins = 0;
        clearPatterns();
    }
    return {
        name,
        wins,
        letter,
        patterns,
        markSpot,
        clearPatterns,
        resetGameStatus
    }
};




const gameModule = (function(){
    const PLAYER_X = 0;
    const PLAYER_O = 1;

    const state = {
        turn: PLAYER_X,
        players: [],
        isRoundDone: true
    };

    displayController.displayHeader("Welcome to the Game!");
    displayController.renderBoard();

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        initializeGame();
    })
    
    const initializeGame = () => {
        let firstPlayerName = document.getElementById('player1').value;
        let secondPlayerName = document.getElementById('player2').value;
        document.querySelector('.modal').classList.remove('visible');
        // create players
        state.players = [PlayerFactory("X", firstPlayerName), PlayerFactory("O", secondPlayerName)]

        //display players data
        state.players.forEach((player, i) => {
            displayController.displayName(player.name, i);
            displayController.displayWins(player.wins, i);
          });
        
        state.turn = PLAYER_X;
        displayController.displayHeader("Press New Round to play")
    }
    
    const checkRoundWin = (player) =>{
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

    const restartRound = () => {
        displayController.clearBoard();
        state.players.forEach((player) => {
            player.clearPatterns();
        })
        let checkTurn = state.turn == PLAYER_O;
        showTurn();
    }

    const restartGame = () => {
        displayController.clearBoard();
        state.players.forEach((player) => {
            player.resetGameStatus();
        })
        displayController.displayWins(0, PLAYER_X);
        displayController.displayWins(0, PLAYER_O);
        displayController.displayHeader("Press New Round to play");
    }

    const showTurn = () => {
        let checkTurn = state.turn == PLAYER_O;
        displayController.displayHeader((checkTurn ?
            state.players[PLAYER_O].name :
            state.players[PLAYER_X].name) + " turn" +
            " -- Mark: " + (checkTurn ?
            "O" : "X"));
    }

    const updateWinner = (winner, playerNum) => {
        state.isRoundDone = true;
        winner.wins++;
        displayController.displayHeader(`${winner.name} Has Won This Round!`);
        displayController.displayWins(winner.wins, playerNum);
    }

    const boardElement = displayController.getGameBoardElement();
    const boardArray = Array.from(boardElement.childNodes);
    boardArray.forEach((cell) => {
        cell.addEventListener('click', () => {
            if(state.isRoundDone)
                return;
            
            if(state.turn == PLAYER_X){
                if(state.players[PLAYER_X].markSpot(cell) == true)
                   state.turn = (state.turn == PLAYER_X) ? PLAYER_O : PLAYER_X;
            }
            else{
                if(state.players[PLAYER_O].markSpot(cell) == true)
                    state.turn = (state.turn == PLAYER_X) ? PLAYER_O : PLAYER_X;
            }
            
            showTurn();
            
            if(checkRoundWin(state.players[PLAYER_X])){
                updateWinner(state.players[PLAYER_X], PLAYER_X);
                
            }
            else if(checkRoundWin(state.players[PLAYER_O])){
                updateWinner(state.players[PLAYER_O], PLAYER_O);
            }
            else if(tieCheck(state.players[PLAYER_X], state.players[PLAYER_O])){
                displayController.displayHeader("It's a tie!");
                state.isRoundDone = true;
            }

        })
    })

    const roundButton = document.querySelector('.round-btn');
    roundButton.addEventListener('click', () => {
        restartRound();
        state.isRoundDone = false;
    })

    const restartButton = document.querySelector('.restart-btn');
    restartButton.addEventListener('click', () => {
        restartGame();
        state.isRoundDone = true;
    })

})();
