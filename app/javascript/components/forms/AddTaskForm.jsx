import React from 'react';
import axios from 'axios';

import DayPickerInput from 'react-day-picker/DayPickerInput';

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      deadline: undefined
    }

    this.onDayClick = this.onDayClick.bind(this);
    this.onClearDeadline = this.onClearDeadline.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onDayClick = (day) => {
    this.setState({deadline: day});
  }

  onClearDeadline = () => {
    this.setState({deadline: undefined});
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit = event => {
    event.preventDefault();

    let task = {
      title: this.state.title,
      checked: "false",
      deadline: this.state.deadline == undefined ? "no deadline" : this.state.deadline.getTime().toString()
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks';

    axios
      .post(url, {task}, {withCredentials: true})
      .then(response => {
        if (response.data.task_created) {
          this.props.onChangeTasks(response.data.tasks);
          this.props.onUpdateTasks(response.data.tasks);
          this.setState({title: ""});
        } else {
          //todo error
          this.setState({title: ""});
        }
      });
  }

  render () {
    const checkbox = 
      (
        <button type="button" className='custom-checkbox align-middle'>
        </button>
      );

    return (
      <li className="list-group-item">
        <form onSubmit={this.onSubmit}>
          <div className="d-flex justify-content-between">
            <div>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control form-control-sm"
                onChange={this.onChange}
                required
                value={this.state.title}
                placeholder="New todo">
              </input>
            </div>

            <div>
              <DayPickerInput
                component={props => 
                  <button {...props} 
                    type="button"
                    className='btn btn-sm custom-button'>
                    <span className="far fa-calendar-alt"></span>
                  </button>}
                dayPickerProps={{
                  onDayClick: this.onDayClick,
                  selectedDays: this.state.deadline,
                  todayButton: 'No deadline',
                  onTodayButtonClick: this.onClearDeadline
                }}
              />
              <span className="mx-3 mt-1">
                {this.state.deadline
                  ? this.state.deadline.toLocaleDateString()
                  : "No deadline"}
              </span>
              <button
                type="submit"
                className="btn btn-sm custom-button">
                <a className="fas fa-plus"></a>
              </button>
            </div>
          </div>
        </form>
      </li>
    )
  }
}

export default AddTaskForm;