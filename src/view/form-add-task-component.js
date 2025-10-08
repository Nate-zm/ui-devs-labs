import { createElement } from "../framework/render.js";
import { AbstractComponent } from '../framework/view/abstract-component.js';


function createFormAddTaskComponentTemplate() {
    return (
        `<form class="add-task-form">
        <h2 class="add-task-form_title">Новая задача</h2>
        <div class="add-task-form_row"></div>
        <input
          type="text"
          placeholder="Название задачи..."
          class="add-task-form_input"
        />
        <input
          type="submit"
          value="+ Добавить"
          class="add-task-form_submit"
        />
      </form>
        `
      );
}

export default class FormAddTaskComponent extends AbstractComponent {
  constructor(){
    super();
  }

  get template() {
    return createFormAddTaskComponentTemplate();
  }

}
