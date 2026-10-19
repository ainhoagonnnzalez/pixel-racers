const roadGame = document.querySelector("#road");

export class Opponent {
  constructor() {
    this.positionX = Math.floor(Math.random() * 351);
    this.positionY = -90;

    this.element = document.createElement("div");
    this.element.classList.add("opponent");

    roadGame.appendChild(this.element);
    
  }

  moveDown(speed) {
    this.positionY += speed/10;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
  }
  getPosition(){
    return this.element.getBoundingClientRect(); // tenemos que hacer this.element porque hemos hecho lo de document dentro de la clase, en player lo hacemos fuera, por eso usamos el nombre de la clase
  }

}