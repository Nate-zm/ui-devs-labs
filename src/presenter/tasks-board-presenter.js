import TaskBoardComponent from '../view/task-board-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import PlugComponent from '../view/plug-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';

export default class TasksBoardPresenter {
  #tasksBoardComponent = null;
  #boardContainer = null;
  #tasksModel = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  init() {
    // очищаем контейнер
    this.#clearBoard();

    // создаём новый экземпляр доски
    this.#tasksBoardComponent = new TaskBoardComponent();
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
  const listComponent = new TaskListComponent({
    status,
    label,
    onTaskDrop: this.#handleTaskDrop.bind(this),
  });

  render(listComponent, this.#tasksBoardComponent.element);

  const tasks = this.#tasksModel.tasks.filter((task) => task.status === status);
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



  
    #handleTaskDrop(taskId, newStatus){
      this.#tasksModel.updateTaskStatus(taskId, newStatus)
    }

  // создаем задачу
  createTask() {
    const input = document.getElementById('add-task');
    const taskTitle = input.value.trim();
    if (!taskTitle) return;
    this.#tasksModel.addTask(taskTitle);
    input.value = '';
  }

  // функция отрисовки одной задачи
  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  // функция отрисовки кнопки очистки
  #renderClearButton(container) {
  const cartTasks = this.#tasksModel.getTasksByStatus(Status.CART);

  const clearButton = new ClearButtonComponent({
    onClick: () => {
      this.clearBucket();
      clearButton.element.disabled = true;  // отключаем кнопку сразу после очистки
    }
  });

  if (cartTasks.length === 0) {
    clearButton.element.disabled = true; // если корзина изначально пуста
  }

  render(clearButton, container);
}

  // функция отрисовки заглушки
  #renderPlug(container) {
    const plug = new PlugComponent();
    render(plug, container);
  }

  clearBucket() {
    this.#tasksModel.clearBucket();
  }

  // при изменении модели пересоздаём всю доску
  #handleModelChange() {
    this.init();
  }

  #clearBoard() {
    this.#boardContainer.innerHTML = ''; // очищаем контейнер
  }

  
}
