import React from 'react';
import axios from 'axios';

import EditTagForm from './EditTagForm';

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      hovering: false,
      show_edit: false
    }

    this.onClick = this.onClick.bind(this);
    this.onChangeEdit = this.onChangeEdit.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
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

  onMouseEnter = () => {
    this.setState({hovering: true});
  }

  onMouseLeave = () => {
    this.setState({hovering: false});
  }

  render () {
    let clicked = this.state.clicked;
    let hovering = this.state.hovering;

    return (
      <li
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        >
        
        <div>
          <label 
            className={clicked ? 'task-container completed' : 'task-container'}
            onClick={this.onClick}>
            {this.props.tag.name}
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