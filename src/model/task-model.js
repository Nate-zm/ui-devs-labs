import generateID from "../utils.js";
import { Status, UpdateType } from "../const.js";
import Observable from "../framework/observable.js";


export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardTasks;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardTasks = tasks;
    } catch (err) {
      console.error("Ошибка загрузки задач:", err);
      this.#boardTasks = [];
    }

    this._notify(UpdateType.INIT);
  }

  getTasksByStatus(status) {
    return this.#boardTasks.filter((task) => task.status === status);
  }


  async addTask(title) {
    const newTask = {
      id: generateID(),
      title,
      status: Status.BACKLOG,
    };

    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardTasks.push(createdTask);
      this._notify(UpdateType.PATCH, createdTask);
      return createdTask;
    } catch (err) {
      console.error("Ошибка при добавлении задачи:", err);
      throw err;
    }
  }


async updateTaskStatus(taskId, newStatus) {
  const task = this.#boardTasks.find((task) => task.id === taskId);
  if (!task) return;

  const previousStatus = task.status;
  task.status = newStatus;

  try {
    const updatedTask = await this.#tasksApiService.updateTask(task);
    Object.assign(task, updatedTask);

    // уведомляем презентер
    this._notify(UpdateType.PATCH, task);

  } catch (err) {
    console.error('Ошибка при обновлении статуса задачи на сервере: ', err);
    task.status = previousStatus;
    throw err;
  }
}


  async clearBucket() {
    const cartTasks = this.#boardTasks.filter(
      (task) => task.status === Status.CART
    );

    try {
      // удаляем с сервера
      await Promise.all(
        cartTasks.map((task) => this.#tasksApiService.deleteTask(task.id))
      );

      // удаляем локально
      this.#boardTasks = this.#boardTasks.filter(
        (task) => task.status !== Status.CART
      );

      this._notify(UpdateType.PATCH);
    } catch (err) {
      console.error("Ошибка при очистке корзины:", err);
    }
  }


  //  Удаление одной задачи локально и уведомление презентера
  deleteTask(taskId) {
    this.#boardTasks = this.#boardTasks.filter((task) => task.id !== taskId);
    this._notify(UpdateType.PATCH, { id: taskId });
  }

  // Очистка всех задач 
  async clearBasketTasks() {
    const basketTasks = this.#boardTasks.filter(
      (task) => task.status === Status.CART
    );

    try {
      // Удаляем все задачи из корзины на сервере
      await Promise.all(
        basketTasks.map((task) => this.#tasksApiService.deleteTask(task.id))
      );

      // Удаляем их из локального массива
      this.#boardTasks = this.#boardTasks.filter(
        (task) => task.status !== Status.CART
      );

      // Уведомляем наблюдателей
      this._notify(UpdateType.PATCH, { status: Status.CART });
    } catch (err) {
      console.error('Ошибка при удалении задач из корзины на сервере:', err);
      throw err;
    }
  }

  // Проверка: есть ли задачи в корзине
  hasBasketTasks() {
    return this.#boardTasks.some((task) => task.status === Status.CART);
  }
}


