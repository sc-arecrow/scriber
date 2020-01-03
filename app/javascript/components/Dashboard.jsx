import React from "react";
import axios from 'axios';
import { Link } from '@reach/router';

import Task from './Task';
import Tag from './Tag';
import AddTaskForm from './AddTaskForm';
import AddTagForm from './AddTagForm';
import SearchTaskForm from './SearchTaskForm';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_tags: false,
      toggle_tag: false,
      tag_toggled: {},
      tasks_of_tag: [],
      checked_tasks: this.props.tasks.filter(task => task.checked == "true"),
      unchecked_tasks: this.props.tasks.filter(task => task.checked == "false")
    }

    this.onSearchTaskByTitle = this.onSearchTaskByTitle.bind(this);
    this.onUpdateTasks = this.onUpdateTasks.bind(this);
    this.onDeleteBelow = this.onDeleteBelow.bind(this);
    this.onShowTags = this.onShowTags.bind(this);
    this.getTasksOf = this.getTasksOf.bind(this);
    this.displayTasksOf = this.displayTasksOf.bind(this);
    this.updateTasksOfTag = this.updateTasksOfTag.bind(this);
    this.onToggleTag = this.onToggleTag.bind(this);
    this.onFilterTag = this.onFilterTag.bind(this);
    this.isTagged = this.isTagged.bind(this);
  }

  onSearchTaskByTitle = title => {
    const tasks = this.props.tasks;

    if (title == "") {
      this.setState({
        checked_tasks: tasks.filter(task => task.checked == "true"),
        unchecked_tasks: tasks.filter(task => task.checked == "false")
      });
    } else {
      const filtered_tasks = tasks.filter(task => task.title.toLowerCase().includes(title));

      this.setState({
        checked_tasks: filtered_tasks.filter(task => task.checked == "true"),
        unchecked_tasks: filtered_tasks.filter(task => task.checked == "false")
      });
    }
  }

  onUpdateTasks = tasks => {
    this.setState({
      checked_tasks: tasks.filter(task => task.checked == "true"),
      unchecked_tasks: tasks.filter(task => task.checked == "false")
    });
  }

  onDeleteBelow = () => {
    const checked_tasks = this.state.checked_tasks;

    for (let i = 0; i < checked_tasks.length; i++) {
      const task = checked_tasks[i];

      const url = '/users/' + this.props.user.id.toString() + '/tasks/' + task.id.toString();

      axios
        .delete(url, {withCredentials: true})
        .then(response => {
          this.props.onChangeTasks(response.data.tasks);
          this.onUpdateTasks(response.data.tasks);
        });
    }
  }

  onShowTags = () => {
    if (this.state.show_tags) {
      this.setState({
        show_tags: false,
        toggle_tag: false,
        tag_toggled: {},
        tasks_of_tag: []
      });
    } else {
      this.setState({show_tags: true});
    }
  }

  getTasksOf = tag => {
    let url = '/users/' + this.props.user.id.toString() + '/tags/' + tag.id.toString();

    axios
      .get(url)
      .then(response => {
        this.setState({tasks_of_tag: response.data.tasks})
      });
  }

  displayTasksOf = tag => {
    let url = '/users/' + this.props.user.id.toString() + '/tags/' + tag.id.toString();

    axios
      .get(url)
      .then(response => {
        const tasks_of_tag = response.data.tasks;

        this.setState({
          checked_tasks: tasks_of_tag.filter(task => task.checked == "true"),
          unchecked_tasks: tasks_of_tag.filter(task => task.checked == "false")
        });
      });
  }

  updateTasksOfTag = tasks => {
    this.setState({tasks_of_tag: tasks});
  }

  onToggleTag = tag => {
    if (tag === "close") {
      this.setState({
        toggle_tag: false,
        tag_toggled: {},
        tasks_of_tag: [],
      });
    } else {
      this.setState({
        toggle_tag: true,
        tag_toggled: tag
      });

      this.getTasksOf(tag);
    }
  }

  onFilterTag = (filtered, tag) => {
    if (filtered) {
      this.displayTasksOf(tag);
    } else {
      this.setState({
        checked_tasks: this.props.tasks.filter(task => task.checked == "true"),
        unchecked_tasks: this.props.tasks.filter(task => task.checked == "false")
      });
    }
  }

  isTagged = task => {
    const tasks = this.state.tasks_of_tag;
    return tasks.find(t => t.id == task.id) !== undefined;
  }

  render () {
    let tags = this.props.tags;

    let checked_tasks = this.state.checked_tasks.map(task => {
      return <Task
        key={task.id} 
        user={this.props.user}
        task={task}
        toggle_tag={this.state.toggle_tag}
        tag_toggled={this.state.tag_toggled}
        tagged={this.isTagged(task)}
        getTasksOf={this.getTasksOf}
        updateTasksOfTag={this.updateTasksOfTag}
        onChangeTasks={this.props.onChangeTasks}
        onUpdateTasks={this.onUpdateTasks} />
    });

    let unchecked_tasks = this.state.unchecked_tasks.map(task => {
      return <Task
        key={task.id} 
        user={this.props.user}
        task={task}
        toggle_tag={this.state.toggle_tag}
        tag_toggled={this.state.tag_toggled}
        tagged={this.isTagged(task)}
        getTasksOf={this.getTasksOf}
        updateTasksOfTag={this.updateTasksOfTag}
        onChangeTasks={this.props.onChangeTasks}
        onUpdateTasks={this.onUpdateTasks} />
    });

    let display_tags = tags.map(tag => {
      return <Tag
        key={tag.id}
        user={this.props.user}
        tag={tag}
        tag_toggled={this.state.tag_toggled}
        onChangeTags={this.props.onChangeTags}
        onToggleTag={this.onToggleTag}
        onFilterTag={this.onFilterTag} />
    });

    const delete_below_button = 
      (
        <button type="button" className="btn custom-button my-4 " onClick={this.onDeleteBelow}>
          Delete Todos Below
        </button>
      );

    return (
      <div>
        <nav className="navbar sticky-top navbar-expand-md navbar-dark bg-dark mb-3">
          <div className="container-fluid">
            <a className="navbar-brand mr-3">Scriber</a>

            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav">
                <Link to='/dashboard' className="nav-item nav-link active">Home</Link>
                <Link to='/account' className="nav-item nav-link">Account</Link>
              </div>

              <div className="navbar-nav ml-auto">
                <button type="button" className="btn custom-button" onClick={this.props.onLogout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container-fluid">
          <div className="row mt-4">
            <div className="col-md-2" />
            <div className="col-md-5">
              <div className="row align-items-center justify-content-left">
                <SearchTaskForm onSearchTaskByTitle={this.onSearchTaskByTitle}/>
              </div>

              <hr className="my-4" />
            </div>
            <div className="col-md-5" />
          </div>

          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-5">
              <div className="row align-items-center justify-content-left">
                <AddTaskForm 
                  user={this.props.user} 
                  onChangeTasks={this.props.onChangeTasks}
                  onUpdateTasks={this.onUpdateTasks}/>
              </div>

              <hr className="my-4" />
            </div>
            <div className="col-md-3">
              <div className="row align-items-center justify-content-left">
                <AddTagForm 
                  user={this.props.user}
                  onChangeTags={this.props.onChangeTags}/> 
              </div>

              <hr className="my-4" />
            </div>
            <div className="col-md-2" />
          </div>

          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-5">
              <ul className="list-group">
                {unchecked_tasks}
              </ul>
              
              <div className="row d-flex justify-content-center">
                {this.state.checked_tasks.length == 0 ? null : delete_below_button}
              </div>

              <ul className="list-group">
                {checked_tasks}
              </ul>
            </div>

            <div className="col-md-3">
              <ul className="list-group">
                {display_tags}
              </ul>
            </div>
            <div className="col-md-2" />
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;