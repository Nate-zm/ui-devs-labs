import HeaderComponent  from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import {render, RenderPosition} from './framework/render.js';
import TasksApiService from './tasks-api-service.js';
import TasksModel from './model/task-model.js';

const END_POINT = "https://6914cc133746c71fe049a67f.mockapi.io/Nate/api"
const bodyContainer= document.querySelector('.app');
const formContainer = document.querySelector('.form-container');
const taskBoardContainer = document.querySelector('.task-board');
const tasksModel = new TasksModel({tasksApiService: new TasksApiService(END_POINT)});

const tasksBoardPresenter = new TasksBoardPresenter({boardContainer: taskBoardContainer,tasksModel,})

const formAddTaskComponent = new FormAddTaskComponent({
    onClick: handleNewTaskButtonClick
});

function handleNewTaskButtonClick() {
    tasksBoardPresenter.createTask();
}

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(formAddTaskComponent, formContainer, RenderPosition.AFTERBEGIN);

tasksBoardPresenter.init();
