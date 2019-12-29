import React from "react";
import Task from './Task';
import axios from 'axios';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new_task_title: ""
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

  render () {
    let tasks = this.props.tasks;
    console.log(tasks);
    let display_tasks = tasks.map(task => {
      return <Task
        key={task.id} 
        user={this.props.user}
        task={task}
        onChangeTasks={this.props.onChangeTasks}/>
    });

    return (
      <div>
        <h1>Hello {this.props.user.email}!</h1>
        <div>
          <form onSubmit={this.onSubmit}>
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

      </div>
    )
  }
}

export default Dashboard;