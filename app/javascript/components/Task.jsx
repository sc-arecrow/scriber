import React from 'react';
import axios from 'axios';
import EditTaskForm from './EditTaskForm';
import TagTaskForm from "./TagTaskForm";

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: (this.props.task.checked == "true"),
      hovering: false,
      show_edit: false
    }

    this.onCheck = this.onCheck.bind(this);
    this.onChangeEdit = this.onChangeEdit.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onCheck = () => {
    let task = {
      title: this.props.task.title,
      checked: (this.state.checked ? "false" : "true"),
      tag_id: "checking task",
      tagged: null
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .patch(url, {task}, {withCredentials: true})
      .then(response => {
        if (response.data.task_updated) {
          this.props.onChangeTasks(response.data.tasks);
          this.props.onUpdateTasks(response.data.tasks);
          if (this.state.checked) {
            this.setState({checked: false});
          } else {
            this.setState({checked: true});
          }
        } else {
          //todo error
        }
      })
  }

  onChangeEdit = () => {
    if (this.state.show_edit) {
      this.setState({show_edit: false});
    } else {
      this.setState({show_edit: true});
    }
  }

  onRemove = () => {
    const url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .delete(url, {withCredentials: true})
      .then(response => {
        this.props.onChangeTasks(response.data.tasks);
        this.props.onUpdateTasks(response.data.tasks);
      });
  }

  onMouseEnter = () => {
    this.setState({hovering: true});
  }

  onMouseLeave = () => {
    this.setState({hovering: false});
  }

  render () {
    let checked = this.state.checked;
    let hovering = this.state.hovering;

    const checkbox = 
      (
        <input 
          type='button'
          className={checked
            ? 'custom-checkbox align-middle checked' 
            : hovering
              ? 'custom-checkbox align-middle hovering'
              : 'custom-checkbox align-middle'}
          onClick={this.onCheck}>
        </input>
      );

    return (
      <li
        className={checked
          ? "list-group-item list-group-item-action list-group-item-dark"
          : "list-group-item list-group-item-action"}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        >
        
        <div className="d-flex justify-content-between">
          <div>
            {this.props.toggle_tag
              ? null
              : checkbox}

            <label className={checked ? 'completed ml-3' : "ml-3"}>
              {this.props.task.title}
            </label>
          </div>

          <div>
            {this.props.toggle_tag
              ? <TagTaskForm 
                  hovering={this.state.hovering}
                  user={this.props.user}
                  task={this.props.task}
                  tag={this.props.tag_toggled}
                  tagged={this.props.tagged}
                  getTasksOf={this.props.getTasksOf}
                  updateTasksOfTag={this.props.updateTasksOfTag}/> 
              : null}
            
            <button
              type="button"
              className='btn btn-sm custom-button mr-2'
              onClick={this.onChangeEdit}>
              <span className="far fa-edit"></span>
            </button>

            <button
              type="button"
              className='btn btn-sm custom-button'
              onClick={this.onRemove}>
              <span className="fas fa-trash-alt"></span>
            </button>
          </div>
        </div>

        <div>
          {this.state.show_edit 
            ? <EditTaskForm 
                user={this.props.user}
                task={this.props.task}
                onChangeEdit={this.onChangeEdit}
                onChangeTasks={this.props.onChangeTasks}
                onUpdateTasks={this.props.onUpdateTasks}/> 
            : null}
        </div>
      </li>
    )
  }
}

export default Task;