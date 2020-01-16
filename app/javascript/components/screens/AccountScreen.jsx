import React from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import { DropdownButton, Dropdown } from 'react-bootstrap';

import Alert from '../resources/Alert'

class AccountScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
      password_alert_displayed: false,
      password_alert_message: {},
      urgency_setting_alert_displayed: false,
      urgency_setting_alert_message: {},
      urgency_setting: this.props.user.urgency_setting
    }

    this.onChange = this.onChange.bind(this);
    this.onUpdateUrgencySetting = this.onUpdateUrgencySetting.bind(this);
    this.onSaveUrgencySetting = this.onSaveUrgencySetting.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onDeleteAccount = this.onDeleteAccount.bind(this);
    this.onPasswordAlert = this.onPasswordAlert.bind(this);
    this.onUrgencySettingAlert = this.onUrgencySettingAlert.bind(this);
    this.onPasswordClose = this.onPasswordClose.bind(this);
    this.onUrgencySettingClose = this.onUrgencySettingClose.bind(this);
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onUpdateUrgencySetting = eventKey => {
    this.setState({
      urgency_setting: eventKey
    });
  }

  onSaveUrgencySetting = event => {
    event.preventDefault();

    let user = {
      old_password: "urgency",
      urgency_setting: this.state.urgency_setting
    }

    let url = '/users/' + this.props.user.id.toString();

    axios
      .patch(url, {user}, {withCredentials: true})
      .then(response => {
        let message;

        if (response.data.setting_updated) {
          message = {
            type: "success",
            text: "Setting changed!",
            posttext: ""
          }
          
          this.props.onChangeUrgencySetting(response.data);
        } else {
          message = {
            type: "error",
            text: "Something went wrong!",
            posttext: ""
          }
        }

        this.onUrgencySettingAlert(message);
      })

  }

  onChangePassword = event => {
    event.preventDefault();

    let user = {
      old_password: this.state.old_password,
      new_password: this.state.new_password,
      new_password_confirmation: this.state.new_password_confirmation
    };

    let url = '/users/' + this.props.user.id.toString();

    axios
      .patch(url, {user}, {withCredentials: true})
      .then(response => {
        let message;

        if (response.data.correct_old_password) {
          if (response.data.password_updated) {
            message = {
              type: "success",
              text: "Password changed!",
              posttext: ""
            }

            this.setState({
              old_password: "",
              new_password: "",
              new_password_confirmation: ""
            });
          } else {
            const errors = response.data.errors;
          
            if (errors.password != undefined) {
              if (errors.password.includes("is too short (minimum is 8 characters)")) {
                message = {
                  type: "error",
                  text: "Password is too short.",
                  posttext: ""
                }

                this.setState({
                  new_password: "",
                  new_password_confirmation: ""
                });
              }
            } else if (errors.password_confirmation != undefined) {
              if (errors.password_confirmation.includes("doesn't match Password")) {
                message = {
                  type: "error",
                  text: "Password confirmation is not the same as password.",
                  posttext: ""
                }

                this.setState({
                  new_password: "",
                  new_password_confirmation: ""
                });
              }
            }
          }
        } else {
          message = {
            type: "error",
            text: "Incorrect old password.",
            posttext: ""
          }

          this.setState({
            old_password: ""
          });
        }
        
        this.onPasswordAlert(message);
        navigate('/account');
      });
  }

  onDeleteAccount = () => {
    if (confirm("Are you sure? All tasks and tags will be lost!")) {
      let url = '/users/' + this.props.user.id.toString();

      axios
        .delete(url, {withCredentials: true})
        .then(response => {
          if (response.data.user_destroyed) {
            this.props.onLogout();
            navigate('/');
          } else {
            //todo error
            navigate('/dashboard');
          }
        });
    }
  }

  onPasswordAlert = message => {
    this.setState({
      password_alert_displayed: true,
      password_alert_message: message
    })
  }

  onUrgencySettingAlert = message => {
    this.setState({
      urgency_setting_alert_displayed: true,
      urgency_setting_alert_message: message
    })
  }

  onPasswordClose = () => {
    this.setState({
      password_alert_displayed: false,
      password_alert_message: {}
    })
  }

  onUrgencySettingClose = () => {
    this.setState({
      urgency_setting_alert_displayed: false,
      urgency_setting_alert_message: {}
    })
  }

  render () {
    const urgency_setting = this.state.urgency_setting == undefined ? this.props.user.urgency_setting : this.state.urgency_setting;

    const update_urgency_setting_form =
    (
      <form onSubmit={this.onSaveUrgencySetting}>
        <div className="d-flex justify-content-between">
          <div>
            <DropdownButton
              id="dropdown"
              className="mt-2"
              title={urgency_setting == "0"
                ? "On the day"
                : urgency_setting == "1"
                ? urgency_setting + " day before"
                : urgency_setting + " days before"}
              >
              <Dropdown.Item onSelect={this.onUpdateUrgencySetting} eventKey="0">On the day</Dropdown.Item>
              <Dropdown.Item onSelect={this.onUpdateUrgencySetting} eventKey="1">1 day before</Dropdown.Item>
              <Dropdown.Item onSelect={this.onUpdateUrgencySetting} eventKey="2">2 days before</Dropdown.Item>
              <Dropdown.Item onSelect={this.onUpdateUrgencySetting} eventKey="7">A week before</Dropdown.Item>
            </DropdownButton>
          </div>

          <div>
            <button
              type="submit"
              className="btn custom-button mt-2"
              onClick={this.onSaveUrgencySetting}>
              Save
            </button>
          </div>
        </div>  
      </form>
    )

    const change_password_form = 
      (
        <form onSubmit={this.onChangePassword}>
          <div className="form-group">
            <label htmlFor="old_password">Old Password</label>
            <input
              type="password"
              name="old_password"
              value={this.state.old_password}
              className="form-control"
              required
              onChange={this.onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              name="new_password"
              value={this.state.new_password}
              className="form-control"
              required
              onChange={this.onChange}
            />
            <small className="sm">Password must have a minimum of 8 characters.</small>
          </div>

          <div className="form-group">
            <label htmlFor="new_password_confirmation">Confirm New Password</label>
            <input
              type="password"
              name="new_password_confirmation"
              value={this.state.new_password_confirmation}
              className="form-control"
              required
              onChange={this.onChange}
            />
          </div>

          <button
            type="submit"
            className="btn custom-button mr-3">
            Change Password
          </button>
        </form>
      );

    const password_alert =
      (
        <Alert
          message={this.state.password_alert_message}
          onClose={this.onPasswordClose}/>
      );

    const urgency_setting_alert =
      (
        <Alert
          message={this.state.urgency_setting_alert_message}
          onClose={this.onUrgencySettingClose}/>
      );

    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-3">
          <div className="container-fluid">
            <a className="navbar-brand mr-3">Scriber</a>

            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav">
                <Link to='/dashboard' className="nav-item nav-link">Home</Link>
                <Link to='/account' className="nav-item nav-link active">Account</Link>
              </div>

              <div className="navbar-nav ml-auto">
                <a className="nav-item nav-link active">{this.props.user.email}</a>
                <button type="button" className="btn custom-button" onClick={this.props.onLogout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mt-5">
          <div className="row">
            <div className="col-sm-12 col-lg-6 offset-lg-3">

              <h1 className="font-weight-normal mb-5">
                Hello {this.props.user.email}!
              </h1>

              <hr className="my-4" />
              
              {this.state.urgency_setting_alert_displayed ? urgency_setting_alert : null}

              <h5>Deadline Urgency Setting</h5>
              <small>Pick the duration of time before your deadlines become urgent.</small>

              {update_urgency_setting_form}

              <hr className="my-4" />

              {this.state.password_alert_displayed ? password_alert : null}

              <h5>Change Password</h5>

              {change_password_form}

              <hr className="my-4" />

              <h5>Delete Account</h5>
              <small>Be warned, once you delete your account, all data will be lost!</small>
              <br/>
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={this.onDeleteAccount}>
                Delete Account
              </button>

              <hr className="my-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountScreen;