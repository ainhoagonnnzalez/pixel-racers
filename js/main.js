import { Game } from "./game.js";
import { Player } from "./player.js";

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const endGame = document.querySelector("#end-game");

const startGame = document.querySelector("#start-btn");
const restartGame = document.querySelector("#restart-btn");
const playerCar = document.querySelector("#car");

// COCHES DE LA PANTALLA DE INICIO
const carOptions = document.querySelectorAll(".car-option");
let selectedCar = "rosa";

// Ocultar pantallas al cargar la página
gameScreen.style.display = "none";
endGame.style.display = "none";

// Crear objetos
const player = new Player();
const game = new Game(player); // Estamos pasando el objeto player como argumento al constructor de Game.

// Botón START

startGame.addEventListener("click", () => {
  // Guardar en el juego el color elegido
  game.selectedCar = selectedCar;

  // Mostrar la imagen del coche seleccionado
  playerCar.style.backgroundImage = `url("./images/coche_${selectedCar}.png")`;
  playerCar.style.backgroundSize = "contain";
  playerCar.style.backgroundPosition = "center";
  playerCar.style.backgroundRepeat = "no-repeat";
  playerCar.style.backgroundColor = "transparent";

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  game.loadLevel();
  game.startTimer();
  game.startEnemies();
  game.startPowerUps();
  game.startItems();
  game.startRockets();
});

// Botón PLAY AGAIN
restartGame.addEventListener("click", () => {
  // Pasar al siguiente nivel si hemos completado el actual
  const currentLevel = game.levels[game.level - 1];

  if (game.overtakes >= currentLevel.goal && game.level < game.levels.length) {
    // Hemos completado un nivel y pasamos al siguiente
    game.level++;
  } else {
    // Empezamos una partida nueva
    game.level = 1;
    game.lives = 3;
  }

  endGame.style.display = "none";
  gameScreen.style.display = "block";

  game.resetGame();
  game.loadLevel();
  game.startTimer();
  game.startEnemies();
  game.startPowerUps();
  game.startItems();
  game.startRockets();
});

// Cambiar de carril con las flechas del teclado
document.addEventListener("keydown", (event) => {
  // Solo permitir el movimiento durante la partida
  if (gameScreen.style.display !== "block") return;

  // Evitar que mantener pulsada una tecla provoque varios cambios
  if (event.repeat) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    player.moveRight();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    player.moveLeft();
  }
  // Utilizar el cohete con la barra espaciadora
  if (event.code === "Space") {
    event.preventDefault();

    if (game.currentItem === "🚀") {
      game.launchRocket();
    } else if (game.currentItem === "🛡️") {
      game.activateShield();
    } else if (game.currentItem === "💥") {
      game.activateEMP();
    } else if (game.currentItem === "🔥") {
      game.activateNitro();
    }
  }
});

// SELECCIONAR EL COCHE DEL JUGADOR
carOptions.forEach((car) => {
  car.addEventListener("click", () => {
    // Quitar la selección anterior
    carOptions.forEach((option) => {
      option.classList.remove("selected");
    });

    // Marcar el coche elegido
    car.classList.add("selected");

    // Guardar su color
    if (car.id === "pink-car") {
      selectedCar = "rosa";
    } else if (car.id === "blue-car") {
      selectedCar = "azul";
    } else if (car.id === "green-car") {
      selectedCar = "verde";
    } else if (car.id === "orange-car") {
      selectedCar = "naranja";
    }

    console.log("Selected car:", selectedCar);
  });
});
