const carPlayer = document.querySelector("#car");

export class Player {
  constructor() {
    this.positionX = 175;
  }

  moveRight() {
    if (this.positionX <= 330) {
      this.positionX += 20;
      this.updatePosition();
    }
  }

  moveLeft() {
    if (this.positionX >= 20) {
      this.positionX -= 20;
      this.updatePosition();
    }
  }

  updatePosition() {
    carPlayer.style.left = `${this.positionX}px`;
  }
  getPosition() {
    const position = carPlayer.getBoundingClientRect(); // obtener su posicion y dimensiones
    return position
  }
}