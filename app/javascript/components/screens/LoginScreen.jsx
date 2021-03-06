import React from "react";
import axios from "axios";
import { Link, navigate } from "@reach/router";

import Alert from '../resources/Alert'

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
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
    
    let session = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/login", {session}, {withCredentials: true})
      .then(response => {
        if (response.data.logged_in) {
          this.props.onLogin(response.data);
          navigate('/dashboard');
        } else {
          const message = (response.data.error == "user does not exist")
            ? {
              type: "error",
              text: "User does not exist. Click ",
              link_route: "/signup",
              link_content: "here",
              posttext: " to sign up."
            } 
            : {
              type: "error",
              text: "Incorrect password, try again.",
              posttext: ""
            }
          
          this.setState({
            password: ""
          });
          
          this.onAlert(message);
          navigate('/login');
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
              Login
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
              </div>

              <button
                type="submit"
                className="btn btn-lg custom-button">
                Login
              </button>
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

export default LoginScreen;