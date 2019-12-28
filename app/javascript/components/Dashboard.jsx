import React from "react";
import Task from './Task';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>Hello {this.props.user.email}!
        <div className="list-wrapper">
          <ul>
            <Task /> 
          </ul>
        </div>
      </div>
    )
  }
}

export default Dashboard;