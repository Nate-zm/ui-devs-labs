import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  const { title, status, id } = task;
  return `
    <li class="tasks_item tasks_${status}" data-id="${id}">${title}</li>
  `;
}

export default class TaskComponent extends AbstractComponent {
  constructor({ task }) {
    super();
    this.task = task;
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

  afterCreate() {
    this.#makeTaskDraggable();
  }

  #makeTaskDraggable() {
    this.element.setAttribute('draggable', true);

    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this.task.id);
      this.element.classList.add('selected');
    });

    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('selected');
    });
  }
}

