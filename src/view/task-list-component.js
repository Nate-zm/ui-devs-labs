import { createElement } from "../framework/render.js";

function createTaskListComponentTemplate(status, label) {
    return (
        `<div class="column">
          <div class="header_item header_${status}">${label}</div>
          <ul class="tasks_list"></ul>
        </div>
        `
      );
}


export default class TaskListComponent {
  
    constructor({status, label}){
        this.status = status;
        this.label = label;
    }

  getTemplate() {
    return createTaskListComponentTemplate(this.status, this.label);
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
