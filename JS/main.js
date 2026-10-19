import { Game } from "./game.js";
import { Player } from "./player.js";

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const endGame = document.querySelector("#end-game");

const startGame = document.querySelector("#start-btn");
const restartGame = document.querySelector("#restart-btn");

// Ocultar pantallas al cargar la página
gameScreen.style.display = "none";
endGame.style.display = "none";

// Crear objetos
const player = new Player();
const game = new Game(player); // Estamos pasando el objeto player como argumento al constructor de Game.


let movingRight = false;
let movingLeft = false;


// Botón START
startGame.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  game.updateDisplay();
  game.startTimer();
  game.startEnemies();
  game.startPowerUps();
});

// Botón PLAY AGAIN
restartGame.addEventListener("click", () => {
  endGame.style.display = "none";
  gameScreen.style.display = "block";

  game.resetGame();
  game.startTimer();
  game.startEnemies();
  game.startPowerUps();
  game.startPowerUps();
  
});

// Movimiento del jugador
document.addEventListener("keydown", (event) => {
  if (gameScreen.style.display !== "block") return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    movingRight = true;
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    movingLeft = true;
  }
});

// Detectar cuándo dejamos de pulsar las flechas
document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight") {
    movingRight = false;
  } else if (event.key === "ArrowLeft") {
    movingLeft = false;
  }
});

// Mover el coche continuamente mientras mantenemos pulsada una flecha
setInterval(() => {
  if (gameScreen.style.display !== "block") return;

  if (movingRight) {
    player.moveRight();
  }

  if (movingLeft) {
    player.moveLeft();
  }
}, 20);