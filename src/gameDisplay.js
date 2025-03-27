import { Player } from "./player";
import { Ship } from "./ship";

// Create players
const computerPlayer = new Player('computer');
const realPlayer = new Player('real');

// Map to track ship positions and hit status
const shipPositions = {
    computerShips: new Map(),
    playerShips: new Map()
};

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

// Helper function to track ship positions
const trackShipPosition = (ship, startX, startYAlpha, endX, endYAlpha, isComputer) => {
    const startY = startYAlpha.charCodeAt(0) - 65;
    const endY = endYAlpha.charCodeAt(0) - 65;
    const positions = [];
    
    if (startX === endX) { // Horizontal
        for (let i = 0; i < ship.length; i++) {
            const cellIndex = startX * 10 + (startY + i);
            positions.push(cellIndex);
        }
    } else { // Vertical
        for (let i = 0; i < ship.length; i++) {
            const cellIndex = (startX + i) * 10 + startY;
            positions.push(cellIndex);
        }
    }
    
    // Store in the shipPositions map
    const mapToUse = isComputer ? shipPositions.computerShips : shipPositions.playerShips;
    const shipId = `ship_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    mapToUse.set(shipId, {
        positions: positions,
        hits: new Set(),
        length: ship.length,
        isSunk: false
    });
    
    return shipId;
};

// Function to check if a ship is sunk
const checkIfShipSunk = (shipId, hitIndex, isComputer) => {
    const mapToUse = isComputer ? shipPositions.computerShips : shipPositions.playerShips;
    const ship = mapToUse.get(shipId);
    
    if (!ship) return false;
    
    // Add this hit
    ship.hits.add(hitIndex);
    
    // Check if all positions are hit
    const isSunk = ship.positions.every(pos => ship.hits.has(pos));
    
    if (isSunk && !ship.isSunk) {
        ship.isSunk = true;
        return true;
    }
    
    return false;
};

// Function to find which ship was hit
const findHitShip = (hitIndex, isComputer) => {
    const mapToUse = isComputer ? shipPositions.computerShips : shipPositions.playerShips;
    
    for (const [shipId, ship] of mapToUse.entries()) {
        if (ship.positions.includes(hitIndex) && !ship.isSunk) {
            return shipId;
        }
    }
    
    return null;
};

// Function to get all positions of a ship
const getShipPositions = (shipId, isComputer) => {
    const mapToUse = isComputer ? shipPositions.computerShips : shipPositions.playerShips;
    return mapToUse.get(shipId)?.positions || [];
};

// Placer function to place all ships on the board
const placeShipsOnBoard = (gameBoard, ships, isComputer) => {
    ships.forEach(ship => {
        let placed = false;
        while (!placed) {
            const [[startX, startYAlpha], [endX, endYAlpha]] = getRandomCoordinates(ship.length);

            if (canPlaceShip(gameBoard, startX, startYAlpha, endX, endYAlpha)) {
                gameBoard.placeShip([startX, startYAlpha], [endX, endYAlpha], ship);
                trackShipPosition(ship, startX, startYAlpha, endX, endYAlpha, isComputer);
                placed = true;
            }
        }
    });
};

// Place computer ships on its board.
placeShipsOnBoard(computerPlayer.gameBoard, computerShips, true);
placeShipsOnBoard(realPlayer.gameBoard, realPlayerShips, false);

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
    
            // Drop attack on board
            let attackResult = this.dropAttackOnBoard(hitPlayerBoard, [hitXCoordinate, hitYCoordinate]);
            this.updateBoardOnUI(hitPlayerBoard, index, slot, attackResult.isHit);
            
            // Check if a ship was hit
            if (attackResult.isHit) {
                // Find which ship was hit
                const shipId = findHitShip(index, true); // true means it's a computer ship
                
                if (shipId) {
                    // Check if the ship is now sunk
                    const isSunk = checkIfShipSunk(shipId, index, true);
                    
                    if (isSunk) {
                        // Get all positions of the ship and update their styling
                        const shipPositions = getShipPositions(shipId, true);
                        this.updateSunkShipStyling(shipPositions, hitPlayerBoard);
                        this.showSunkAnnouncement(shipPositions.length);
                    } else {
                        // Just show regular hit announcement
                        this.showHitAnnouncement(hitYCoordinate + (hitXCoordinate + 1));
                    }
                }
            }
    
            // Check for winner
            if (attackResult.winStatus) {
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
        let isHit = false;

        // Handle hits made to computer board.
        if (hitPlayerBoard === 'player-two-board') {
            let attackStatus = this.computerPlayer.gameBoard.receiveAttack([targetXCoordinate, targetYCoordinate]);
            if (attackStatus) {
                winStatus = this.computerPlayer.gameBoard.overallShipSinkStatus();
                isHit = this.computerPlayer.gameBoard.board[targetXCoordinate][targetYCoordinate.charCodeAt(0) - 65] === 'X';
            }
        }

        // Handle hits made to real player board.
        if (hitPlayerBoard === 'player-one-board') {
            let attackStatus = this.realPlayer.gameBoard.receiveAttack([targetXCoordinate, targetYCoordinate]);
            if (attackStatus) {
                winStatus = this.realPlayer.gameBoard.overallShipSinkStatus();
                isHit = this.realPlayer.gameBoard.board[targetXCoordinate][targetYCoordinate.charCodeAt(0) - 65] === 'X';
            }
        }

        return { winStatus, isHit };
    }

    updateBoardOnUI(hitPlayerBoard, hitSlotIndex, hitSlot, isHit) {
        // Update computer's board
        if (hitPlayerBoard === 'player-two-board') {
            const computerLogicBoardCopy = this.computerPlayer.gameBoard.board.slice().flat();
            const updateSymbol = computerLogicBoardCopy[hitSlotIndex];
            hitSlot.textContent = updateSymbol;
            
            // Apply appropriate styling
            if (isHit) {
                hitSlot.classList.add('hit-ship');
            } else if (updateSymbol === 'O') {
                hitSlot.classList.add('miss-hit');
            }
        }

        // Update real player's board
        if (hitPlayerBoard === 'player-one-board') {
            const realPlayerLogicBoardCopy = this.realPlayer.gameBoard.board.slice().flat();
            const updateSymbol = realPlayerLogicBoardCopy[hitSlotIndex];
            hitSlot.textContent = updateSymbol;
            
            // Apply appropriate styling
            if (isHit) {
                hitSlot.classList.add('hit-ship');
            } else if (updateSymbol === 'O') {
                hitSlot.classList.add('miss-hit');
            }
        }
    }
    
    updateSunkShipStyling(shipPositions, hitPlayerBoard) {
        const board = hitPlayerBoard === 'player-two-board' 
            ? document.querySelector('.player-two-board')
            : document.querySelector('.player-one-board');
            
        shipPositions.forEach(position => {
            const cell = board.children[position];
            cell.classList.remove('hit-ship');
            cell.classList.add('sunk-ship');
        });
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
        let attackResult = this.dropAttackOnBoard('player-one-board', [hitXCoordinate, hitYCoordinate]);
    
        // Update the UI
        const gridBoxOne = document.querySelector('.player-one-board');
        const slot = gridBoxOne.children[randomIndex];
        this.updateBoardOnUI('player-one-board', randomIndex, slot, attackResult.isHit);
        
        // Check if a ship was hit
        if (attackResult.isHit) {
            // Find which ship was hit
            const shipId = findHitShip(randomIndex, false); // false means it's a player ship
            
            if (shipId) {
                // Check if the ship is now sunk
                const isSunk = checkIfShipSunk(shipId, randomIndex, false);
                
                if (isSunk) {
                    // Get all positions of the ship and update their styling
                    const shipPositions = getShipPositions(shipId, false);
                    this.updateSunkShipStyling(shipPositions, 'player-one-board');
                    this.showSunkAnnouncement(shipPositions.length, true);
                } else {
                    // Just show regular hit announcement
                    this.showHitAnnouncement(hitYCoordinate + (hitXCoordinate + 1), true);
                }
            }
        }
    
        // Check for wins or switch turns
        if (attackResult.winStatus) {
            this.endGame('player-one-board');
        } else {
            this.switchPlayerTurn();
        }
    }  
    
    showPlayerRealPlayerShipPlacement() {
        const gridBoxOne = document.querySelector('.player-one-board');
        const flatBoard = this.realPlayer.gameBoard.board.flat();

        // Clear existing UI
        Array.from(gridBoxOne.children).forEach(cell => {
            cell.classList.remove('player-ship');
        });

        // Update UI with ship placements
        flatBoard.forEach((cellValue, index) => {
            if (cellValue === 1) {
                gridBoxOne.children[index].classList.add('player-ship');
            }
        });
    }

    randomizePlayerShips() {
        // Clear the board first
        this.realPlayer.gameBoard.board = Array.from({ length: 10 }, () => Array(10).fill(0));
        this.realPlayer.gameBoard.shipsHeld = [];

        // Clear the ship tracking
        shipPositions.playerShips.clear();

        // Place ships randomly
        placeShipsOnBoard(this.realPlayer.gameBoard, realPlayerShips, false);

        // Update the UI to reflect the new placements
        this.showPlayerRealPlayerShipPlacement();
    }
    
    showHitAnnouncement(position, isComputer = false) {
        // Create the announcement element if it doesn't exist
        let hitAnnouncement = document.querySelector('.hit-announcement');
        if (!hitAnnouncement) {
            hitAnnouncement = document.createElement('div');
            hitAnnouncement.classList.add('hit-announcement');
            document.body.appendChild(hitAnnouncement);
        }
        
        // Set the content of the announcement
        hitAnnouncement.innerHTML = `
            <h3>DIRECT HIT!</h3>
            <p>${isComputer ? 'Computer' : 'You'} hit a ship at ${position}!</p>
        `;
        
        // Show the announcement
        hitAnnouncement.classList.add('show');
        
        // Hide after 2 seconds
        setTimeout(() => {
            hitAnnouncement.classList.remove('show');
        }, 1500);
    }
    
    showSunkAnnouncement(shipLength, isComputer = false) {
        // Create the sunk announcement element if it doesn't exist
        let sunkAnnouncement = document.querySelector('.sunk-announcement');
        if (!sunkAnnouncement) {
            sunkAnnouncement = document.createElement('div');
            sunkAnnouncement.classList.add('sunk-announcement');
            document.body.appendChild(sunkAnnouncement);
        }
        
        // Determine ship type based on length
        let shipType;
        switch (shipLength) {
            case 5: shipType = "Carrier"; break;
            case 4: shipType = "Battleship"; break;
            case 3: shipType = "Cruiser"; break;
            case 2: shipType = "Destroyer"; break;
            default: shipType = "Ship";
        }
        
        // Set the content of the announcement
        sunkAnnouncement.innerHTML = `
            <h3>SHIP SUNK!</h3>
            <p>${isComputer ? 'Computer' : 'You'} sunk a ${shipType}!</p>
        `;
        
        // Show the announcement
        sunkAnnouncement.classList.add('show');
        
        // Hide after 2.5 seconds
        setTimeout(() => {
            sunkAnnouncement.classList.remove('show');
        }, 2500);
    }
       
    startGame() {
        // Allow real player to fire moves on computer grid.
        const gridBoxTwo = document.querySelector('.player-two-board');
        gridBoxTwo.addEventListener('click', this.fireAttackOnBoardHandler);

        // Keep player ship visibility but reset background color
        const gridBoxOne = document.querySelector('.player-one-board');
        Array.from(gridBoxOne.children).forEach(cell => {
            if (cell.classList.contains('player-ship')) {
                // Keep the player-ship class for visibility
                cell.style.backgroundColor = '';
            }
        });

        // Remove randomize and play buttons.
        const randomizeButton = document.getElementById('randomizeButton');
        const playButton = document.getElementById('playButton');
        
        if (randomizeButton) randomizeButton.remove();
        if (playButton) playButton.remove();
    }

    showEndGamePopup(winner) {
        // Create the popup container
        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');
    
        // Create the popup
        const popup = document.createElement('div');
        popup.classList.add('popup');
    
        // Create the title
        const title = document.createElement('h2');
        title.textContent = 'Game Over';
    
        // Create the winner message
        const winnerMessage = document.createElement('p');
        winnerMessage.textContent = `${winner} Won!`;
    
        // Create the restart button
        const restartButton = document.createElement('button');
        restartButton.classList.add('restart');
        restartButton.textContent = 'Play Again';
        restartButton.addEventListener('click', () => {
            location.reload(); // Refresh the page to restart the game
        });
    
        // Append elements to the popup
        popup.appendChild(title);
        popup.appendChild(winnerMessage);
        popup.appendChild(restartButton);
    
        // Append popup to the container
        popupContainer.appendChild(popup);
    
        // Append the popup container to the body
        document.body.appendChild(popupContainer);
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