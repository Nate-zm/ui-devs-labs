import TaskBoardComponent from '../view/task-board-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import PlugComponent from '../view/plug-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';

export default class TasksBoardPresenter {
  #tasksBoardComponent = new TaskBoardComponent();
  #boardContainer = null;
  #tasksModel = null;
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    // получаем задачи
    this.#boardTasks = [...this.#tasksModel.tasks];

    // рендерим общую доску
    render(this.#tasksBoardComponent, this.#boardContainer);

    // создаём список колонок
    const lists = [
      { status: Status.BACKLOG, label: StatusLabel[Status.BACKLOG] },
      { status: Status.PENDING, label: StatusLabel[Status.PENDING] },
      { status: Status.COMPLITED, label: StatusLabel[Status.COMPLITED] },
      { status: Status.CART, label: StatusLabel[Status.CART] },
    ];

    // отрисовываем все колонки
    for (const { status, label } of lists) {
      this.#renderTasksList(status, label);
    }
  }

  // функция отрисовки списка задач
  #renderTasksList(status, label) {
    const listComponent = new TaskListComponent({ status, label });
    render(listComponent, this.#tasksBoardComponent.element);

    const tasks = this.#boardTasks.filter((task) => task.status === status);
    const tasksContainer = listComponent.element.querySelector('.tasks_list');

    if (tasks.length === 0) {
      this.#renderPlug(tasksContainer);
    } else {
      tasks.forEach((task) => this.#renderTask(task, tasksContainer));
    }

    if (status === Status.CART) {
      this.#renderClearButton(listComponent.element);
    }
  }

  // функция отрисовки одной задачи
  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  // функция отрисовки кнопки очистки
  #renderClearButton(container) {
    const button = new ClearButtonComponent();
    render(button, container);
  }

  // функция отрисовки заглушки
  #renderPlug(container) {
    const plug = new PlugComponent();
    render(plug, container);
  }
}
