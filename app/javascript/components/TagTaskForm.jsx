import React from 'react';
import axios from 'axios';

class TagTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick = () => {
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
    const tag_icon = (<span className="fas fa-tag"></span>);
    return (
      <button
        type="button"
        onClick={this.onClick}
        className={this.props.tagged
          ? 'btn btn-sm custom-button mr-2'
          : this.props.hovering
            ? 'custom-checkbox align-middle hovering mr-2'
            : 'custom-checkbox align-middle mr-2'}>
        {this.props.tagged
          ? tag_icon
          : null}
      </button>
    )
  }
}

export default TagTaskForm;