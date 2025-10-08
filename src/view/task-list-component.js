import { createElement } from "../framework/render.js";
import { AbstractComponent } from '../framework/view/abstract-component.js';


function createTaskListComponentTemplate(status, label) {
    return (
        `<div class="column">
          <div class="header_item header_${status}">${label}</div>
          <ul class="tasks_list"></ul>
        </div>
        `
      );
}


export default class TaskListComponent  extends AbstractComponent{
  constructor({status, label}){
    super();
    this.status = status;
    this.label = label;
  }
  
  get template() {
    return createTaskListComponentTemplate(this.status, this.label);
  }
}
