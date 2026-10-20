const road = document.querySelector("#road");

export class Rocket {
  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;

    // Crear el cohete
    this.element = document.createElement("div");
    this.element.classList.add("rocket");
    this.element.textContent = "🚀";

    road.appendChild(this.element);

    this.updatePosition();
  }

  // Actualizar la posición del cohete
  updatePosition() {
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
  }

  // Mover el cohete hacia arriba
  moveUp() {
    this.positionY -= 10;
    this.updatePosition();
  }
  // Obtener la posición del cohete
  getPosition() {
    return this.element.getBoundingClientRect();
  }
}
