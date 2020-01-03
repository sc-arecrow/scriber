import React from "react";
import axios from 'axios';
import { Link, navigate } from '@reach/router'

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      password_confirmation: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
          navigate('/signup');
        }
      });
  }

  render () {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">

            <h1 className="font-weight-normal mb-5">
              Sign Up
            </h1>

            <hr className="my-4" />

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