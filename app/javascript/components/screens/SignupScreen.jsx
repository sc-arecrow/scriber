import React from "react";
import axios from 'axios';
import { Link, navigate } from '@reach/router'

import Alert from '../resources/Alert';

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      password_confirmation: "",
      alert_displayed: false,
      alert_message: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAlert = this.onAlert.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit = event => {
    event.preventDefault();

    let user = {
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    };

    axios
      .post("/users", {user}, {withCredentials: true})
      .then(response => {
        if (response.data.user_created) {
          this.props.onLogin(response.data)
          navigate('/dashboard');
        } else {
          const errors = response.data.errors;
          console.log(errors);
          let message;

          if (errors.email != undefined) {
            if (errors.email.includes("has already been taken")) {
              message = {
                type: "error",
                text: "The email has already been used.",
                posttext: ""
              }
            } else if (errors.email.includes("not a valid email")) {
              message = {
                type: "error",
                text: "Invalid email.",
                posttext: ""
              }
            }
          } else if (errors.password != undefined) {
            if (errors.password.includes("is too short (minimum is 8 characters)")) {
              message = {
                type: "error",
                text: "Password is too short.",
                posttext: ""
              }

              this.setState({
                password: "",
                password_confirmation: ""
              })
            }
          } else if (errors.password_confirmation != undefined) {
            if (errors.password_confirmation.includes("doesn't match Password")) {
              message = {
                type: "error",
                text: "Password confirmation is not the same as password.",
                posttext: ""
              }

              this.setState({
                password_confirmation: ""
              })
            }
          }

          this.onAlert(message);
          navigate('/signup');
        }
      });
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
    const alert =
      (
        <Alert
          message={this.state.alert_message}
          onClose={this.onClose}/>
      );

    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">

            <h1 className="font-weight-normal mb-5">
              Sign Up
            </h1>

            <hr className="my-4" />

            {this.state.alert_displayed ? alert : null}

            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
                <small className="sm">Password must have a minimum of 8 characters.</small>
              </div>

              <div className="form-group">
                <label htmlFor="password_confirmation">Comfirm Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={this.state.password_confirmation}
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
              </div>

              <input
                type="submit"
                className="btn btn-lg custom-button"
                value="Sign Up"
              />
            </form>

            <p>
              <br />
              <Link to="/" className="btn btn-lg custom-button">Back</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupScreen;