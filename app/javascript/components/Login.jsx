import React from "react";
import axios from "axios";
import { Link, navigate } from "@reach/router";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
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
    
    let params = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/login", params)
      .then(response => {
        if (response.data.logged_in) {
          this.props.onLogin(response.data);
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      });
  }

  render () {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">

            <h1 className="font-weight-normal mb-5">
              Login
            </h1>

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

export default Login;