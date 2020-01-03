import React from 'react';
import axios from 'axios';

class AddTagForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new_tag_name: ""
    }
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit = event => {
    event.preventDefault();

    let tag = {
      name: this.state.new_tag_name
    }

    let url = '/users/' + this.props.user.id.toString() + '/tags';

    axios
      .post(url, {tag}, {withCredentials: true})
      .then(response => {
        if (response.data.tag_created) {
          this.props.onChangeTags(response.data.tags)
          this.setState({new_tag_name: ""});
        } else {
          //todo error
        }
      });
  }

  render () {
    return (
      <div>
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="input-group col-auto">
            <input
              type="text"
              id="new_tag_name"
              name="new_tag_name"
              className="form-control"
              onChange={this.onChange}
              required
              value={this.state.new_tag_name}
              placeholder="New tag">
            </input>
          </div>

          <div className="input-group col-auto">
            <button
              type="submit"
              className="btn custom-button">
              Add
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default AddTagForm;