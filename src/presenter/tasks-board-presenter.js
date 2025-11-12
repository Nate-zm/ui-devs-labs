import TaskBoardComponent from '../view/task-board-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import PlugComponent from '../view/plug-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel, UpdateType, UserAction } from '../const.js';
import LoadingViewComponent from '../view/loading-view-component.js';

export default class TasksBoardPresenter {
  #tasksBoardComponent = null;
  #boardContainer = null;
  #tasksModel = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

#loadingComponent = new LoadingViewComponent();

async init() {
  // Показываем загрузку
  this.#clearBoard();
  render(this.#loadingComponent, this.#boardContainer);

  try {
    await this.#tasksModel.init();
    this.#clearBoard();
    this.#renderBoard();
  } catch (err) {
    console.error('Ошибка при инициализации задач:', err);
    this.#clearBoard();
    this.#boardContainer.innerHTML = '<p class="board_no-tasks">Ошибка загрузки данных 😢</p>';
  }
}

  #renderBoard() {
    // создаём доску
    this.#tasksBoardComponent = new TaskBoardComponent();
    render(this.#tasksBoardComponent, this.#boardContainer);

    // описываем колонки
    const lists = [
      { status: Status.BACKLOG, label: StatusLabel[Status.BACKLOG] },
      { status: Status.PENDING, label: StatusLabel[Status.PENDING] },
      { status: Status.COMPLITED, label: StatusLabel[Status.COMPLITED] },
      { status: Status.CART, label: StatusLabel[Status.CART] },
    ];

    // отрисовываем колонки
    for (const { status, label } of lists) {
      this.#renderTasksList(status, label);
    }

    // после отрисовки всех списков — обновим кнопки
    this.#setButtonDisabled();
  }

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

  async createTask() {
    const input = document.getElementById('add-task');
    const taskTitle = input.value.trim();
    if (!taskTitle) return;

    try {
      await this.#tasksModel.addTask(taskTitle);
      input.value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи: ', err);
    }
  }

  async #handleTaskDrop(taskId, newStatus) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи на сервере:', err);
    }
  }


    #renderClearButton(container) {
    const cartTasks = this.#tasksModel.getTasksByStatus(Status.CART);

    const clearButton = new ClearButtonComponent({
      onClick: async () => {
        clearButton.element.disabled = true; // сразу блокируем кнопку
        try {
          await this.#tasksModel.clearBasketTasks(); // очищаем корзину на сервере
        } catch (err) {
          console.error('Ошибка при очистке корзины:', err);
          clearButton.element.disabled = false; // возвращаем доступ, если произошла ошибка
        }
      },
    });

    // если корзина пуста — сразу блокируем кнопку
    if (cartTasks.length === 0) {
      clearButton.element.disabled = true;
    }

    render(clearButton, container);
  }


  //  Заглушка
  #renderPlug(container) {
    const plug = new PlugComponent();
    render(plug, container);
  }

  //  Одна задача
  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  //  Очистка корзины
  clearBucket() {
    this.#tasksModel.clearBucket();
  }

  //  Очистка доски
  #clearBoard() {
    this.#boardContainer.innerHTML = '';
  }

  //  Управление кнопками очистки
  #setButtonDisabled() {
    const clearButtons = document.querySelectorAll('.clear-button');
    clearButtons.forEach((btn) => {
      const cartTasks = this.#tasksModel.getTasksByStatus(Status.CART);
      btn.disabled = cartTasks.length === 0;
    });
  }
  async #handleClearBasketClick() {
  try {
    await this.#tasksModel.clearBasketTasks();
  } catch (err) {
    console.error('Ошибка при очистке корзины:', err);
  }
}

  #handleModelEvent(updateType, payload) {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  }
}
