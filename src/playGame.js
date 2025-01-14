import { Player } from "./player";
import { Ship } from "./ship";
import { GameDisplay } from "./gameDisplay";

// Create players
const computerPlayer = new Player('computer');
const realPlayer = new Player('real');

// Create ships for each player
// Computer player's ships
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
// realPlayer.gameBoard.placeShip([1, 'A'], [1, 'E'], realPlayerCarrier);
// realPlayer.gameBoard.placeShip([3, 'B'], [3, 'E']), realPlayerBattleship;
// realPlayer.gameBoard.placeShip([5, 'C'], [5, 'E'], realPlayerDestroyer);
// realPlayer.gameBoard.placeShip([7, 'D'], [7, 'F'], realPlayerSubmarine);
// realPlayer.gameBoard.placeShip([9, 'E'], [9, 'F'], realPlayerPatrolBoat);

// UI components to create grid on.
const gameSpace = document.querySelector('.game-space');
const gridBoxOne = document.querySelector('.player-one-board'); 
const gridBoxTwo = document.querySelector('.player-two-board');
const gameDisplay = new GameDisplay(gameSpace);
gameDisplay.createGrid(gridBoxOne);
gameDisplay.createGrid(gridBoxTwo);
if (gridBoxOne) console.log("One");
if (gridBoxTwo) console.log("Two");

export { gameDisplay };