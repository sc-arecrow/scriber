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
      title: this.state.title,
      tag_id: "editing title",
      tagged: null
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .patch(url, {task}, {withCredentials: true})
      .then(response => {
        if (response.data.task_updated) {
          this.props.onChangeTasks(response.data.tasks);
          this.props.onUpdateTasks(response.data.tasks);
          this.props.onChangeEdit();
        } else {
          //todo error
          console.log("nope");
          this.props.onChangeEdit();
        }
      });
  }

  render () {
    return (
      <div className="ml-4">
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="input-group col-auto">
            <input
              type="text"
              name="title"
              className="form-control"
              value={this.state.title}
              required
              onChange={this.onChange}>
            </input>
          </div>

          <div className="input-group col-auto">
            <button
              type="submit"
              className="btn custom-button">
              Edit
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default EditTaskForm;