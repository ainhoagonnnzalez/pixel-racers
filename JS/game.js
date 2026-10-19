import { Opponent } from "./opponent.js";
import { PowerUp } from "./powerup.js";

const gameScreen = document.querySelector("#game-screen");
const endGame = document.querySelector("#end-game");

const speedPlayer = document.querySelector("#speed");
const overtakesPlayer = document.querySelector("#overtakes");
const timePlayer = document.querySelector("#time");

const finalSpeed = document.querySelector("#final-speed");
const finalOvertakes = document.querySelector("#final-overtakes");

export class Game {
  constructor(player) {
    this.player = player;
    this.time = 60;
    this.speed = 60;
    this.overtakes = 0;

    // Guardamos los enemigos dentro del juego
    this.opponents = [];

    // Guardamos los rayos dentro del juego
    this.powerUps = [];

    // Intervalos del juego
    this.gameTimer = null;
    this.newOpponent = null;
    this.moveEnemies = null;
    this.newPowerUp = null;
    this.movePowerUps = null;
  }

  increaseSpeed() {
    this.speed += 20;
  }

  addOvertake() {
    this.overtakes += 1;
  }

  updateDisplay() {
    speedPlayer.textContent = `SPEED: ${this.speed}`;
    overtakesPlayer.textContent = `OVERTAKES: ${this.overtakes}`;
    timePlayer.textContent = `TIME: ${this.time}`;
  }

  startTimer() {
  this.gameTimer = setInterval(() => {
    this.time--;
    this.updateDisplay();

    if (this.time === 0) {
      clearInterval(this.gameTimer);

      this.stopEnemies();
      this.clearEnemies();
      this.stopPowerUps();
      this.clearPowerUps();

      // Mostrar los resultados finales de la partida
      finalSpeed.textContent = `FINAL SPEED: ${this.speed}`;
      finalOvertakes.textContent = `OVERTAKES: ${this.overtakes}`;

      // Ocultar el juego y mostrar la pantalla final
      gameScreen.style.display = "none";
      endGame.style.display = "block";
    }
  }, 1000);
}

  resetGame() {
    this.stopEnemies();
    this.clearEnemies();
    this.stopPowerUps();
    this.clearPowerUps();

    this.time = 60;
    this.speed = 60;
    this.overtakes = 0;

    this.updateDisplay();
  }

  startEnemies() {
    // Cada 2 segundos creamos un enemigo
    this.newOpponent = setInterval(() => {
      const newEnemy = new Opponent();

      this.opponents.push(newEnemy);
    }, 2000);

    // Cada 30 milisegundos movemos los enemigos
    this.moveEnemies = setInterval(() => {
      this.opponents.forEach((enemy) => {
        enemy.moveDown(this.speed);
        this.checkCollision(enemy);
      });

      // Comprobamos si algún enemigo ha salido
      for (let i = this.opponents.length - 1; i >= 0; i--) {
        const enemy = this.opponents[i];

        if (enemy.positionY >= 550) {
          // Eliminar enemigo del HTML
          enemy.element.remove();

          // Eliminar enemigo del array
          this.opponents.splice(i, 1);
          this.addOvertake();
          this.updateDisplay();
        }
      }
    }, 30);
  }

  stopEnemies() {
    clearInterval(this.newOpponent);
    clearInterval(this.moveEnemies);
  }

  clearEnemies() {
    // Eliminar enemigos del HTML
    this.opponents.forEach((enemy) => {
      enemy.element.remove();
    });

    // Vaciar el array
    this.opponents.splice(0, this.opponents.length);
  }
  checkCollision(enemy) {
    const playerPosition = this.player.getPosition();
    const enemyPosition = enemy.getPosition();

    if (
      playerPosition.left < enemyPosition.right &&
      playerPosition.right > enemyPosition.left &&
      playerPosition.top < enemyPosition.bottom &&
      playerPosition.bottom > enemyPosition.top
    ) {
      console.log("COLLISION!");
      this.decreaseSpeed();
      this.updateDisplay();
      enemy.element.remove();
      const index = this.opponents.indexOf(enemy);
      if (index !== -1) {
        this.opponents.splice(index, 1);
      }
    }
  }
  decreaseSpeed() {
    if (this.speed > 40) {
      this.speed -= 20;
    }
  }
  startPowerUps() {
    this.schedulePowerUp();

    // Mover los rayos cada 30 milisegundos
    this.movePowerUps = setInterval(() => {
      this.powerUps.forEach((light) => {
        light.moveDown();
        this.checkPowerUpCollision(light);
      });

      // Eliminar los rayos que salen de la carretera
      for (let i = this.powerUps.length - 1; i >= 0; i--) {
        const light = this.powerUps[i];

        if (light.positionY >= 550) {
          light.element.remove();
          this.powerUps.splice(i, 1);
        }
      }
    }, 30);
  }
  schedulePowerUp() {
  // Generar un tiempo aleatorio entre 3 y 8 segundos
  const randomTime = Math.floor(Math.random() * 5000) + 3000;

  // Crear un rayo después del tiempo aleatorio
  this.newPowerUp = setTimeout(() => {
    const lightning = new PowerUp();
    this.powerUps.push(lightning);

    // Programar el siguiente rayo
    this.schedulePowerUp();
  }, randomTime);
}
  stopPowerUps() {
    clearTimeout(this.newPowerUp);
    clearInterval(this.movePowerUps);
  }
  clearPowerUps() {
    this.powerUps.forEach((elem) => {
      elem.element.remove(); // eliminar el rayo del HTML
    });
    // vaciar el array
    this.powerUps.splice(0, this.powerUps.length);
  }
  checkPowerUpCollision(light) {
    const playerPosition = this.player.getPosition();
    const lightPosition = light.getPosition();
    if (
      playerPosition.left < lightPosition.right &&
      playerPosition.right > lightPosition.left &&
      playerPosition.top < lightPosition.bottom &&
      playerPosition.bottom > lightPosition.top
    ) {
      console.log("ENERGY");
      this.increaseSpeed();
      this.updateDisplay();
      light.element.remove();
      const index = this.powerUps.indexOf(light);

      if (index !== -1) {
        this.powerUps.splice(index, 1);
      }
    }
  }
}
