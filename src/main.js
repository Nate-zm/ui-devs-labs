import HeaderComponent  from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/task-board-component.js';
import TaskListComponent from './view/task-list-component.js';
import TaskComponent from './view/task-component.js';
import {render, RenderPosition} from './framework/render.js';

const bodyContainer= document.querySelector('.app');
const formContainer = document.querySelector('.form-container');
const taskBoardContainer = document.querySelector('.task-board');

const taskBoardComponent = new TaskBoardComponent();

const taskListContainer = taskBoardComponent.getElement();

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(new FormAddTaskComponent(), formContainer, RenderPosition.AFTERBEGIN);
render(taskBoardComponent, taskBoardContainer, RenderPosition.AFTERBEGIN);
//ЦИКЛ
for (let j = 0; j < 4; j++) {
  const taskListComponent = new TaskListComponent();
  render(taskListComponent, taskBoardComponent.getElement(), RenderPosition.BEFOREEND);

  const ul = taskListComponent.getElement().querySelector('.tasks_list');

  for (let i = 0; i < 4; i++) {
    render(new TaskComponent(), ul, RenderPosition.BEFOREEND);
  }
}
