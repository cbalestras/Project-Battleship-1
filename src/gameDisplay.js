class GameDisplay {
    constructor(contentHolder, playerOneBoard, playerTwoBoard) {
        this.playerOneBoard = playerOneBoard;
        this.playerTwoBoard = playerTwoBoard;
        this.contentHolder = contentHolder;
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
}

export { GameDisplay };