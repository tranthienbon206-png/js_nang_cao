import { AboutView } from '../views/AboutView.js';

export default class AboutController {
  index() {
    document.querySelector('#app').innerHTML = AboutView();
  }
}