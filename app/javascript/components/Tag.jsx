import React from 'react';
import axios from 'axios';

import EditTagForm from './EditTagForm';

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      show_edit: false,
      filtered: false
    }

    this.onClick = this.onClick.bind(this);
    this.onChangeEdit = this.onChangeEdit.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  onClick = () => {
    if (this.state.clicked) {
      this.props.onToggleTag("close");
      this.setState({clicked: false});
    } else {
      this.props.onToggleTag(this.props.tag);
      this.setState({clicked: true});
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
    const url = '/users/' + this.props.user.id.toString() + '/tags/' + this.props.tag.id.toString();

    axios
      .delete(url, {withCredentials: true})
      .then(response => {
        this.props.onChangeTags(response.data.tags);
      });
  }

  onFilter = () => {
    if (this.state.filtered) {
      this.setState({filtered: false});
      this.props.onFilterTag(false, null);
    } else {
      this.setState({filtered: true});
      this.props.onFilterTag(true, this.props.tag);
    }
  }

  render () {
    return (
      <li
        className={(this.state.filtered || this.state.clicked)
          ? "list-group-item list-group-item-action list-group-item-dark"
          : "list-group-item list-group-item-action"}
        >
        
        <div className="d-flex justify-content-between">
          <div>
            <button
              type="button"
              className='btn btn-sm custom-button mr-2'
              onClick={this.onClick}>
              <span className="fas fa-tag"></span>
            </button>

            <label className="ml-2">
              {this.props.tag.name}
            </label>
          </div>

          <div>
            <button
              type="button"
              className='btn btn-sm custom-button mr-2'
              onClick={this.onFilter}>
              <span className="fas fa-filter"></span>
            </button>

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
            ? <EditTagForm 
                user={this.props.user}
                tag={this.props.tag}
                onChangeTags={this.props.onChangeTags}
                onChangeEdit={this.onChangeEdit}/> 
            : null}
        </div>
      </li>
    )
  }
}

export default Tag;