import React from 'react';

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "test",
      completed: false,
      hovering: false
    }

    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onClick = () => {
    console.log("clicked")
    if (this.state.completed) {
      this.setState({completed: false});
    } else {
      this.setState({completed: true});
    }
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

        <label className={completed ? 'task-container completed' : 'task-container'}>
          <input 
            type='button'
            className={completed
              ? 'custom-checkbox checked' 
              : hovering
                ? 'custom-checkbox hovering'
                : 'custom-checkbox'}
            onClick={this.onClick}></input>
          {this.state.title}
        </label>
      </li>
    )
  }
}

export default Task;