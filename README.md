# Battleship Game

## Overview

This project is a JavaScript implementation of the classic Battleship game. The game allows a player to compete against a computer opponent, placing ships on a grid and attempting to sink the opponent's fleet before theirs is sunk.
![Alt Text](Battleships.png)
## Features

- **Dynamic User Interface**: The game features a dynamic UI that updates in real-time as players make moves.
- **Object-Oriented Programming**: The game is structured using classes such as `GameBoard`, `Player`, and `Ship` to encapsulate functionality and data.
- **Asynchronous JavaScript**: The game uses asynchronous operations to handle computer moves, ensuring smooth gameplay.
- **Testing**: Comprehensive unit tests are provided to ensure the correctness of the game logic using Jest.

## Skills Demonstrated

- **DOM Manipulation**: The game dynamically updates the DOM to reflect the current state of the game board.
- **Object-Oriented Programming**: Utilizes classes and encapsulation to manage game state and logic.
- **ES6 Features**: Implements modern JavaScript features such as classes, arrow functions, and template literals.
- **Webpack**: The project is bundled using Webpack to manage dependencies and assets.
- **Testing with Jest**: The game logic is thoroughly tested using Jest, ensuring reliability and correctness.
- **Asynchronous Code**: Handles asynchronous operations for computer moves using `setTimeout`.

## How to Play

1. **Setup**: The game initializes with two players: a real player and a computer. Each player has a fleet of ships to place on their respective boards.
2. **Placing Ships**: Ships are placed randomly on the board at the start of the game. The real player can also randomize their ship placements.
3. **Gameplay**: Players take turns attacking each other's boards. The goal is to sink all of the opponent's ships.
4. **Winning the Game**: The first player to sink all of the opponent's ships wins the game.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/john-walter-munene/Project-Battleship
   ```

2. Navigate to the project directory:
   ```bash
   cd battleship-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Compile the game:
   ```bash
   npm run build
   ```

5. Run the game by opening the `index.html` file in the `dist` folder.

## Running Tests

```bash
npm test
```

## Project Structure

- `src/`: Contains the source code for the game.
- `tests/`: Contains unit tests for the game logic.
- `dist/`: Contains the bundled output files.
