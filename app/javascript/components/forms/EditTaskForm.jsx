import React from 'react';
import axios from 'axios';

import DayPickerInput from 'react-day-picker/DayPickerInput';

class EditTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.task.title,
      deadline: (this.props.task.deadline == "no deadline")
      ? undefined
      : new Date(parseInt(this.props.task.deadline))
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
      deadline: this.state.deadline == undefined ? "no deadline" : this.state.deadline.getTime().toString(),
      tag_id: "editing title"
    }

    let url = '/users/' + this.props.user.id.toString() + '/tasks/' + this.props.task.id.toString();

    axios
      .patch(url, {task}, {withCredentials: true})
      .then(response => {
        if (response.data.task_updated) {
          this.props.onChangeTasks(response.data.tasks);
          this.props.onUpdateTasks(response.data.tasks);
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
              name="title"
              className="form-control form-control-sm"
              value={this.state.title}
              required
              onChange={this.onChange}>
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
            <span className="mx-3">
              {this.state.deadline
                ? this.state.deadline.toLocaleDateString()
                : "No deadline"}
            </span>

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

export default EditTaskForm;