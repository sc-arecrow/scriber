import React from 'react';
import axios from 'axios';

class EditTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.task.title
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
      title: this.state.title
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .patch(url, {task}, {withCredentials: true})
      .then(response => {
        if (response.data.task_updated) {
          this.props.onChangeTasks(response.data.tasks);
          this.props.onChangeEdit();
        } else {
          //todo error
          this.props.onChangeEdit();
        }
      });
  }

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="title"
            value={this.state.title}
            required
            onChange={this.onChange}
            >
          </input>
          <button
            type="submit"
            className="btn btn-lg custom-button">
            Edit
          </button>
        </form>
      </div>
    )
  }
}

export default EditTaskForm;