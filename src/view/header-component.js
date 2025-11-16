import { createElement } from "../framework/render.js";
import { AbstractComponent } from '../framework/view/abstract-component.js';


function createHeaderComponentTemplate() {
    return (
        `    <header>
      <div class="header">
        <h1 class="title">Список задач</h1>
      </div>
    </header>
        `
      );
}

export default class HeaderComponent extends AbstractComponent {
  constructor(){
    super();
  }

  get template() {
    return createHeaderComponentTemplate();
  }
}
