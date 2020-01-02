import React from 'react';
import axios from 'axios';

class EditTagForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.tag.name,
      colour: this.props.tag.colour
    }

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

    let tag = {
      name: this.state.name,
      colour: this.state.colour
    }

    let url = '/users/' + this.props.user.id.toString() + '/tags/' + this.props.tag.id.toString();

    axios
      .patch(url, {tag}, {withCredentials: true})
      .then(response => {
        if (response.data.tag_updated) {
          this.props.onChangeTags(response.data.tags);
          this.props.onChangeEdit();
        } else {
          //todo error
          this.props.onChangeEdit();
        }
      });
  }

  render () {
    return (
      <div className="ml-4">
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="input-group col-8">
            <input
              type="text"
              name="name"
              className="form-control"
              value={this.state.name}
              required
              onChange={this.onChange}>
            </input>
          </div>

          <div className="input-group col-auto">
            <button
              type="submit"
              className="btn custom-button">
              Edit
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default EditTagForm;