
const roadGame = document.querySelector("#road");

export class Item {
  constructor(positionX) {
    this.positionX = positionX;
    this.positionY = -40;

    // Crear la caja sorpresa
    this.element = document.createElement("div");
    this.element.classList.add("item");
    this.element.textContent = "❓";

    // Añadirla a la carretera
    roadGame.appendChild(this.element);

    this.updatePosition();
  }

  // Actualizar la posición de la caja
  updatePosition() {
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
  }

  // Mover la caja hacia abajo
  moveDown(speed) {
    this.positionY += speed / 10;
    this.updatePosition();
  }

  // Obtener su posición para detectar colisiones
  getPosition() {
    return this.element.getBoundingClientRect();
  }
}
