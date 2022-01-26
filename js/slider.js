export default class Slider {
  constructor(slider, wrapper) {
    this.slider = document.querySelector(slider);
    this.wrapper = document.querySelector(wrapper);
    this.distance = { finalPosition: 0, startX: 0, movement: 0, }
  }

  moveSlider(distanceX) {
    this.distance.movePosition = distanceX;
    this.slider.style.transform = `translate3d(${distanceX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.distance.movement = (this.distance.startX - clientX) * 1.6;
    return this.distance.finalPosition - this.distance.movement;
  }

  onStart(event) {
    event.preventDefault();
    this.distance.startX = event.clientX;
    this.wrapper.addEventListener('mousemove', this.onMove);
  }
  
  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlider(finalPosition);
  }

  onEnd(event) {
    this.wrapper.removeEventListener('mousemove', this.onMove);
    this.distance.finalPosition = this.distance.movePosition;
  }

  addSliderEvent() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    if (this.slider && this.wrapper) {
      this.bindEvents();
      this.addSliderEvent(); 
    }
    return this;
  }
}
