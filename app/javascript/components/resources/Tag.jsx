import React from 'react';
import axios from 'axios';

import EditTagForm from '../forms/EditTagForm';
import TagTaskForm from '../forms/TagTaskForm';

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      show_edit: false
    }

    this.onClick = this.onClick.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  onClick = () => {
    if (this.state.clicked) {
      this.props.onToggleTag("close");
      this.setState({
        clicked: false,
        show_edit: false
      });
    } else {
      this.props.onToggleTag(this.props.tag);
      this.setState({
        clicked: true,
        show_edit: true
      });
    }
  }

  onRemove = () => {
    const url = '/users/' + this.props.user.id.toString() + '/tags/' + this.props.tag.id.toString();

    axios
      .delete(url, {withCredentials: true})
      .then(response => {
        this.props.onChangeTags(response.data.tags);
      });
  }

  onFilter = () => {
    if (this.props.filtered) {
      this.props.onFilter(false);
      this.props.onFilterTag(false, null);
    } else {
      this.props.onFilter(true);
      this.props.onFilterTag(true, this.props.tag);
    }
  }

  render () {
    const edit_and_delete_button = 
    (
      <div>
        <button
          type="button"
          className='btn btn-sm custom-button mr-2'
          onClick={this.onClick}>
          <span className="far fa-edit"></span>
        </button>
        <button
          type="button"
          className='btn btn-sm custom-button'
          onClick={this.onRemove}>
          <span className="fas fa-trash-alt"></span>
        </button>
      </div>
    );

    const normal = 
    (
      <div className="d-flex justify-content-between">
        <div>
          {(this.props.toggle_task)
            ? <TagTaskForm 
                hovering={this.state.hovering}
                user={this.props.user}
                task={this.props.task_toggled}
                tag={this.props.tag}
                tagged={this.props.tagged}
                getTasksOf={this.props.getTasksOf}
                updateTagsOfTask={this.props.updateTagsOfTask}
                update_from={"tag"}/> 
            : <button
                type="button"
                className='btn btn-sm custom-button mr-2'
                onClick={this.onFilter}>
                <span className="fas fa-filter"></span>
              </button>}

          <span className="ml-2">
            {this.props.tag.name}
          </span>
        </div>

        {this.props.toggle_task ? null : edit_and_delete_button}
      </div>
    );

    const edit_tag_form = 
    (
      <EditTagForm 
        user={this.props.user}
        tag={this.props.tag}
        onChangeTags={this.props.onChangeTags}
        onChangeEdit={this.onClick}/>
    )
    return (
      <li
        className={(this.props.filtered)
          ? "list-group-item list-group-item-action list-group-item-success"
          : this.state.show_edit
          ? "list-group-item list-group-item-action list-group-item-primary"
          : "list-group-item list-group-item-action"}
        >
        <div>
          {this.state.show_edit 
            ? edit_tag_form
            : normal}
        </div>
      </li>
    )
  }
}

export default Tag;