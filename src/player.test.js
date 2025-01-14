import { Player } from "./player";

describe('Player', () => {
    test('Player is a computer', () => {
        const player = new Player('computer');
        const actualPlayerIsComputer = player.isComputer();
        expect(actualPlayerIsComputer).toBe(true);
        expect(actualPlayerIsComputer).not.toBe(false);
        expect(actualPlayerIsComputer).toBeTruthy();
        expect(actualPlayerIsComputer).not.toBeFalsy();
    });

    test('Player is a real one', () => {
        const player = new Player('real');
        const actualPlayerIsReal = player.isRealPlayer();
        expect(actualPlayerIsReal).toBe(true);
        expect(actualPlayerIsReal).not.toBe(false);
        expect(actualPlayerIsReal).toBeTruthy();
        expect(actualPlayerIsReal).not.toBeFalsy();
    });
});