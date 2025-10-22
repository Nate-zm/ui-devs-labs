import { createElement } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createHeaderComponentTemplate(status, label) {
  return `
    <div class="column">
      <div class="header_item header_${status}">${label}</div>
      <ul class="tasks_list"></ul>
    </div>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor({ status, label, onTaskDrop }) {
    super();
    this.status = status;
    this.label = label;
    this.onTaskDrop = onTaskDrop;
  }

  get template() {
    return createHeaderComponentTemplate(this.status, this.label);
  }

  afterCreate() {
    this.#setDropHandler();
  }

  #setDropHandler() {
    const tasksListElement = this.element.querySelector('.tasks_list');

    // Позволяем бросать элементы
    tasksListElement.addEventListener('dragover', (event) => {
      event.preventDefault();

      const activeElement = document.querySelector('.selected');

      // Если ничего не перетаскивается, выходим
      if (!activeElement) return;

      // Определяем элемент, над которым сейчас курсор
      let currentElement = event.target.closest('.tasks_item');

      // Если на пустое место — просто добавляем в конец
      if (!currentElement) {
        tasksListElement.appendChild(activeElement);
        return;
      }

      // Не даём вставить элемент сам в себя
      if (activeElement === currentElement) return;

      const currentElementRect = currentElement.getBoundingClientRect();
      const currentElementCenter =
        currentElementRect.y + currentElementRect.height / 2;

      const nextElement =
        event.clientY < currentElementCenter
          ? currentElement
          : currentElement.nextElementSibling;

      tasksListElement.insertBefore(activeElement, nextElement);
    });

    // При отпускании
    tasksListElement.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      this.onTaskDrop(taskId, this.status);
    });
  }
}
