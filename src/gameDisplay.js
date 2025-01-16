import { Player } from "./player";
import { Ship } from "./ship";

// Create players
const computerPlayer = new Player('computer');
const realPlayer = new Player('real');

// Create ships for each player
// Computer ships
const computerCarrier = new Ship(5),
    computerBattleship = new Ship(4),
    computerDestroyer = new Ship(3),
    computerSubmarine = new Ship(3),
    computerPatrolBoat = new Ship(2);

// Real player's ships
const realPlayerCarrier = new Ship(5),
    realPlayerBattleship = new Ship(4),
    realPlayerDestroyer = new Ship(3),
    realPlayerSubmarine = new Ship(3),
    realPlayerPatrolBoat = new Ship(2);

// Place computer's ships on board
computerPlayer.gameBoard.placeShip([0, 'A'], [0, 'E'], computerCarrier);
computerPlayer.gameBoard.placeShip([2, 'B'], [2, 'E'], computerBattleship);
computerPlayer.gameBoard.placeShip([4, 'C'], [4, 'E'], computerDestroyer);
computerPlayer.gameBoard.placeShip([6, 'D'], [6, 'F'], computerSubmarine);
computerPlayer.gameBoard.placeShip([8, 'E'], [8, 'F'], computerPatrolBoat);

// Place Real player's ships on board
realPlayer.gameBoard.placeShip([1, 'A'], [1, 'E'], realPlayerCarrier);
realPlayer.gameBoard.placeShip([3, 'B'], [3, 'E'], realPlayerBattleship);
realPlayer.gameBoard.placeShip([5, 'C'], [5, 'E'], realPlayerDestroyer);
realPlayer.gameBoard.placeShip([7, 'D'], [7, 'F'], realPlayerSubmarine);
realPlayer.gameBoard.placeShip([9, 'E'], [9, 'F'], realPlayerPatrolBoat);

class GameDisplay {
    constructor(contentHolder, realPlayer, computerPlayer) {
        this.contentHolder = contentHolder;
        this.realPlayer = realPlayer;
        this.computerPlayer = computerPlayer;
        this.activePlayer = this.realPlayer;

        // Bind the fireAttackOnBoard method
        this.fireAttackOnBoardHandler = this.fireAttackOnBoard.bind(this);
    }

    createGrid(gridContainer) {
        const rows = 10, columns = 10;

        for (let row = 0; row <rows; row++) {
            for (let column = 0; column < columns; column++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                gridContainer.appendChild(cell);
            }
        }
    }

    createPlayerGrids() {
        // Get UI Elements.
        const gridBoxOne = document.querySelector('.player-one-board'); 
        const gridBoxTwo = document.querySelector('.player-two-board');
        const activeplayerIndicator = document.querySelector('.updates p');

        // Create grids and indicate first player.
        this.createGrid(gridBoxOne);
        this.createGrid(gridBoxTwo);
        activeplayerIndicator.textContent = `Your turn`;
    }

    updateActivePlayer(activeplayer) {
        const activeplayerType = activeplayer.type;
        // Text indicator update
        const activeplayerIndicator = document.querySelector('.updates p');
        activeplayerIndicator.textContent = '';
        
        switch (activeplayerType) {
            case 'computer': 
                activeplayerIndicator.textContent = 'Computer\'s turn';
                break;
            case 'real':
                activeplayerIndicator.textContent = 'Your turn';
                break;
            default: 
                activeplayerIndicator.textContent = 'Unknown player type';
        }
    }

    fireAttackOnBoard(event) {
        if (event.target.classList.contains('cell')) {
            const slot = event.target;
            if (slot.textContent !== '') return; // Prevent human player from firing a hit slot.
            const hitPlayerBoard = slot.parentNode.getAttribute('class');
            const index = [...slot.parentNode.children].indexOf(slot);
            const row = Math.floor(index / 10);
            const column = index % 10;
    
            const [hitXCoordinate, hitYCoordinate] = [row, this.indexToAlphabet(column)];
            // console.log(`Firing at: [${hitXCoordinate}, '${hitYCoordinate}'] on ${hitPlayerBoard}`);
    
            // Drop attack on board
            let winStatus = this.dropAttackOnBoard(hitPlayerBoard, [hitXCoordinate, hitYCoordinate]);
            this.updateBoardOnUI(hitPlayerBoard, index, slot);
    
            // Check for winner
            if (winStatus) {
                console.log("Win condition met!");
                this.endGame(hitPlayerBoard);
            } else {
                // Switch player turns if no winner.
                this.switchPlayerTurn();
            }
        }
    }    

    dropAttackOnBoard(hitPlayerBoard, [targetXCoordinate, targetYCoordinate]) {
        let winStatus = undefined;

        // Handle hits made to computer board.
        if (hitPlayerBoard === 'player-two-board') {
            let attackStatus = this.computerPlayer.gameBoard.receiveAttack([targetXCoordinate, targetYCoordinate]);
            if (attackStatus) winStatus = this.computerPlayer.gameBoard.overallShipSinkStatus();
        }

        // Handle hits made to real player board.
        if (hitPlayerBoard === 'player-one-board') {
            let attackStatus = this.realPlayer.gameBoard.receiveAttack([targetXCoordinate, targetYCoordinate]);
            if (attackStatus) winStatus = this.realPlayer.gameBoard.overallShipSinkStatus();
        }

        return winStatus;
    }

    updateBoardOnUI(hitPlayerBoard, hitSlotIndex, hitSlot) {
        // Update computer's board
        if (hitPlayerBoard === 'player-two-board') {
            const computerLogicBoardCopy = this.computerPlayer.gameBoard.board.slice().flat();
            const updateSymbol = computerLogicBoardCopy[hitSlotIndex];
            hitSlot.textContent = updateSymbol;
        }

        // Update real player's board
        if (hitPlayerBoard === 'player-one-board') {
            const realPlayerLogicBoardCopy = this.realPlayer.gameBoard.board.slice().flat();
            const updateSymbol = realPlayerLogicBoardCopy[hitSlotIndex];
            hitSlot.textContent = updateSymbol;
        }
    }
    
    indexToAlphabet(index) {
        const alphas = Array.from(Array(10)).map((e, i) => i + 65);
        const alphabets = alphas.map((x) => String.fromCharCode(x));
        return alphabets[index];
    }

    // Method to swap player turns.
    switchPlayerTurn() {
        console.log(`Old player: ${this.activePlayer.type}`);
    
        // Switch active player
        this.activePlayer = this.activePlayer === this.realPlayer ? this.computerPlayer : this.realPlayer;
        console.log(`Active player: ${this.activePlayer.type}`);
    
        const gridBoxOne = document.querySelector('.player-one-board');
        const gridBoxTwo = document.querySelector('.player-two-board');
    
        // Reset event listeners to avoid stacking
        gridBoxOne.removeEventListener('click', this.fireAttackOnBoardHandler);
        gridBoxTwo.removeEventListener('click', this.fireAttackOnBoardHandler);
    
        // Enable clicks for the active player only
        if (this.activePlayer.type === 'real') {
            gridBoxTwo.addEventListener('click', this.fireAttackOnBoardHandler);  // Real player attacks computer grid
        } else {
            gridBoxOne.addEventListener('click', this.fireAttackOnBoardHandler);  // Computer (simulated) attacks real player's grid
        }
    
        // Update turn indicator
        this.updateActivePlayer(this.activePlayer);
    }
       
    startGame() {
        const gridBoxTwo = document.querySelector('.player-two-board');
        gridBoxTwo.addEventListener('click', this.fireAttackOnBoardHandler);
    }
    
    endGame(hitPlayerBoard) {
        console.log("Game ends...");
        const gridBoxOne = document.querySelector('.player-one-board');
        const gridBoxTwo = document.querySelector('.player-two-board');
        const activeplayerIndicator = document.querySelector('.updates p');
    
        // Correctly remove event listeners
        gridBoxOne.removeEventListener('click', this.fireAttackOnBoardHandler);
        gridBoxTwo.removeEventListener('click', this.fireAttackOnBoardHandler);
    
        activeplayerIndicator.textContent = hitPlayerBoard === 'player-one-board' 
            ? 'Computer Wins!' 
            : 'You win!';
    }    
       
}

// Get UI Element for game control.
const gameSpace = document.querySelector('.game-space');

// initialize game controller.
const gameDisplay = new GameDisplay(gameSpace, realPlayer, computerPlayer);
gameDisplay.createPlayerGrids();
gameDisplay.startGame();

export { gameDisplay };