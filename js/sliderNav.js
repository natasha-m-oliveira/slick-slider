import Slider from './slider.js';

export default class SliderNav extends Slider {
  constructor(slider, wrapper) {
    super(slider, wrapper);
    this.bindControlEvents();
  }

  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlider);
    this.nextElement.addEventListener('click', this.activeNextSlider);
  }

  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slider';

    this.sliderArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slider${index + 1}">${index + 1}</a></li>`;
    });
    this.wrapper.appendChild(control);

    return control;
  }

  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlider(index);
    });
    this.wrapper.addEventListener('changeEvent', this.activeControlItem);
  }

  activeControlItem() {
    this.controlArray.forEach((item) => item.classList.remove(this.activeClass));
    this.controlArray[this.index.active].classList.add(this.activeClass);

    if (this.index.prev === undefined) {
      this.prevElement.style.opacity = '0';
      this.prevElement.style.cursor = 'default';
    } else if (this.index.next === undefined) {
      this.nextElement.style.opacity = '0';
      this.nextElement.style.cursor = 'default';
    } else {
      this.prevElement.style.opacity = '1';
      this.nextElement.style.opacity = '1';
      this.prevElement.style.cursor = 'pointer';
      this.nextElement.style.cursor = 'pointer';
    }
  }

  addControl(customControl) {
    this.control = document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];

    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
