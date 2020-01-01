import React from 'react';

class SearchTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search_title: ""
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
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

  onClear = () => {
    this.props.onSearchTaskByTitle("");
  }

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="search_title"
            onChange={this.onChange}
            value={this.state.search_title}
            placeholder="Search task">
          </input>
          <button
            type="submit"
            className="btn btn-lg custom-button">
            Search
          </button>
        </form>

        <button
          onClick={this.onClear}
          className="btn btn-lg custom-button">
          Show All
        </button>
      </div>
    )
  }
}

export default SearchTaskForm;