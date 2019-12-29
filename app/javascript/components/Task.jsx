import React from 'react';
import axios from 'axios';

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completed: false,
      hovering: false
    }

    this.onCheck = this.onCheck.bind(this);
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
        </div>
        <div>
          <button
            className='remove-button'
            onClick={this.onRemove}>  
          </button>
        </div>
      </li>
    )
  }
}

export default Task;