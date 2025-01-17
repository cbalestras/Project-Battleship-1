import { Player } from "./player";
import { Ship } from "./ship";

// Create players
const computerPlayer = new Player('computer');
const realPlayer = new Player('real');

// Define the computer ships
const computerShips = [
    new Ship(5), // Carrier
    new Ship(4), // Battleship
    new Ship(3), // Destroyer
    new Ship(3), // Submarine
    new Ship(2)  // Patrol Boat
];

// Real player's ships
const realPlayerShips = [
    new Ship(5), // Carrier
    new Ship(4), // Battleship
    new Ship(3), // Destroyer
    new Ship(3), // Submarine
    new Ship(2)  // Patrol Boat
];

// Function to get random coordinates for a ship
const getRandomCoordinates = (shipLength) => {
    const isHorizontal = Math.random() < 0.5;
    const maxIndex = 10 - shipLength;

    let startX, startY, endX, endY;

    if (isHorizontal) {
        startX = Math.floor(Math.random() * 10);
        startY = Math.floor(Math.random() * (maxIndex + 1));
        endX = startX;
        endY = startY + shipLength - 1;
    } else {
        startX = Math.floor(Math.random() * (maxIndex + 1));
        startY = Math.floor(Math.random() * 10);
        endX = startX + shipLength - 1;
        endY = startY;
    }

    const startYAlpha = String.fromCharCode(65 + startY);
    const endYAlpha = String.fromCharCode(65 + endY);

    return [[startX, startYAlpha], [endX, endYAlpha]];
};

// Function to check if a ship can be placed at the given coordinates
const canPlaceShip = (gameBoard, startX, startYAlpha, endX, endYAlpha) => {
    const startY = startYAlpha.charCodeAt(0) - 65;
    const endY = endYAlpha.charCodeAt(0) - 65;

    if (startX === endX) { // Horizontal placement
        for (let i = startY; i <= endY; i++) {
            if (gameBoard.board[startX][i] !== 0) return false;
        }
    } else { // Vertical placement
        for (let i = startX; i <= endX; i++) {
            if (gameBoard.board[i][startY] !== 0) return false;
        }
    }
    return true;
};

// Placer function to place all ships on the board
const placeShipsOnBoard = (gameBoard, ships) => {
    ships.forEach(ship => {
        let placed = false;
        while (!placed) {
            const [[startX, startYAlpha], [endX, endYAlpha]] = getRandomCoordinates(ship.length);

            if (canPlaceShip(gameBoard, startX, startYAlpha, endX, endYAlpha)) {
                gameBoard.placeShip([startX, startYAlpha], [endX, endYAlpha], ship);
                placed = true;
            }
        }
    });
};

// Place computer ships on its board.
placeShipsOnBoard(computerPlayer.gameBoard, computerShips);
placeShipsOnBoard(realPlayer.gameBoard, realPlayerShips);

class GameDisplay {
    constructor(contentHolder, realPlayer, computerPlayer) {
        this.contentHolder = contentHolder;
        this.realPlayer = realPlayer;
        this.computerPlayer = computerPlayer;
        this.activePlayer = this.realPlayer;
        this.computerMoves = new Set();

        // Bind methods with event listners to class to keep context of this.
        this.fireAttackOnBoardHandler = this.fireAttackOnBoard.bind(this);
        this.randomizePlayerShipsHandler = this.randomizePlayerShips.bind(this);
    }

    createGrid(gridContainer) {
        const rows = 10, columns = 10;

        for (let row = 0; row < rows; row++) {
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
    
        // Correctly switch player turns
        this.activePlayer = this.activePlayer === this.realPlayer ? this.computerPlayer : this.realPlayer;
        console.log(`Active player: ${this.activePlayer.type}`);
    
        const playerGrid = document.querySelector('.player-one-board');
        const computerGrid = document.querySelector('.player-two-board');
    
        if (this.activePlayer.type === 'real') {
            // Player should attack the computer's grid
            computerGrid.addEventListener('click', this.fireAttackOnBoardHandler);
            playerGrid.removeEventListener('click', this.fireAttackOnBoardHandler);
        } else {
            // Disable player's click during the computer's turn
            computerGrid.removeEventListener('click', this.fireAttackOnBoardHandler);
            playerGrid.removeEventListener('click', this.fireAttackOnBoardHandler);
    
            // Automate computer's move after a short delay
            setTimeout(() => {
                this.computerMove();
            }, 500);
        }
    
        this.updateActivePlayer(this.activePlayer);
    }
    
    computerMove() {
        let randomIndex;
    
        // Keep generating a new move until an unused spot is found
        do {
            randomIndex = Math.floor(Math.random() * 100);
        } while (this.computerMoves.has(randomIndex));
    
        // Record this move to prevent repeating it
        this.computerMoves.add(randomIndex);
    
        const row = Math.floor(randomIndex / 10);
        const column = randomIndex % 10;
        const [hitXCoordinate, hitYCoordinate] = [row, this.indexToAlphabet(column)];
    
        // Perform the attack
        let winStatus = this.dropAttackOnBoard('player-one-board', [hitXCoordinate, hitYCoordinate]);
    
        // Update the UI
        const gridBoxOne = document.querySelector('.player-one-board');
        const slot = gridBoxOne.children[randomIndex];
        this.updateBoardOnUI('player-one-board', randomIndex, slot);
    
        // Check for wins or switch turns
        if (winStatus) {
            this.endGame('player-one-board');
        } else {
            this.switchPlayerTurn();
        }
    }  
    
    showPlayerRealPlayerShipPlacement() {
        const gridBoxOne = document.querySelector('.player-one-board');
        const flatBoard = this.realPlayer.gameBoard.board.flat();

        // Clear existing UI
        Array.from(gridBoxOne.children).forEach(cell => cell.style.backgroundColor = '');

        // Update UI with ship placements
        flatBoard.forEach((cellValue, index) => {
            if (cellValue === 1) {
                gridBoxOne.children[index].style.backgroundColor = 'green'; // Use green to show ships
            }
        });
    }

    randomizePlayerShips() {
        // Clear the board first
        this.realPlayer.gameBoard.board = Array.from({ length: 10 }, () => Array(10).fill(0));
        this.realPlayer.gameBoard.shipsHeld = [];

        // Place ships randomly
        placeShipsOnBoard(this.realPlayer.gameBoard, realPlayerShips);

        // Update the UI to reflect the new placements
        this.showPlayerRealPlayerShipPlacement();
    }
       
    startGame() {
        // Allow real player to fire moves on computer grid.
        const gridBoxTwo = document.querySelector('.player-two-board');
        gridBoxTwo.addEventListener('click', this.fireAttackOnBoardHandler);

        // Remove display for real player ships.
        const gridBoxOne = document.querySelector('.player-one-board');
        Array.from(gridBoxOne.children).forEach(cell => {
            cell.style.backgroundColor = 'rgb(23, 23, 23)'; // Reset to the desired color
        })

        // Remove randomize and play buttons.
        const randomizeButton = document.getElementById('randomizeButton');
        const playButton = document.getElementById('playButton');
        
        if (randomizeButton) randomizeButton.remove();
        if (playButton) playButton.remove();
    }

    showEndGamePopup(winner) {
        // Create the popup container
        const popup = document.createElement('div');
        popup.classList.add('popup');
    
        // Create the popup content
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
    
        // Create the winner message
        const winnerMessage = document.createElement('p');
        winnerMessage.textContent = `${winner} Win!`;
    
        // Create the restart button
        const restartButton = document.createElement('button');
        restartButton.classList.add('restart');
        restartButton.textContent = 'Restart Game';
        restartButton.addEventListener('click', () => {
            location.reload(); // Refresh the page to restart the game
        });
    
        // Append elements to the popup content
        popupContent.appendChild(winnerMessage);
        popupContent.appendChild(restartButton);
    
        // Append popup content to the popup container
        popup.appendChild(popupContent);
    
        // Append the popup to the body
        document.body.appendChild(popup);
    
        // Style the popup (you can adjust these styles as needed)
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'green';
        popup.style.border = '2px solid azure';
        popup.style.borderRadius = '5px';
        popup.style.padding = '10px 20px';
        popup.style.zIndex = '1000';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popupContent.style.textAlign = 'center';
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
        // Determine winner and show popup
        const winner = hitPlayerBoard === 'player-one-board' ? 'Computer' : 'You';
        this.showEndGamePopup(winner);
    }    
       
}

// Get UI Element for game control.
const gameSpace = document.querySelector('.game-space');

// initialize game controller.
const gameDisplay = new GameDisplay(gameSpace, realPlayer, computerPlayer);
gameDisplay.createPlayerGrids();
gameDisplay.showPlayerRealPlayerShipPlacement();

// Event listener for the randomize button
document.getElementById('randomizeButton').addEventListener('click', gameDisplay.randomizePlayerShipsHandler);

// Event listener for the play button
document.getElementById('playButton').addEventListener('click', () => {
    gameDisplay.startGame();
});

export { gameDisplay };