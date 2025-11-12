import {createElement} from '../framework/render.js'; 
import { AbstractComponent } from '../framework/view/abstract-component.js';


function createHeaderComponentTemplate() {
    return (
        `<li class = "tasks_plug">Перетащите карточку</li>`      
    );
}


export default class PlugComponent extends AbstractComponent{
    constructor(){
      super();
    }

  get template(){
        return createHeaderComponentTemplate();
  }
}
