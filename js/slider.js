import debounce from './debounce.js';

export default class Slider {
  constructor(slider, wrapper) {
    this.slider = document.querySelector(slider);
    this.wrapper = document.querySelector(wrapper);
    this.distance = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = 'active';

    // Criando um novo evento
    this.changeEvent = new Event('changeEvent');
  }

  transition(active) {
    this.slider.style.transition = active ? 'transform .3s' : '';
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
    this.transition(false);
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
    this.transition(true);
    this.changeSliderOnEnd();
  }

  changeSliderOnEnd() {
    if (this.distance.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlider();
    } else if (this.distance.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlider();
    } else {
      this.changeSlider(this.index.active);
    }
  }

  addSliderEvent() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // Slider config
  sliderPosition(slider) {
    const margin = (this.wrapper.offsetWidth - slider.offsetWidth) / 2;
    return -(slider.offsetLeft - margin);
  }

  sliderConfig() {
    this.sliderArray = [...this.slider.children].map((element) => {
      const position = this.sliderPosition(element);
      return { position, element };
    });
  }

  sliderIndexNav(index) {
    const last = this.sliderArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlider(index) {
    const activeSlider = this.sliderArray[index];
    this.moveSlider(activeSlider.position);
    this.sliderIndexNav(index);
    this.distance.finalPosition = activeSlider.position;
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  changeActiveClass() {
    this.sliderArray.forEach((item) => item.element.classList.remove(this.activeClass));
    this.sliderArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlider() {
    if (this.index.prev !== undefined) this.changeSlider(this.index.prev);
  }

  activeNextSlider() {
    if (this.index.next !== undefined) this.changeSlider(this.index.next);
  }

  onResize() {
    const timer = setInterval(() => {
      this.sliderConfig();
      this.changeSlider(this.index.active);
      clearInterval(timer);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);

    this.activePrevSlider = this.activePrevSlider.bind(this);
    this.activeNextSlider = this.activeNextSlider.bind(this);
  }

  init() {
    if (this.slider && this.wrapper) {
      this.bindEvents();
      this.transition(true);
      this.addSliderEvent();
      this.sliderConfig();
      this.addResizeEvent();
      this.changeSlider(3);
    }
    return this;
  }
}
