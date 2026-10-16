const startScreen = document.querySelector("#start-screen")
const gameScreen = document.querySelector("#game-screen")
const endGame = document.querySelector("#end-game")
const startGame = document.querySelector("#start-btn")
const restartGame = document.querySelector("#restart-btn")

// ocultamos pantallas GAME y ENDGAME
gameScreen.style.display = "none"
endGame.style.display = "none"

// click en el boton
startGame.addEventListener("click", ()=>{
    startScreen.style.display = "none"
    gameScreen.style.display = "block"
})

restartGame.addEventListener("click", ()=>{
    endGame.style.display = "none"
    startScreen.style.display = "block"
})

class Game{
    constructor(){
        this.time = 60,
        this.speed = 60, 
        this.overtakes = 0;
    }
    increaseSpeed(){
        this.speed += 20;
    }
    addOvertake(){
        this.overtakes += 1;
    }
}

const game = new Game();

