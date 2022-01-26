import { SliderNav } from './slider.js';

const slider = new SliderNav('.slider', '.slider-wrapper');
slider.init();
slider.addArrow('.prev', '.next');
slider.addControl();
