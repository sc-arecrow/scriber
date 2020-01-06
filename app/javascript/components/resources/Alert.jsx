import React from 'react';
import { Link } from '@reach/router';

class Alert extends React.Component {
  constructor(props) {
    super(props);

    this.alertClass = this.alertClass.bind(this);
  }

  alertClass = type => {
    const classes = {
      error: 'alert-danger',
      success: 'alert-success'
    };

    return classes[type];
  }

  render () {
    const message = this.props.message;
    const alert_class_name = `alert ${this.alertClass(message.type)}`
    
    return (
      <div className={alert_class_name}>
        {message.text}
        {message.link_route == undefined 
          ? null
          : <Link to={message.link_route} className="alert-link">{message.link_content}</Link>}
        {message.posttext}
        <button className="close" onClick={this.props.onClose}>&times;</button>
      </div>
    )
  }
}

export default Alert;