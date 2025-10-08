import {createElement} from '../framework/render.js'; 
import { AbstractComponent } from '../framework/view/abstract-component.js';


function createClearButtonTemplate() {
    return (
        '<button id="button" class="tasks_clear-button">⨉ Очистить</button>'
      );
}


export default class ClearButtonComponent extends AbstractComponent {
  constructor(){
    super();
  }

  get template() {
    return createClearButtonTemplate();
  }

}