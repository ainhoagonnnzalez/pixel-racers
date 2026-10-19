const roadGame = document.querySelector("#road");

export class PowerUp {
  constructor() {
    this.positionX = Math.floor(Math.random() * 350);
    this.positionY = -40;
    this.element = document.createElement("div");
    this.element.classList.add("rayo");
    this.element.textContent = "⚡";
    roadGame.appendChild(this.element);
  }
  // metodos
  updatePosition(){
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
  }
  moveDown() {
    this.positionY += 5;
    this.updatePosition();
  }
  getPosition() {
  return this.element.getBoundingClientRect();
}

}
