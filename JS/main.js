const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const endGame = document.querySelector("#end-game");
const startGame = document.querySelector("#start-btn");
const restartGame = document.querySelector("#restart-btn");

const speedPlayer = document.querySelector("#speed");
const overtakesPlayer = document.querySelector("#overtakes");
const timePlayer = document.querySelector("#time");

const carPlayer = document.querySelector("#car")
const roadGame = document.querySelector("#road")

//crear los oponentes
const opp = document.createElement("div")
opp.classList.add("opponent")

// ocultamos pantallas GAME y ENDGAME
gameScreen.style.display = "none";
endGame.style.display = "none";

// click en el boton
startGame.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  game.updateDisplay();
  game.startTimer();
  
});

restartGame.addEventListener("click", () => {
  endGame.style.display = "none";
  gameScreen.style.display = "block";
  game.resetGame();
  game.startTimer();
  
});

class Game {
  constructor() {
    this.time = 60;
    this.speed = 60;
    this.overtakes = 0;
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
    const gameTimer = setInterval(() => {
      // ejecutar una accion cada segundo
      this.time--;
      this.updateDisplay(); // actualizar en html
      if (this.time === 0) {
        clearInterval(gameTimer);
        gameScreen.style.display = "none";
        endGame.style.display = "block";
      }
    }, 1000);
  }
  resetGame(){
    this.time = 60
    this.speed = 60
    this.overtakes = 0
    this.updateDisplay();
  }
}
const game = new Game();


// player

class Player{
    constructor(){
        this.positionX = 175;
    }
    moveRight(){
        if(this.positionX   <= 330){
            this.positionX += 20
            this.updatePosition();
        }
        
    }
    moveLeft(){
        if(this.positionX  >= 20){
            this.positionX -= 20
            this.updatePosition();
        }
        
    }
    updatePosition() {
        carPlayer.style.left = `${this.positionX}px`;
    }
}

const player = new Player();

document.addEventListener("keydown", (event)=>{
    if(event.key === "ArrowRight"){
        player.moveRight();
    }else if(event.key === "ArrowLeft"){
        player.moveLeft();
    }
    
})

class Opponent{
    constructor(){
        this.positionX = 175;
        this.positionY = -90

    }
    moveDown(){
        this.positionY += 5;
    }
    

}

const opponent = new Opponent();