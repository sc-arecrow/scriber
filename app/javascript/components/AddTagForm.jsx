import React from 'react';
import axios from 'axios';

class AddTagForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new_tag_name: "",
      new_tag_colour: "#293241"
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
      name: this.state.new_tag_name,
      colour: this.state.new_tag_colour
    }

    let url = '/users/' + this.props.user.id.toString() + '/tags';

    axios
      .post(url, {tag}, {withCredentials: true})
      .then(response => {
        if (response.data.tag_created) {
          this.props.onChangeTags(response.data.tags)
        } else {
          //todo error
        }
      });
  }

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="new_tag_name"
            value={this.state.new_tag_name}
            required
            onChange={this.onChange}
            >
          </input>
          
          <button
            type="submit"
            className="btn btn-lg custom-button">
            Add
          </button>
        </form>
      </div>
    )
  }
}

export default AddTagForm;