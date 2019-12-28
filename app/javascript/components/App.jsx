import React from 'react';
import { Router } from '@reach/router';
import Welcome from './Welcome';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
      user: {}
    }
  }

  onLogin = (data) => {
    this.setState({
      logged_in: true,
      user: data.user
    });
  }

  onLogout = () => {
    this.setState({
      logged_in: false,
      user: {}
    });
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
          user={this.state.user} />
      </Router>
    )
  }
};

export default App;