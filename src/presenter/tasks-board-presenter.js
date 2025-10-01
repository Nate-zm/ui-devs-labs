import TaskBoardComponent from '../view/task-board-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import { render } from '../framework/render.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import {Status, StatusLabel} from '../const.js';


export default class TasksBoardPreseter{
#tasksBoardComponent = new TaskBoardComponent();
#boardContainer = null;
#tasksModel = null;

#boardTasks  = [];

    constructor({boardContainer, tasksModel}) {
        this.#boardContainer = boardContainer;
        this.#tasksModel = tasksModel;
    }

    init() {
  this.#boardTasks = [...this.#tasksModel.getTasks()];

  // рендерим общий контейнер для доски
  render(this.#tasksBoardComponent, this.#boardContainer);

  // колонКИ
  const lists = [
    { status: Status.BACKLOG, label: StatusLabel[Status.BACKLOG] },
    { status: Status.PENDING, label: StatusLabel[Status.PENDING] },
    { status: Status.COMPLITED, label: StatusLabel[Status.COMPLITED] },
    { status: Status.CART, label: StatusLabel[Status.CART] },
  ];

  
  const listComponents = {};

  // создаём и рендерим все колонки
  for (const { status, label } of lists) {
    const listComponent = new TaskListComponent({ status, label });
    render(listComponent, this.#tasksBoardComponent.getElement());
    listComponents[status] = listComponent;
  }

  // раскладываем задачи по колонкам
  for (const task of this.#boardTasks) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, listComponents[task.status].getElement().querySelector('.tasks_list'));
  }

  
  render(new ClearButtonComponent(), listComponents[Status.CART].getElement());
}

}

