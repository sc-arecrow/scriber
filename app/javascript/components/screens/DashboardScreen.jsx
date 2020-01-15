import React from "react";
import axios from 'axios';
import { Link } from '@reach/router';
import { DropdownButton, Dropdown } from 'react-bootstrap';

import Task from '../resources/Task';
import Tag from '../resources/Tag';

import AddTaskForm from '../forms/AddTaskForm';
import AddTagForm from '../forms/AddTagForm';
import SearchTaskForm from '../forms/SearchTaskForm';

class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle_tag: false,
      tag_toggled: {},
      tasks_of_tag: [],
      toggle_task: false,
      task_toggled: {},
      tags_of_task: [],
      filter_tag: false
    }

    this.getTasksOf = this.getTasksOf.bind(this);
    this.getTagsOf = this.getTagsOf.bind(this);
    this.updateTasksOfTag = this.updateTasksOfTag.bind(this);
    this.updateTagsOfTask = this.updateTagsOfTask.bind(this);
    this.onToggleTag = this.onToggleTag.bind(this);
    this.onToggleTask = this.onToggleTask.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.isTagged = this.isTagged.bind(this);
    this.isTasked = this.isTasked.bind(this);
  }

  getTasksOf = tag => {
    let url = '/users/' + this.props.user.id.toString() + '/tags/' + tag.id.toString();

    axios
      .get(url)
      .then(response => {
        this.setState({tasks_of_tag: response.data.tasks})
      });
  }

  getTagsOf = task => {
    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + task.id.toString();

    axios
      .get(url)
      .then(response => {
        this.setState({tags_of_task: response.data.tags})
      });
  }

  updateTasksOfTag = tasks => {
    this.setState({tasks_of_tag: tasks});
  }

  updateTagsOfTask = tags => {
    this.setState({tags_of_task: tags});
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

  onToggleTask = task => {
    if (task === "close") {
      this.setState({
        toggle_task: false,
        task_toggled: {},
        tags_of_task: [],
      });
    } else {
      this.setState({
        toggle_task: true,
        task_toggled: task
      });

      this.getTagsOf(task);
    }
  }

  onClear = () => {
    this.props.onSearchTaskByTitle("");
    this.setState({
      filter_tag: false
    });
  }

  onFilter = filtered => {
    this.setState({
      filter_tag: filtered
    });
  }

  isTagged = task => {
    const tasks = this.state.tasks_of_tag;
    return tasks.find(t => t.id == task.id) !== undefined;
  }

  isTasked = tag => {
    const tags = this.state.tags_of_task;
    return tags.find(t => t.id == tag.id) !== undefined;
  }

  render () {
    let tags = this.props.tags;
    let displayed_tasks = this.props.displayed_tasks;

    let checked_tasks = displayed_tasks
      .filter(task => task.checked == "true")
      .map(task => {
        return <Task
          key={task.id} 
          user={this.props.user}
          task={task}
          tags={tags}
          toggle_tag={this.state.toggle_tag}
          tag_toggled={this.state.tag_toggled}
          tagged={this.isTagged(task)}
          updateTasksOfTag={this.updateTasksOfTag}
          onChangeTasks={this.props.onChangeTasks}
          onUpdateTasks={this.props.onUpdateTasks}
          onToggleTask={this.onToggleTask} />
      });

    let unchecked_tasks = displayed_tasks
      .filter(task => task.checked == "false")
      .map(task => {
        return <Task
          key={task.id} 
          user={this.props.user}
          task={task}
          tags={tags}
          toggle_tag={this.state.toggle_tag}
          tag_toggled={this.state.tag_toggled}
          tagged={this.isTagged(task)}
          updateTasksOfTag={this.updateTasksOfTag}
          onChangeTasks={this.props.onChangeTasks}
          onUpdateTasks={this.props.onUpdateTasks}
          onToggleTask={this.onToggleTask} />
      });

    let display_tags = tags.map(tag => {
      return <Tag
        key={tag.id}
        user={this.props.user}
        tag={tag}
        toggle_task={this.state.toggle_task}
        tag_toggled={this.state.tag_toggled}
        task_toggled={this.state.task_toggled}
        tagged={this.isTasked(tag)}
        updateTagsOfTask={this.updateTagsOfTask}
        onChangeTags={this.props.onChangeTags}
        onToggleTag={this.onToggleTag}
        onFilterTag={this.props.onFilterTag}
        onFilter={this.onFilter}
        filtered={this.state.filter_tag} />
    });

    const delete_below_button = 
      (
        <button type="button" className="btn custom-button my-4 " onClick={this.props.onDeleteBelow}>
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
                <a className="nav-item nav-link active">{this.props.user.email}</a>
                <button type="button" className="btn custom-button" onClick={this.props.onLogout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container-fluid">
          <div className="row mt-4">
            <div className="col-md-2" />
            <div className="col-md-5">
              <div className="row d-flex justify-content-between">
                <SearchTaskForm
                  onSearchTaskByTitle={this.props.onSearchTaskByTitle}
                  toggle_tag={this.state.toggle_tag}
                  toggle_task={this.state.toggle_task}/>
                
                <div>
                  <DropdownButton
                    disabled={this.state.toggle_task || this.state.toggle_tag}
                    id="dropdown" 
                    className="mr-3" 
                    title="Sort by " 
                    alignRight>
                    <Dropdown.Item onClick={this.props.onSortTasksByDeadline}>Deadline</Dropdown.Item>
                    <Dropdown.Item onClick={this.props.onSortTasksByTitle}>Alphabetical</Dropdown.Item>
                    <Dropdown.Item onClick={this.onClear}>Show all</Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>

              <hr className="my-4" />
            </div>
            <div className="col-md-5" />
          </div>

          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-5">
              <ul className="list-group">
                <AddTaskForm 
                  user={this.props.user} 
                  tags={tags}
                  onChangeTasks={this.props.onChangeTasks}
                  onUpdateTasks={this.props.onUpdateTasks}/>
                {unchecked_tasks}
              </ul>
              
              <div className="row d-flex justify-content-center">
                {displayed_tasks.filter(task => task.checked == "true").length == 0 ? null : delete_below_button}
              </div>

              <ul className="list-group">
                {checked_tasks}
              </ul>
            </div>

            <div className="col-md-3">
              <ul className="list-group">
                <AddTagForm 
                  user={this.props.user}
                  onChangeTags={this.props.onChangeTags}/>
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

export default DashboardScreen;