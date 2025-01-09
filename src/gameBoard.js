// GameBoard class represents the game board for placing ships and handling attacks
class GameBoard {
    constructor() {
        this.board = []; // 2D array representing the game board (Graph data structure: adjacency matrix)
        this.generateBoard(); // Initialize the board
        this.shipsHeld = []; // Array to hold ships placed on the board
    }

    // Method to generate a 10x10 game board initialized with zeros
    generateBoard() {
        const rows = 10;
        const columns = 10;
        const battleShipBoardAdjacencyMatrix = [];

        for (let counter = 0; counter < rows; counter++) {
            battleShipBoardAdjacencyMatrix.push(new Array(columns).fill(0));
        }

        this.board.push(...battleShipBoardAdjacencyMatrix);
    }

    // Method to convert an alphabet character to its corresponding index
    alphabetToIndex(alphabet) {
        const alphas = Array.from(Array(10)).map((e, i) => i + 65);
        const alphabets = alphas.map((x) => String.fromCharCode(x));
        return alphabets.indexOf(alphabet);
    }

    // Method to check if two arrays are equal
    arraysEqual(arrayOne, arrayTwo) {
        return arrayOne.every((value, index) => value === arrayTwo[index]);
    }

    // Method to place a ship on the board at specified start and end coordinates
    placeShip([startXCoordinate, startYCoordinate], [endXCoordinate, endYCoordinate], shipObject) {
        const [shipStartXCoord, shipStartYCood] = [startXCoordinate, this.alphabetToIndex(startYCoordinate)];
        const [shipEndXCoord, shipEndYCoord] = [endXCoordinate, this.alphabetToIndex(endYCoordinate)];
        let shipLength = shipObject.length;

        // Check for occupied slots
        if (shipStartXCoord === shipEndXCoord) { // Horizontal placement
            for (let i = 0; i < shipLength; i++) {
                if (this.board[shipStartXCoord][shipStartYCood + i] !== 0) {
                    throw new Error('Slot already occupied');
                }
            }
        } 
        
        if (shipStartYCood === shipEndYCoord) { // Vertical placement
            for (let i = 0; i < shipLength; i++) {
                if (this.board[shipStartXCoord + i][shipStartYCood] !== 0) {
                    throw new Error('Slot already occupied');
                }
            }
        }

        // Place a one (length) sized ship
        if (shipObject.length === 1 || this.arraysEqual([shipStartXCoord, shipStartYCood], [shipEndXCoord, shipEndYCoord])) {
            this.board[shipStartXCoord][shipStartYCood] = 1;
            shipObject.populateCoordinatesStore([shipStartXCoord, shipStartYCood]);
        }

        // Horizontal placement of ship of length > 1
        if (shipStartXCoord === shipEndXCoord) {
            for (let i = 0; i < shipLength; i++) {
                this.board[shipStartXCoord][shipStartYCood + i] = 1;
                shipObject.populateCoordinatesStore([shipStartXCoord, shipStartYCood + i]);
            }
        }

        // Vertical placement of ship of length > 1
        if (shipStartYCood === shipEndYCoord) {
            for (let i = 0; i < shipLength; i++) {
                this.board[shipStartXCoord + i][shipStartYCood] = 1;
                shipObject.populateCoordinatesStore([shipStartXCoord + i, shipStartYCood]);
            }
        }

        // Add the ship to holdings
        this.shipsHeld.push(shipObject);
    }

    // Method to handle an attack on the board at specified coordinates
    receiveAttack([targetXCoordinate, targetYCoordinate]) {
        const [hitXCoordinate, hitYCoordinate] = [targetXCoordinate, this.alphabetToIndex(targetYCoordinate)];

        if (this.board[hitXCoordinate][hitYCoordinate] === 1) {
            this.updateBoardOnSuccessfulShot([hitXCoordinate, hitYCoordinate]);
            const hitShip = this.findShipHoldingTargetCoordinates([hitXCoordinate, hitYCoordinate]);
            hitShip.hit();
            hitShip.removeHitCoordinates([hitXCoordinate, hitYCoordinate]);
            const sinkStatus = hitShip.isSunk();
            if (sinkStatus) this.removeSunkShipFromBoard(hitShip);
            return true;
        };

        this.updateBoardOnMissedShot([hitXCoordinate, hitYCoordinate]);
        return false;
    }

    // Method to find the ship holding the target coordinates
    findShipHoldingTargetCoordinates([targetXCoordinate, targetYCoordinate]) {
        for (const ship of this.shipsHeld) {
            const matchingCoordinate = ship.coordinates.find(coordinate => 
                coordinate[0] === targetXCoordinate && coordinate[1] === targetYCoordinate
            );
            if (matchingCoordinate) return ship;
        }
        return null;
    }
    
    // Method to update the board on a successful shot
    updateBoardOnSuccessfulShot([convertedTargetX, convertedTargetY]) {
        this.board[convertedTargetX].splice(convertedTargetY, 1, 'X');
    }
    
    // Method to update the board on a missed shot
    updateBoardOnMissedShot([convertedTargetX, convertedTargetY]) {
        this.board[convertedTargetX].splice(convertedTargetY, 1, 'O');
    }
    
    // Method to remove a sunk ship from the board
    removeSunkShipFromBoard(shipObject) {
        const sunkShipIndex = this.shipsHeld.indexOf(shipObject);
        this.shipsHeld.splice(sunkShipIndex, 1);
    }

    // Method to report if all ships have been sunk
    overallShipSinkStatus() {
        return this.shipsHeld.length === 0;
    }
}

export { GameBoard };