import { Opponent } from "./opponent.js";
import { PowerUp } from "./powerup.js";
import { Item } from "./item.js";
import { Rocket } from "./rocket.js";

const gameScreen = document.querySelector("#game-screen");
const endGame = document.querySelector("#end-game");

const speedPlayer = document.querySelector("#speed");
const overtakesPlayer = document.querySelector("#overtakes");
const timePlayer = document.querySelector("#time");

const finalSpeed = document.querySelector("#final-speed");
const finalOvertakes = document.querySelector("#final-overtakes");
const road = document.querySelector("#road");
const livesPlayer = document.querySelector("#lives");
const levelDisplay = document.querySelector("#level-display");

export class Game {
  constructor(player) {
    this.player = player;
    this.selectedCar = this.selectedCar;
    this.boosts = 0;

    // Datos de la partida
    this.time = 60;
    this.speed = 60;
    this.overtakes = 0;
    this.lives = 3;

    // NIVELES DEL JUEGO
    this.level = 1;

    this.levels = [
      { goal: 20, time: 45, speed: 60, enemyInterval: 2000 },
      { goal: 30, time: 60, speed: 80, enemyInterval: 1500 },
      { goal: 40, time: 75, speed: 100, enemyInterval: 1000 },
    ];
    // Cajas sorpresa
    this.items = [];

    // Objeto que tiene el jugador
    this.currentItem = null;

    // Temporizadores de las cajas
    this.newItem = null;
    this.moveItems = null;

    // Posiciones de los tres carriles
    this.lanes = [42, 175, 308];

    // Arrays donde guardamos los enemigos y los rayos
    this.opponents = [];
    this.powerUps = [];

    // Cohetes lanzados
    this.rockets = [];
    this.moveRockets = null;

    // ESCUDO
    this.shieldActive = false;
    this.shieldTimer = null;

    // NITRO RUSH
    this.nitroActive = false;
    this.nitroTimer = null;

    // Temporizadores
    this.gameTimer = null;
    this.newOpponent = null;
    this.moveEnemies = null;
    this.newPowerUp = null;
    this.movePowerUps = null;
  }
  // CARGAR NIVEL
  loadLevel() {
    const currentLevel = this.levels[this.level - 1];

    this.time = currentLevel.time;
    this.speed = currentLevel.speed;
    this.overtakes = 0;

    this.updateDisplay();
  }

  // AUMENTAR VELOCIDAD
  increaseSpeed() {
    this.speed += 20;
    this.boosts++;
    this.updateDisplay();
  }
  // SUMAR ADELANTAMIENTOS
  addOvertake() {
    this.overtakes++;

    this.updateDisplay();

    // Obtener el objetivo del nivel actual
    const currentLevel = this.levels[this.level - 1];

    // Comprobar si hemos completado el objetivo
    if (this.overtakes >= currentLevel.goal) {
      this.endGame();
    }
  }

  // ACTUALIZAR LOS DATOS DE LA PANTALLA
  updateDisplay() {
    speedPlayer.textContent = this.speed;
    overtakesPlayer.textContent = `OVERTAKES: ${this.overtakes}`;
    timePlayer.textContent = `TIME: ${this.time}`;
    livesPlayer.textContent = `LIVES: ${"❤️".repeat(this.lives)}`;
    levelDisplay.textContent = `LEVEL ${this.level}`;

    // ACTUALIZAR OBJETIVO DE LA CARRERA
    const raceGoal = document.querySelector("#race-goal");
    const goalProgress = document.querySelector("#goal-progress");

    const currentLevel = this.levels[this.level - 1];

    raceGoal.textContent = `${Math.min(this.overtakes, currentLevel.goal)} / ${currentLevel.goal}`;

    goalProgress.style.width = `${Math.min((this.overtakes / currentLevel.goal) * 100, 100)}%`;
    document.querySelector("#goal-message").textContent =
      `OVERTAKE ${currentLevel.goal} CARS!`;
    this.updateRoadSpeed();

    document.getElementById("boosts").textContent = `⚡ BOOSTS: ${this.boosts}`;

    // Mostrar el objeto actual
    const currentItemDisplay = document.querySelector("#current-item");

    if (currentItemDisplay !== null) {
      if (this.currentItem === null) {
        currentItemDisplay.textContent = "ITEM: -";
      } else {
        currentItemDisplay.textContent = `ITEM: ${this.currentItem}`;
      }
    }

    // Quitar la iluminación de los objetos
    document.querySelectorAll(".item-slot").forEach((item) => {
      item.classList.remove("active");
    });

    // Iluminar el objeto que tenemos
    let selectedItem = null;

    if (this.currentItem === "🚀") {
      selectedItem = document.querySelector("#item-rocket");
    } else if (this.currentItem === "🛡️") {
      selectedItem = document.querySelector("#item-shield");
    } else if (this.currentItem === "🔥") {
      selectedItem = document.querySelector("#item-nitro");
    }

    if (selectedItem !== null) {
      selectedItem.classList.add("active");
    }
  }

  // TEMPORIZADOR DE LA PARTIDA
  startTimer() {
    this.gameTimer = setInterval(() => {
      this.time--;

      this.updateDisplay();

      // Cuando se acaba el tiempo, termina la partida
      if (this.time === 0) {
        this.endGame();
      }
    }, 1000);
  }

  // REINICIAR LA PARTIDA
  resetGame() {
    clearInterval(this.gameTimer);
    this.boosts = 0;

    // Detener y eliminar los enemigos
    this.stopEnemies();
    this.clearEnemies();

    // Detener y eliminar los rayos
    this.stopPowerUps();
    this.clearPowerUps();

    // Reiniciar los datos
    this.time = 60;
    this.speed = 60;
    this.overtakes = 0;
    

    // Devolver el coche al carril central
    this.player.lane = 1;
    this.player.positionX = this.lanes[1];
    this.player.updatePosition();

    this.updateDisplay();
    this.stopItems();
    this.clearItems();
    this.currentItem = null;
    this.stopRockets();
    this.clearRockets();
    this.deactivateShield();
    this.deactivateNitro();
  }

  // ELEGIR UNA POSICIÓN ALEATORIA ENTRE LOS TRES CARRILES
  getRandomLane() {
    const randomNumber = Math.floor(Math.random() * 3);

    const positionX = this.lanes[randomNumber];

    return positionX;
  }

  // CREAR Y MOVER ENEMIGOS
  startEnemies() {
    const currentLevel = this.levels[this.level - 1];
    const enemyInterval = currentLevel.enemyInterval;
    // Crear un enemigo cada 2 segundos
    this.newOpponent = setInterval(() => {
      // Buscar carriles donde no haya cajas sorpresa
      const availableLanes = [];

      for (let i = 0; i < this.lanes.length; i++) {
        const lanePosition = this.lanes[i];

        let itemInLane = false;

        // Comprobar si hay una caja en este carril
        for (let j = 0; j < this.items.length; j++) {
          const item = this.items[j];

          if (Math.abs(item.positionX - lanePosition) < 10) {
            itemInLane = true;
          }
        }

        // Guardar el carril si no tiene cajas
        if (itemInLane === false) {
          availableLanes.push(lanePosition);
        }
      }

      // Si no hay carriles libres, no crear enemigo
      if (availableLanes.length === 0) {
        return;
      }

      // Elegir un carril libre aleatoriamente
      const randomNumber = Math.floor(Math.random() * availableLanes.length);
      const positionX = availableLanes[randomNumber];

      // Elegir un color aleatorio
      const color = this.getRandomColor();

      // Crear un enemigo con ese color
      const newEnemy = new Opponent(positionX, color);

      // Guardar el enemigo en el array
      this.opponents.push(newEnemy);
    }, enemyInterval);

    // Mover los enemigos cada 30 milisegundos
    this.moveEnemies = setInterval(() => {
      this.opponents.forEach((enemy) => {
        enemy.moveDown(this.speed);

        // Comprobar si choca con nuestro coche
        this.checkCollision(enemy);
      });

      // Comprobar si algún enemigo ha salido de la carretera
      for (let i = this.opponents.length - 1; i >= 0; i--) {
        const enemy = this.opponents[i];

        if (enemy.positionY >= road.clientHeight) {
          // Eliminar el enemigo de la pantalla
          enemy.element.remove();

          // Eliminar el enemigo del array
          this.opponents.splice(i, 1);

          // Sumar un adelantamiento
          this.addOvertake();

          this.updateDisplay();
        }
      }
    }, 30);
  }

  // DETENER LA APARICIÓN Y EL MOVIMIENTO DE ENEMIGOS
  stopEnemies() {
    clearInterval(this.newOpponent);
    clearInterval(this.moveEnemies);
  }

  // ELIMINAR TODOS LOS ENEMIGOS
  clearEnemies() {
    this.opponents.forEach((enemy) => {
      enemy.element.remove();
    });

    this.opponents.splice(0, this.opponents.length);
  }

  // COMPROBAR COLISIONES CON ENEMIGOS
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
      if (this.shieldActive === true) {
        this.showShieldExplosion(enemy);
        // Eliminar el enemigo que choca contra el escudo
        enemy.element.remove();

        const index = this.opponents.indexOf(enemy);

        if (index !== -1) {
          this.opponents.splice(index, 1);
        }

        return;
      }
      this.lives--; // Perdemos una vida

      this.updateDisplay();

      // Eliminar el enemigo de la pantalla
      enemy.element.remove();

      // Buscar la posición del enemigo dentro del array
      const index = this.opponents.indexOf(enemy);

      // Eliminarlo del array
      if (index !== -1) {
        this.opponents.splice(index, 1);
      }
      if (this.lives === 0) {
        this.endGame();
      }
    }
  }

  // CREAR Y MOVER RAYOS
  startPowerUps() {
    // Programar la aparición del primer rayo
    this.schedulePowerUp();

    // Mover los rayos cada 30 milisegundos
    this.movePowerUps = setInterval(() => {
      this.powerUps.forEach((light) => {
        // Mover el rayo hacia abajo
        light.moveDown(this.speed);

        // Comprobar si lo recogemos
        this.checkPowerUpCollision(light);
      });

      // Eliminar los rayos que salen de la carretera
      for (let i = this.powerUps.length - 1; i >= 0; i--) {
        const light = this.powerUps[i];

        if (light.positionY >= road.clientHeight) {
          light.element.remove();

          this.powerUps.splice(i, 1);
        }
      }
    }, 30);
  }

  // BUSCAR CARRILES SIN ENEMIGOS
  getAvailableLanes() {
    const availableLanes = [];

    // Revisar los tres carriles
    for (let i = 0; i < this.lanes.length; i++) {
      const lanePosition = this.lanes[i];

      let laneOccupied = false;

      // Revisar todos los enemigos
      for (let j = 0; j < this.opponents.length; j++) {
        const enemy = this.opponents[j];

        // Comprobar si el enemigo está en este carril
        if (enemy.positionX === lanePosition) {
          laneOccupied = true;
        }
      }

      // Guardar el carril si está libre
      if (laneOccupied === false) {
        availableLanes.push(lanePosition);
      }
    }

    return availableLanes;
  }

  // PROGRAMAR LA APARICIÓN DE RAYOS
  schedulePowerUp() {
    // Elegir un tiempo aleatorio entre 3 y 8 segundos
    const randomTime = Math.floor(Math.random() * 5000) + 3000;

    this.newPowerUp = setTimeout(() => {
      // Buscar los carriles disponibles
      const availableLanes = this.getAvailableLanes();

      // Comprobar que hay algún carril libre
      if (availableLanes.length > 0) {
        // Elegir un número aleatorio según los carriles libres
        const randomNumber = Math.floor(Math.random() * availableLanes.length);

        // Obtener la posición del carril elegido
        const lanePosition = availableLanes[randomNumber];

        // Centrar el rayo dentro del carril
        // El coche mide 50px y el rayo 35px
        const positionX = lanePosition + 7.5;

        // Crear el rayo
        const lightning = new PowerUp(positionX);

        // Guardarlo en el array
        this.powerUps.push(lightning);
      }

      // Programar la aparición del siguiente rayo
      this.schedulePowerUp();
    }, randomTime);
  }

  // DETENER LA APARICIÓN Y EL MOVIMIENTO DE RAYOS
  stopPowerUps() {
    clearTimeout(this.newPowerUp);
    clearInterval(this.movePowerUps);
  }

  // ELIMINAR TODOS LOS RAYOS
  clearPowerUps() {
    this.powerUps.forEach((light) => {
      light.element.remove();
    });

    this.powerUps.splice(0, this.powerUps.length);
  }

  // COMPROBAR SI EL JUGADOR RECOGE UN RAYO
  checkPowerUpCollision(light) {
    const playerPosition = this.player.getPosition();
    const lightPosition = light.getPosition();

    if (
      playerPosition.left < lightPosition.right &&
      playerPosition.right > lightPosition.left &&
      playerPosition.top < lightPosition.bottom &&
      playerPosition.bottom > lightPosition.top
    ) {
      console.log("ENERGY!");

      // Aumentar velocidad
      this.increaseSpeed();

      this.updateDisplay();

      // Eliminar el rayo de la pantalla
      light.element.remove();

      // Buscar el rayo dentro del array
      const index = this.powerUps.indexOf(light);

      // Eliminarlo del array
      if (index !== -1) {
        this.powerUps.splice(index, 1);
      }
    }
  }
  // FINALIZAR LA PARTIDA
  endGame() {
    // Detener el temporizador
    clearInterval(this.gameTimer);

    // Detener y eliminar enemigos
    this.stopEnemies();
    this.clearEnemies();

    // Detener y eliminar rayos
    this.stopPowerUps();
    this.clearPowerUps();

    // Detener y eliminar cajas sorpresa
    this.stopItems();
    this.clearItems();

    // Detener y eliminar cohetes
    this.stopRockets();
    this.clearRockets();

    // Guardar la velocidad antes de desactivar el nitro
    const finalSpeedValue = this.speed;

    this.deactivateShield();
    this.deactivateNitro();

    // Comprobar si hemos ganado
    const endTitle = document.querySelector("#end-title");
    const endMessage = document.querySelector("#end-message");
    const winnerCup = document.querySelector("#winner-cup");
    const restartButton = document.querySelector("#restart-btn");

    const currentLevel = this.levels[this.level - 1];

    if (this.overtakes >= currentLevel.goal) {
      // VICTORIA
      if (this.level < this.levels.length) {
        endTitle.textContent = "LEVEL COMPLETED!";
        endMessage.textContent = `LEVEL ${this.level} COMPLETED!`;
        winnerCup.style.display = "block";
        restartButton.textContent = "NEXT LEVEL";
      } else {
        endTitle.textContent = "YOU WIN!";
        endMessage.textContent = "ALL LEVELS COMPLETED!";
        winnerCup.style.display = "block";
        restartButton.textContent = "PLAY AGAIN";
      }
    } else {
      // DERROTA
      endTitle.textContent = "GAME OVER";
      endMessage.textContent = "TRY AGAIN!";
      winnerCup.style.display = "none";
      restartButton.textContent = "TRY AGAIN";
    }

    // Mostrar resultados
    finalOvertakes.textContent = `${this.overtakes} / 25`;
    finalSpeed.textContent = `${finalSpeedValue} KM/H`;

    document.querySelector("#final-time").textContent = `${this.time}s`;

    // Mostrar la pantalla final
    gameScreen.style.display = "none";
    endGame.style.display = "flex";
  }
  updateRoadSpeed() {
    const road = document.getElementById("road");
    const duration = 30 / this.speed;

    road.style.animationDuration = `${duration}s`;
  }
  // ELEGIR UN COLOR ALEATORIO PARA LOS ENEMIGOS
  getRandomColor() {
    const colors = ["rosa", "azul", "verde", "naranja"];

    // Quitar el color elegido por el jugador
    const availableColors = colors.filter((color) => {
      return color !== this.selectedCar;
    });

    // Elegir uno de los tres colores disponibles
    const randomNumber = Math.floor(Math.random() * availableColors.length);

    return availableColors[randomNumber];
  }
  // CREAR Y MOVER CAJAS SORPRESA
  startItems() {
    // Crear una caja cada 7 segundos
    this.newItem = setInterval(() => {
      // Elegir un carril aleatorio
      // Buscar los carriles sin enemigos
      const availableLanes = this.getAvailableLanes();

      // Comprobar que hay carriles disponibles
      if (availableLanes.length > 0) {
        // Elegir uno de los carriles libres
        const randomNumber = Math.floor(Math.random() * availableLanes.length);

        const positionX = availableLanes[randomNumber];

        // Crear la caja sorpresa
        const newItem = new Item(positionX + 2.5);

        // Guardarla en el array
        this.items.push(newItem);
      }
    }, 2000);

    // Mover las cajas cada 30 milisegundos
    this.moveItems = setInterval(() => {
      this.items.forEach((item) => {
        // Mover la caja hacia abajo
        item.moveDown(this.speed);

        // Comprobar si el jugador la recoge
        this.checkItemCollision(item);
      });

      // Eliminar las cajas que salen de la carretera
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];

        if (item.positionY >= 550) {
          item.element.remove();
          this.items.splice(i, 1);
        }
      }
    }, 30);
  }

  // COMPROBAR SI EL JUGADOR RECOGE UNA CAJA SORPRESA
  checkItemCollision(item) {
    const playerPosition = this.player.getPosition();
    const itemPosition = item.getPosition();

    if (
      playerPosition.left < itemPosition.right &&
      playerPosition.right > itemPosition.left &&
      playerPosition.top < itemPosition.bottom &&
      playerPosition.bottom > itemPosition.top
    ) {
      // Eliminar la caja de la carretera
      item.element.remove();

      // Eliminar la caja del array
      const index = this.items.indexOf(item);

      if (index !== -1) {
        this.items.splice(index, 1);
      }

      // Conseguir un objeto aleatorio
      this.currentItem = this.getRandomItem();
      // Actualizar el marcador
      this.updateDisplay();

      console.log("Has conseguido:", this.currentItem);
    }
  }
  // DETENER LAS CAJAS SORPRESA
  stopItems() {
    clearInterval(this.newItem);
    clearInterval(this.moveItems);
  }

  // ELIMINAR TODAS LAS CAJAS
  clearItems() {
    this.items.forEach((item) => {
      item.element.remove();
    });

    this.items.splice(0, this.items.length);
  }
  // DETENER LAS CAJAS SORPRESA
  stopItems() {
    clearInterval(this.newItem);
    clearInterval(this.moveItems);
  }

  // ELIMINAR TODAS LAS CAJAS
  clearItems() {
    this.items.forEach((item) => {
      item.element.remove();
    });

    this.items.splice(0, this.items.length);
  }
  // CONSEGUIR UN OBJETO ALEATORIO
  getRandomItem() {
    const items = ["🚀", "🛡️", "🔥"];

    const randomNumber = Math.floor(Math.random() * items.length);

    return items[randomNumber];
  }
  // LANZAR COHETE
  launchRocket() {
    // Solo lanzar si tenemos un cohete
    if (this.currentItem !== "🚀") {
      return;
    }

    // Obtener la posición del coche
    const playerPosition = this.player.getPosition();
    const roadPosition = road.getBoundingClientRect();

    // Calcular la posición del cohete dentro de la carretera
    const positionX =
      playerPosition.left - roadPosition.left + playerPosition.width / 2 - 20;

    const positionY = playerPosition.top - roadPosition.top - 40;

    // Crear el cohete
    const rocket = new Rocket(positionX, positionY);

    this.rockets.push(rocket);

    // Gastar el objeto
    this.currentItem = null;
    this.updateDisplay();
  }
  // MOVER COHETES
  startRockets() {
    this.moveRockets = setInterval(() => {
      this.rockets.forEach((rocket) => {
        rocket.moveUp();
        // Comprobar si ha chocado con un enemigo
        this.checkRocketCollision(rocket);
      });

      // Eliminar los cohetes que salen de la carretera
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const rocket = this.rockets[i];

        if (rocket.positionY < -40) {
          rocket.element.remove(); // elimina de html
          this.rockets.splice(i, 1); // lo elimina del array
        }
      }
    }, 30);
  }
  stopRockets() {
    clearInterval(this.moveRockets);
  }

  clearRockets() {
    this.rockets.forEach((rocket) => {
      rocket.element.remove();
    });

    this.rockets.splice(0, this.rockets.length);
  }
  // COMPROBAR SI UN COHETE CHOCA CON UN ENEMIGO
  checkRocketCollision(rocket) {
    const rocketPosition = rocket.getPosition();

    this.opponents.forEach((enemy) => {
      const enemyPosition = enemy.getPosition();

      if (
        rocketPosition.left < enemyPosition.right &&
        rocketPosition.right > enemyPosition.left &&
        rocketPosition.top < enemyPosition.bottom &&
        rocketPosition.bottom > enemyPosition.top
      ) {
        // Eliminar el coche enemigo
        enemy.element.remove();

        const enemyIndex = this.opponents.indexOf(enemy);

        if (enemyIndex !== -1) {
          this.opponents.splice(enemyIndex, 1);
        }

        // Eliminar el cohete
        rocket.element.remove();

        const rocketIndex = this.rockets.indexOf(rocket);

        if (rocketIndex !== -1) {
          this.rockets.splice(rocketIndex, 1);
        }

        // Sumar un adelantamiento
        this.addOvertake();
        this.updateDisplay();
      }
    });
  }
  // ACTIVAR ESCUDO
  activateShield() {
    if (this.currentItem !== "🛡️") {
      return;
    }

    // Activar la protección
    this.shieldActive = true;

    // Añadir el efecto al coche
    const car = document.querySelector("#car");
    car.classList.add("shield-active");

    // Gastar el objeto
    this.currentItem = null;
    this.updateDisplay();

    // Desactivar después de 5 segundos
    this.shieldTimer = setTimeout(() => {
      this.deactivateShield();
    }, 5000);
  }

  // DESACTIVAR ESCUDO
  deactivateShield() {
    clearTimeout(this.shieldTimer);
    this.shieldActive = false;
    document.querySelector("#car").classList.remove("shield-active");
  }
  // ACTIVAR ATAQUE EMP
  activateEMP() {
    // Comprobar que tenemos el EMP
    if (this.currentItem !== "💥") {
      return;
    }

    // Obtener la posición del jugador
    const playerPosition = this.player.getPosition();

    // Recorrer los coches enemigos
    for (let i = this.opponents.length - 1; i >= 0; i--) {
      const enemy = this.opponents[i];
      const enemyPosition = enemy.getPosition();

      // Calcular la distancia entre el jugador y el enemigo
      const distanceX = Math.abs(playerPosition.left - enemyPosition.left);
      const distanceY = Math.abs(playerPosition.top - enemyPosition.top);

      // Destruir enemigos cercanos
      if (distanceX < 200 && distanceY < 250) {
        enemy.element.remove();
        this.opponents.splice(i, 1);

        // Sumar un adelantamiento
        this.addOvertake();
      }
    }
    // Efecto visual del EMP
    const car = document.querySelector("#car");

    car.classList.add("emp-active");

    setTimeout(() => {
      car.classList.remove("emp-active");
    }, 500);

    // Gastar el objeto
    this.currentItem = null;
    this.updateDisplay();
  }
  // ACTIVAR NITRO RUSH
  activateNitro() {
    // Comprobar que tenemos el Nitro
    if (this.currentItem !== "🔥") {
      return;
    }

    // Evitar activar dos turbos a la vez
    if (this.nitroActive === true) {
      return;
    }

    // Activar el turbo
    this.nitroActive = true;

    // Aumentar la velocidad temporalmente
    this.speed += 50;

    // Añadir efecto visual al coche
    document.querySelector("#car").classList.add("nitro-active");

    // Gastar el objeto
    this.currentItem = null;
    this.updateDisplay();

    // Desactivar el turbo después de 5 segundos
    this.nitroTimer = setTimeout(() => {
      this.deactivateNitro();
    }, 5000);
  }
  // DESACTIVAR NITRO RUSH
  deactivateNitro() {
    if (this.nitroActive === false) {
      return;
    }

    clearTimeout(this.nitroTimer);

    // Recuperar la velocidad anterior
    this.speed -= 50;

    this.nitroActive = false;

    // Quitar el efecto visual
    document.querySelector("#car").classList.remove("nitro-active");

    this.updateDisplay();
  }
  // MOSTRAR EXPLOSIÓN DEL ESCUDO
  showShieldExplosion(enemy) {
    // Obtener la posición del enemigo
    const enemyPosition = enemy.getPosition();
    const roadPosition = road.getBoundingClientRect();

    // Crear la explosión
    const explosion = document.createElement("div");
    explosion.classList.add("shield-explosion");

    // Colocarla donde está el enemigo
    explosion.style.left = `${enemyPosition.left - roadPosition.left}px`;
    explosion.style.top = `${enemyPosition.top - roadPosition.top}px`;

    road.appendChild(explosion);

    // Eliminar el efecto después de la animación
    setTimeout(() => {
      explosion.remove();
    }, 400);
  }
  // ACTUALIZAR POSICIÓN EN LA CARRERA
  updatePosition() {
    // Hay 15 participantes en total
    let position = 15 - this.overtakes;

    // No podemos superar el primer puesto
    if (position < 1) {
      position = 1;
    }

    let ending = "th";

    if (position === 1) {
      ending = "st";
    } else if (position === 2) {
      ending = "nd";
    } else if (position === 3) {
      ending = "rd";
    }

    document.querySelector("#position").textContent = `${position}${ending}`;
  }
}
