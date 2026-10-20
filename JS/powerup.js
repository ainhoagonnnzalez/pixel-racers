const roadGame = document.querySelector("#road");

export class PowerUp {
  constructor(positionX) {
    this.positionX = positionX;
    this.positionY = -40;
    this.element = document.createElement("div");
    this.element.classList.add("rayo");
    this.element.textContent = "⚡";
    roadGame.appendChild(this.element);
    this.updatePosition();
  }
  // metodos
  updatePosition(){
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
  }
  moveDown(speed) {
  this.positionY += speed / 10;
  this.updatePosition();
}
  getPosition() {
  return this.element.getBoundingClientRect();
}

}
