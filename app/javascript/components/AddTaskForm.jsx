import React from 'react';
import axios from 'axios';

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new_task_title: ""
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit = event => {
    event.preventDefault();

    let task = {
      title: this.state.new_task_title
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks';

    axios
      .post(url, {task}, {withCredentials: true})
      .then(response => {
        if (response.data.task_created) {
          this.props.onChangeTasks(response.data.tasks);
          this.props.onUpdateTasks(response.data.tasks);
          this.setState({new_task_title: ""});
        } else {
          //todo error
          this.setState({new_task_title: ""});
        }
      });
  }

  render () {
    return (
      <div>
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="input-group col-auto">
            <input
              type="text"
              id="new_task_title"
              name="new_task_title"
              className="form-control"
              onChange={this.onChange}
              required
              value={this.state.new_task_title}
              placeholder="New todo">
            </input>
          </div>

          <div className="input-group col-auto">
            <button
              type="submit"
              className="btn custom-button">
              Add
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default AddTaskForm;