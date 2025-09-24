import { createElement } from "../framework/render.js";

function createTaskListComponentTemplate() {
    return (
        `<div class="column">
          <div class="header_item header_backlog">Бэклог</div>
          <ul class="tasks_list"></ul>
        </div>
        `
      );
}

export default class TaskListComponent {
  getTemplate() {
    return createTaskListComponentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
