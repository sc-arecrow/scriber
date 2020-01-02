import React from "react";
import { Link } from '@reach/router';

class Welcome extends React.Component {
  render () {
    return (
      <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">

            <h1 className="display-4">Scriber</h1>

            <p className="lead">
              Organise your life.
            </p>

            <hr className="my-4" />

            <p>
              <Link to="/login" className="btn btn-lg custom-button">Login</Link>
              <br />
            </p>
            
            <p>
              <Link to="/signup" className="btn btn-lg custom-button">Sign Up</Link>
            </p>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;