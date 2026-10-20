const roadGame = document.querySelector("#road");

export class Opponent {
  constructor(positionX, color) {
    this.positionX = positionX;
    this.positionY = -90;

    this.element = document.createElement("div");
    this.element.classList.add("opponent");

    // Mostrar el coche enemigo según su color
    this.element.style.backgroundImage = `url("./images/coche_${color}.png")`;
    this.element.style.backgroundSize = "contain";
    this.element.style.backgroundPosition = "center";
    this.element.style.backgroundRepeat = "no-repeat";
    this.element.style.backgroundColor = "transparent";

    roadGame.appendChild(this.element);
    this.updatePosition();
  }

  moveDown(speed) {
    this.positionY += speed / 10;
    this.updatePosition();
  }

  updatePosition() {
  // Restamos 15px para centrar el coche de 80px
  this.element.style.left = `${this.positionX - 15}px`;
  this.element.style.top = `${this.positionY}px`;
}
  getPosition() {
    return this.element.getBoundingClientRect(); // tenemos que hacer this.element porque hemos hecho lo de document dentro de la clase, en player lo hacemos fuera, por eso usamos el nombre de la clase
  }
}
