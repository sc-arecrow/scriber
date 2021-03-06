import React from 'react';

class SearchTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search_title: ""
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

    this.props.onSearchTaskByTitle(this.state.search_title.toLowerCase());
  }

  render () {
    return (
      <div>
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="input-group col-auto">
            <input
              type="text"
              id="search_title"
              name="search_title"
              className="form-control"
              onChange={this.onChange}
              value={this.state.search_title}
              placeholder="Search todo">
            </input>
          </div>

          <div className="input-group col-auto">
            <button
              disabled={this.props.toggle_task || this.props.toggle_tag}
              type="submit"
              className="btn custom-button mr-4">
              <a className="fas fa-search"></a>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default SearchTaskForm;