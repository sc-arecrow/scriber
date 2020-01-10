import React from 'react';
import axios from 'axios';

class EditTagForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.tag.name
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
      name: this.state.name
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
        <form onSubmit={this.onSubmit}>
          <div className="d-flex justify-content-between">
            <div>
              <input
                type="text"
                name="name"
                className="form-control form-control-sm"
                value={this.state.name}
                required
                onChange={this.onChange}>
              </input>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-sm custom-button">
                <span className="far fa-edit"></span>
              </button>
            </div>
          </div>
        </form>
    )
  }
}

export default EditTagForm;