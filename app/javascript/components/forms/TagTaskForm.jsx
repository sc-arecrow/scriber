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
      checked: "false",
      tag_id: this.props.tag.id
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .patch(url, {task}, {withCredentials: true})
      .then(response => {
        if (this.props.update_from == "task") {
          this.props.updateTasksOfTag(response.data.tasks);
        } else {
          this.props.updateTagsOfTask(response.data.tags);
        }
      });
  }

  render () {
    const tag_icon = (<span className="fas fa-tag"></span>);
    return (
      <button
        type="button"
        onClick={this.onClick}
        className={this.props.tagged
          ? 'btn btn-sm custom-button ' + (this.props.update_from == "task" ? "ml-2" : "mr-2")
          : this.props.hovering
            ? 'custom-checkbox align-middle hovering ' + (this.props.update_from == "task" ? "ml-2" : "mr-2")
            : 'custom-checkbox align-middle ' + (this.props.update_from == "task" ? "ml-2" : "mr-2")}>
        {this.props.tagged
          ? tag_icon
          : null}
      </button>
    )
  }
}

export default TagTaskForm;