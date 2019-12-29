import React from 'react';
import axios from 'axios';
import EditTaskForm from './EditTaskForm';

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completed: false,
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
    if (this.state.completed) {
      this.setState({completed: false});
    } else {
      this.setState({completed: true});
    }
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
      });
  }

  onMouseEnter = () => {
    this.setState({hovering: true});
  }

  onMouseLeave = () => {
    this.setState({hovering: false});
  }

  render () {
    let completed = this.state.completed;
    let hovering = this.state.hovering;

    return (
      <li
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        >
        
        <div>
          <label className={completed ? 'task-container completed' : 'task-container'}>
            <input 
              type='button'
              className={completed
                ? 'custom-checkbox checked' 
                : hovering
                  ? 'custom-checkbox hovering'
                  : 'custom-checkbox'}
              onClick={this.onCheck}></input>
            {this.props.task.title}
          </label>

          <button
            className='open-edit-button'
            onClick={this.onChangeEdit}>  
          </button>

          <button
            className='remove-button'
            onClick={this.onRemove}>  
          </button>
        </div>

        <div>
          {this.state.show_edit 
            ? <EditTaskForm 
                user={this.props.user}
                task={this.props.task}
                onChangeEdit={this.onChangeEdit}
                onChangeTasks={this.props.onChangeTasks}/> 
            : null}
        </div>
      </li>
    )
  }
}

export default Task;