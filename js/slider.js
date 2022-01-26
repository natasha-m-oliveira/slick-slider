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
    let movetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.distance.startX = event.clientX;
      movetype = 'mousemove';
    } else {
      this.distance.startX = event.changedTouches[0].clientX;
      movetype = 'touchmove';
    }
    this.wrapper.addEventListener(movetype, this.onMove);
  }
  
  onMove(event) {
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlider(finalPosition);
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.distance.finalPosition = this.distance.movePosition;
  }

  addSliderEvent() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Slider config
  sliderPosition(slider) {
    const margin = (this.wrapper.offsetWidth - slider.offsetWidth) / 2;
    return -(slider.offsetLeft - margin);
  }

  sliderConfig() {
    this.sliderArray = [...this.slider.children].map(element => {
      const position = this.sliderPosition(element);
      return { position, element, };
    });
  }

  sliderIndexNav(index) {
    const last = this.sliderArray.length - 1;
    this.index = {
      prev: index ? index-- : undefined,
      active: index,
      next: index === last ? undefined : index++,
    }
  }

  changeSlider(index) {
    const activeSlider = this.sliderArray[index];
    this.moveSlider(activeSlider.position);
    this.sliderIndexNav(index);
    this.distance.finalPosition = activeSlider.position;
  }

  init() {
    if (this.slider && this.wrapper) {
      this.bindEvents();
      this.addSliderEvent();
      this.sliderConfig();
    }
    return this;
  }
}
