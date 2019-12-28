import React from "react";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>Hello {this.props.user.email}!</div>
    );
  }
}

export default Dashboard;