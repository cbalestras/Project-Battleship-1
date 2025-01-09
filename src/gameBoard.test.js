import { GameBoard } from "./gameBoard";
import { Ship } from "./ship";

describe('GameBoard', () => {
    // Test to ensure the board initializes with no ships
    test('Initializes a board with no ships', () => {
        const actual = new GameBoard().board;
        const expected = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        expect(actual).toEqual(expected);
    });

    // Test to place a single-length ship at a specific coordinate
    test('Places a single-length ship at a specific coordinate', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(1);
        testBoard.placeShip([0, 'A'], [0, 'A'], testShip);
        expect(testBoard.board[0][0]).toBe(1);
    });

    // Test to place a horizontal ship of length > 1
    test('Places a horizontal ship of length > 1', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(5);
        testBoard.placeShip([0, 'A'], [0, 'E'], testShip);
        expect(testBoard.board[0].slice(0, 5)).toEqual([1, 1, 1, 1, 1]);
    });

    // Test to place a vertical ship of length > 1
    test('Places a vertical ship of length > 1', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(5);
        testBoard.placeShip([0, 'A'], [5, 'A'], testShip);
        const actual = [];
        for (let k = 0; k < 5; k++) {
            actual.push(testBoard.board[k][0]);
        }
        expect(actual).toEqual([1, 1, 1, 1, 1]);
    });

    // Test to throw an error when placing a ship on an occupied slot
    test('Throws an error when placing a ship on an occupied slot', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(3);
        testBoard.placeShip([0, 'A'], [0, 'C'], testShip);

        const anotherTestShip = new Ship(2);
        expect(() => {
            testBoard.placeShip([0, 'B'], [0, 'C'], anotherTestShip);
        }).toThrow('Slot already occupied');
    });

    // Test to verify an attack hits a ship
    test('Attack hit ship', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(5);
        testBoard.placeShip([0, 'A'], [0, 'E'], testShip);
        const actual = testBoard.receiveAttack([0, 'A']);
        expect(actual).toBe(true);
        expect(actual).not.toBe(false);
    });

    // Test to verify an attack misses a ship
    test('Attack missed ship', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(5);
        testBoard.placeShip([0, 'A'], [0, 'E'], testShip);
        const actual = testBoard.receiveAttack([0, 'G']);
        expect(actual).toBe(false);
        expect(actual).not.toBe(true);
    });

    // Test to ensure the hit function is fired on the correct ship
    test('Fire hit function on correct ship', () => {
        const testBoard = new GameBoard();
        const testShipOne = new Ship(5);
        const testShipTwo = new Ship(3);
        testBoard.placeShip([0, 'A'], [5, 'A'], testShipOne);
        testBoard.placeShip([9, 'C'], [9, 'E'], testShipTwo);
        testBoard.receiveAttack([9, 'C']);

        const actualShipOneHits = testBoard.shipsHeld[0].numberOfHits;
        const actualShipTwoHits = testBoard.shipsHeld[1].numberOfHits;
        const expectedShipOneHits = 0, expectedShipTwoHits = 1;

        expect(actualShipOneHits).toBe(expectedShipOneHits);
        expect(actualShipTwoHits).toBe(expectedShipTwoHits);
    });

    // Test to update the board on a successful shot
    test('Update successful shot on Board', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(4);
        testBoard.placeShip([0, 'A'], [0, 'E'], testShip);
        testBoard.receiveAttack([0, 'A']);
        const actualSlotAttacked = testBoard.board[0][0];
        const expectedAttackedSlot = 'X';
        expect(actualSlotAttacked).toBe(expectedAttackedSlot);
    });

    // Test to update the board on a missed shot
    test('Update missed shot on Board', () => {
        const testBoard = new GameBoard();
        const testShip = new Ship(5);
        testBoard.placeShip([0, 'A'], [4, 'A'], testShip);
        testBoard.receiveAttack([6, 'A']);
        const actualSlotAttacked = testBoard.board[6][0];
        const expectedAttackedSlot = 'O';
        expect(actualSlotAttacked).toBe(expectedAttackedSlot);
    });

    // Test to remove a sunk ship from the board
    test('Remove sunk ship from board', () => {
        const testBoard = new GameBoard();
        const testShipOne = new Ship(3);
        const testShipTwo = new Ship(5);

        testBoard.placeShip([7, 'A'], [9, 'A'], testShipOne);
        testBoard.placeShip([0, 'J'], [4, 'J'], testShipTwo);

        testBoard.receiveAttack([7, 'A']);
        testBoard.receiveAttack([8, 'A']);
        testBoard.receiveAttack([9, 'A']);

        const actualShipsOnBoard = testBoard.shipsHeld.length;
        expect(actualShipsOnBoard).toBe(1);
    });

    // Test to report all ships sunk
    test('Report all ships sunk', () => {
        const testBoard = new GameBoard();
        const testShipOne = new Ship(2);
        const testShipTwo = new Ship(1);

        testBoard.placeShip([0, 'A'], [0, 'B'], testShipOne);
        testBoard.placeShip([0, 'C'], [0, 'C'], testShipTwo);

        testBoard.receiveAttack([0, 'A']);
        testBoard.receiveAttack([0, 'B']);
        testBoard.receiveAttack([0, 'C']);

        const actualReport = testBoard.overallShipSinkStatus();
        const expectedReport = true;

        expect(actualReport).toBe(expectedReport);
    });

    // Test to report not all ships sunk
    test('Report not all ships sunk', () => {
        const testBoard = new GameBoard();
        const testShipOne = new Ship(2);
        const testShipTwo = new Ship(1);

        testBoard.placeShip([0, 'A'], [0, 'B'], testShipOne);
        testBoard.placeShip([0, 'C'], [0, 'C'], testShipTwo);

        testBoard.receiveAttack([0, 'A']);
        testBoard.receiveAttack([0, 'B']);

        const actualReport = testBoard.overallShipSinkStatus();

        expect(actualReport).toBe(false);
        expect(actualReport).not.toBe(true);
    });
});