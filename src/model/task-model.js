import { tasks } from '../mock/task.js'

export default class TaskModel{
    #boardTasks = tasks;

    get tasks(){
        return this.#boardTasks;
    }
}