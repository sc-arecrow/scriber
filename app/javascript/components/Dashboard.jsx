import React from "react";
import axios from 'axios';

import Task from './Task';
import Tag from './Tag';
import AddTagForm from './AddTagForm';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new_task_title: "",
      show_tags: false
    }

    this.onChange = this.onChange.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onAddTask = event => {
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
          this.setState({new_task_title: ""});
        } else {
          //todo error
          this.setState({new_task_title: ""});
        }
      });
  }

  onShowTags = () => {
    if (this.state.show_tags) {
      this.setState({show_tags: false});
    } else {
      this.setState({show_tags: true});
    }
  }


  render () {
    let tasks = this.props.tasks;
    let tags = this.props.tags;

    let display_tasks = tasks.map(task => {
      return <Task
        key={task.id} 
        user={this.props.user}
        task={task}
        onChangeTasks={this.props.onChangeTasks} />
    });

    let display_tags = tags.map(tag => {
      return <Tag
        key={tag.id}
        user={this.props.user}
        tag={tag}
        onChangeTags={this.props.onChangeTags} />
    });

    return (
      <div>
        <h1>Hello {this.props.user.email}!</h1>
        <div>
          <form onSubmit={this.onAddTask}>
            <input 
              type="text"
              name="new_task_title"
              value={this.state.new_task_title}
              placeholder="New todo" 
              required
              onChange={this.onChange}></input>
            <button type="submit" className="btn btn-lg custom-button">Add</button>
          </form>
        </div>
      
        <div className="list-wrapper">
          <ul>
            {display_tasks}
          </ul>
        </div>

        <button
            className='show-tags-button'
            onClick={this.onShowTags}>
          {this.state.show_tags ? "Close Tags" : "Open Tags"}
        </button>

        <div>
          {this.state.show_tags 
            ? <AddTagForm 
                user={this.props.user}
                onChangeTags={this.props.onChangeTags}/> 
            : null}
        </div>

        <div className="list-wrapper">
          <ul>
            {this.state.show_tags 
              ? display_tags 
              : null}
          </ul>
        </div>
      </div>
    )
  }
}

export default Dashboard;