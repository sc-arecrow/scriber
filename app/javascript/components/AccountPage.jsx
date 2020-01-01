import React from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_password_form: false,
      old_password: "",
      new_password: "",
      new_password_confirmation: ""
    }

    this.onChange = this.onChange.bind(this);
    this.onShowPasswordForm = this.onShowPasswordForm.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onDeleteAccount = this.onDeleteAccount.bind(this);
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
        if (response.data.correct_old_password) {
          if (response.data.password_updated) {
            console.log("password updated")
            navigate('/dashboard')
          } else {
            console.log("password update failed")
            //todo alert
          }
        } else {
          console.log("wrong password")
          //todo alert
        }
      });
  }

  onClickLogout = () => {
    axios
      .delete('/logout', {withCredentials: true})
      .then(response => {
        if (response.data.logged_out) {
          this.props.onLogout();
          navigate('/');
        } else {
          // todo error
          navigate('/dashboard');
        }
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

  render () {
    const change_password_form = 
      (
        <form onSubmit={this.onChangePassword}>
          <div>
            <label>Old Password</label>
            <input
              type="password"
              name="old_password"
              value={this.state.old_password}
              required
              onChange={this.onChange}
            />
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              value={this.state.new_password}
              required
              onChange={this.onChange}
            />
          </div>

          <div>
            <label>Confirm New Password</label>
            <input
              type="password"
              name="new_password_confirmation"
              value={this.state.new_password_confirmation}
              required
              onChange={this.onChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-lg custom-button">
            Change Password
          </button>
        </form>
      );

    return (
      <div>
        <h1>Hello {this.props.user.email}!</h1>

        <br />

        <Link to='/dashboard' className="btn btn-lg custom-button">Back</Link>

        <br />

        <button
          onClick={this.onShowPasswordForm}
          className="btn btn-lg custom-button">
          {this.state.show_password_form ? "Close" : "Change Password"}
        </button>

        <div>
          {this.state.show_password_form
            ? change_password_form
            : null}
        </div>

        <br />

        <button
          onClick={this.onClickLogout}
          className="btn btn-lg custom-button">
          Logout
        </button>

        <br />

        <button
          onClick={this.onDeleteAccount}
          className="btn btn-lg custom-button">
          Delete Account
        </button>
      </div>
    )
  }
}

export default AccountPage;