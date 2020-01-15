import React from 'react';
import { Router, navigate } from '@reach/router';
import axios from 'axios';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import AccountScreen from './screens/AccountScreen';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
      user: {},
      tasks: [],
      tags: [],
      displayed_tasks: []
    }

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.loginStatus = this.loginStatus.bind(this);
    this.onChangeTasks = this.onChangeTasks.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);

    this.onSearchTaskByTitle = this.onSearchTaskByTitle.bind(this);
    this.onUpdateTasks = this.onUpdateTasks.bind(this);
    this.onSortTasksByDeadline = this.onSortTasksByDeadline.bind(this);
    this.onSortTasksByTitle = this.onSortTasksByTitle.bind(this);
    this.onDeleteBelow = this.onDeleteBelow.bind(this);
    this.displayTasksOf = this.displayTasksOf.bind(this);
    this.onFilterTag = this.onFilterTag.bind(this);
  }

  onLogin = data => {
    this.setState({
      logged_in: true,
      user: data.user,
      tasks: data.tasks,
      tags: data.tags,
      displayed_tasks: data.tasks
    });
  }

  onLogout = () => {
    axios
      .delete('/logout', {withCredentials: true})
      .then(response => {
        if (response.data.logged_out) {
          this.setState({
            logged_in: false,
            user: {},
            tasks: [],
            tags: [],
            displayed_tasks: []
          });

          navigate('/');
        } else {
          // todo error
          navigate('/dashboard');
        }
      });
  }

  loginStatus = () => {
    axios
      .get('/loggedin', {withCredentials: true})
      .then(response => {
        if (response.data.logged_in) {
          this.onLogin(response.data);
        } else {
          this.onLogout();
        }
      })
  }

  componentDidMount () {
    this.loginStatus();
  }

  onChangeTasks = tasks => {
    this.setState({tasks: tasks});
  }

  onChangeTags = tags => {
    this.setState({tags: tags});
  }
  
  onUpdateTasks = tasks => {
    this.setState({
      displayed_tasks: tasks
    });
  }

  onSortTasksByDeadline = () => {
    const displayed_tasks = this.state.displayed_tasks;

    const comparer = (x, y) => {
      const x_deadline = x.deadline;
      const y_deadline = y.deadline;

      if (x_deadline == y_deadline) {
        return 0;
      } else if (x_deadline == "no deadline") {
        return 1;
      } else  if (y_deadline == "no deadline") {
        return -1;
      } else {
        return parseInt(x_deadline) < parseInt(y_deadline) ? -1 : 1;
      }
    }

    const sorted_tasks = displayed_tasks.sort(comparer);

    this.onUpdateTasks(sorted_tasks);    
  }

  onSortTasksByTitle = () => {
    const displayed_tasks = this.state.displayed_tasks;

    const comparer = (x, y) => {
      const x_title = x.title;
      const y_title = y.title;

      if (x_title < y_title) {
        return -1;
      } else if (x_title > y_title) {
        return 1;
      } else {
        return 0;
      }
    }

    const sorted_tasks = displayed_tasks.sort(comparer);

    this.onUpdateTasks(sorted_tasks);
  }

  onSearchTaskByTitle = title => {
    const tasks = this.state.tasks;

    if (title == "") {
      this.onUpdateTasks(tasks);
    } else {
      const filtered_tasks = tasks.filter(task => task.title.toLowerCase().includes(title));

      this.onUpdateTasks(filtered_tasks);
    }
  }

  onDeleteBelow = () => {
    const checked_tasks = this.state.displayed_tasks.filter(task => task.checked == "true");

    for (let i = 0; i < checked_tasks.length; i++) {
      const task = checked_tasks[i];

      const url = '/users/' + this.state.user.id.toString() + '/tasks/' + task.id.toString();

      axios
        .delete(url, {withCredentials: true})
        .then(response => {
          this.onChangeTasks(response.data.tasks);
          this.onUpdateTasks(response.data.tasks);
        });
    }
  }

  displayTasksOf = tag => {
    let url = '/users/' + this.state.user.id.toString() + '/tags/' + tag.id.toString();

    axios
      .get(url)
      .then(response => {
        const tasks_of_tag = response.data.tasks;

        this.onUpdateTasks(tasks_of_tag);
      });
  }

  onFilterTag = (filtered, tag) => {
    if (filtered) {
      this.displayTasksOf(tag);
    } else {
      this.onUpdateTasks(this.state.tasks);
    }
  }

  render () {
    return (
      <Router>
        <WelcomeScreen path='/' />
        <LoginScreen 
          path='/login' 
          onLogin={this.onLogin}/>
        <SignupScreen 
          path='/signup'
          onLogin={this.onLogin}/>
        <DashboardScreen 
          path='/dashboard'
          user={this.state.user}
          tasks={this.state.tasks}
          tags={this.state.tags}
          displayed_tasks={this.state.displayed_tasks}
          onChangeTasks={this.onChangeTasks}
          onChangeTags={this.onChangeTags}
          onLogout={this.onLogout}
          onSearchTaskByTitle={this.onSearchTaskByTitle}
          onSortTasksByDeadline={this.onSortTasksByDeadline}
          onSortTasksByTitle={this.onSortTasksByTitle}
          onUpdateTasks={this.onUpdateTasks}
          onDeleteBelow={this.onDeleteBelow}
          displayTasksOf={this.displayTasksOf}
          onFilterTag={this.onFilterTag}/>
        <AccountScreen 
          path='/account'
          user={this.state.user}
          onLogout={this.onLogout}/>
      </Router>
    )
  }
};

export default App;