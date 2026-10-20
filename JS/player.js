const carPlayer = document.querySelector("#car");

export class Player {
  constructor() {
    this.positionX = 175;
    this.lane = 1;
    this.lanes = [42, 175, 308];
  }

  moveRight() {
  if (this.lane < 2) {
    this.lane++;
    this.positionX = this.lanes[this.lane];
    this.updatePosition();
  }
}

  moveLeft() {
  if (this.lane > 0) {
    this.lane--;
    this.positionX = this.lanes[this.lane];
    this.updatePosition();
  }
}

  updatePosition() {
    carPlayer.style.left = `${this.positionX-15}px`;
  }
  getPosition() {
    const position = carPlayer.getBoundingClientRect(); // obtener su posicion y dimensiones
    return position
  }
}