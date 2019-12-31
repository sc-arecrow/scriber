import React from 'react';
import axios from 'axios';

class TagTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = event => {
    event.preventDefault();

    let task = {
      title: null,
      tag_id: this.props.tag.id,
      tagged: this.props.tagged
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .patch(url, {task}, {withCredentials: true})
      .then(response => {
        this.props.updateTasksOfTag(response.data.tasks);
      })
  }

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <button
            type="submit"
            className="btn btn-lg custom-button">
            {this.props.tagged ? "Untag" : "Tag"}
          </button>
        </form>
      </div>
    )
  }
}

export default TagTaskForm;