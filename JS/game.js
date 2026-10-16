class Game{
    constructor(){
        this.time = 60;
        this.speed = 60;
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