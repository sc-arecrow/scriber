import React from 'react';
import { Router, navigate } from '@reach/router';
import axios from 'axios';

import Welcome from './Welcome';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import AccountPage from './AccountPage';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
      user: {},
      tasks: [],
      tags: []
    }

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onChangeTasks = this.onChangeTasks.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
  }

  onLogin = data => {
    this.setState({
      logged_in: true,
      user: data.user,
      tasks: data.tasks,
      tags: data.tags
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
            tags: []
          });

          navigate('/');
        } else {
          // todo error
          navigate('/dashboard');
        }
      });
  }

  onChangeTasks = tasks => {
    this.setState({tasks: tasks});
  }

  onChangeTags = tags => {
    this.setState({tags: tags});
  }

  render () {
    return (
      <Router>
        <Welcome path='/' />
        <Login 
          path='/login' 
          onLogin={this.onLogin}/>
        <Signup 
          path='/signup'
          onLogin={this.onLogin}/>
        <Dashboard 
          path='/dashboard'
          user={this.state.user}
          tasks={this.state.tasks}
          tags={this.state.tags}
          onChangeTasks={this.onChangeTasks}
          onChangeTags={this.onChangeTags}
          onLogout={this.onLogout}/>
        <AccountPage 
          path='/account'
          user={this.state.user}
          onLogout={this.onLogout}/>
      </Router>
    )
  }
};

export default App;