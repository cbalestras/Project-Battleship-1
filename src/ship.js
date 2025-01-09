// Ship class represents a ship with a specific length, tracking hits and sunk status
class Ship {
    constructor(length) {
        this.length = length; // Length of the ship
        this.numberOfHits = 0; // Number of times the ship has been hit
        this.sunk = false; // Status indicating if the ship is sunk
        this.coordinates = []; // Coordinates occupied by the ship
    }

    // Method to record a hit on the ship
    hit() {
        if (this.numberOfHits < this.length) {
            this.numberOfHits += 1;
        }
    }

    // Method to check if the ship is sunk
    isSunk() {
        // A ship is considered sunk if the number of hits equals its length and all coordinates are hit
        if (this.numberOfHits === this.length && this.coordinates.length === 0) {
            this.sunk = true;
        }
        return this.sunk;
    }

    // Method to store the coordinates occupied by the ship
    populateCoordinatesStore([xCoordinate, yCoordinate]) {
        this.coordinates.push([xCoordinate, yCoordinate]);
    }

    // Method to remove coordinates from the ship's store once hit
    removeHitCoordinates([xCoordinate, yCoordinate]) {
        this.coordinates = this.coordinates.filter((coordinate) => coordinate[0] !== xCoordinate || coordinate[1] !== yCoordinate);
    }
}

export { Ship };