import { GameBoard } from "./gameBoard";

class Player {
    constructor(type) {
        this.type = type;
        this.gameBoard = new GameBoard();
    }

    // Method to check if player is a computer.
    isComputer() {
        return this.type === 'computer';
    }

    // Method to check if the player is a real player.
    isRealPlayer() {
        return this.type === 'real';
    }
}

export { Player };