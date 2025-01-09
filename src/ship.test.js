import { Ship } from "./ship";

describe('Ship', () => {
    // Test to ensure the ship initializes with the correct length and no hits
    test('Initializes with correct length and no hits', () => {
        const testShip = new Ship(3);
        expect(testShip.length).toBe(3);
        expect(testShip.numberOfHits).toBe(0);
        expect(testShip.isSunk()).toBe(false);
    });

    // Test to verify the hit method increases the number of hits
    test('Increases the number of hits on the ship', () => {
        const testShip = new Ship(3);
        testShip.hit();
        expect(testShip.numberOfHits).toBe(1);
    });

    // Test to check if the ship is sunk after receiving sufficient hits
    test('Determines if the ship is sunk after sufficient hits', () => {
        const testShip = new Ship(3);
        for (let k = 0; k < 3; k++) testShip.hit();
        expect(testShip.isSunk()).toBe(true);
    });

    // Test to ensure the ship does not sink if hits are less than its length
    test('Does not sink if hits are less than length', () => {
        const testShip = new Ship(3);
        testShip.hit();
        testShip.hit();
        expect(testShip.isSunk()).toBe(false);
    });
});