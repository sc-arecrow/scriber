import React from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';

import Alert from '../resources/Alert'

class AccountScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_password_form: false,
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
      alert_displayed: false,
      alert_message: {}
    }

    this.onChange = this.onChange.bind(this);
    this.onShowPasswordForm = this.onShowPasswordForm.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onDeleteAccount = this.onDeleteAccount.bind(this);
    this.onAlert = this.onAlert.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onShowPasswordForm = () => {
    if (this.state.show_password_form) {
      this.setState({show_password_form: false});
    } else {
      this.setState({show_password_form: true});
    }
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
        
        this.onAlert(message);
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

  onAlert = message => {
    this.setState({
      alert_displayed: true,
      alert_message: message
    })
  }

  onClose = () => {
    this.setState({
      alert_displayed: false,
      alert_message: {}
    })
  }

  render () {
    const show_form_button = 
      (
        <button
          type="button"
          className="btn btn-lg custom-button"
          onClick={this.onShowPasswordForm}>
          Change Password
        </button>
      );

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
            className="btn btn-lg custom-button mr-3">
            Change Password
          </button>

          <button
            type="reset"
            className="btn btn-lg custom-button"
            onClick={this.onShowPasswordForm}>
            Back
          </button>
        </form>
      );

    const alert =
      (
        <Alert
          message={this.state.alert_message}
          onClose={this.onClose}/>
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

              {this.state.alert_displayed ? alert : null}

              {this.state.show_password_form
                ? change_password_form
                : show_form_button}

              <p>
                <br />
                <button
                  type="button"
                  className="btn btn-lg custom-button"
                  onClick={this.onDeleteAccount}>
                  Delete Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountScreen;