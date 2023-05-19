import React from 'react';
import { Checkbox } from 'semantic-ui-react';

export default class TalentStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditSection: false,
      newJobStatus: {
        status: '',
        availableDate: ''
      }
    };

    this.openEdit = this.openEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveJobSeekingStatus = this.saveJobSeekingStatus.bind(this);
  }

  // Handle opening the edit section
  openEdit(event) {
    const jobSeekingStatus = Object.assign({}, this.props.jobSeekingStatus);

    this.setState({
      showEditSection: true,
      newJobStatus: jobSeekingStatus
    });
  }

  // Handle closing the edit section
  closeEdit() {
    this.setState({
      showEditSection: false
    });
  }

  // Handle changes in the input fields
  handleChange(event, { name, value }) {
    const newJobStatus = Object.assign({}, this.state.newJobStatus);
    newJobStatus[name] = value;

    this.setState({
      newJobStatus: newJobStatus
    });
  }

  // Save the job seeking status
  saveJobSeekingStatus() {
    const newJobStatus = Object.assign({}, this.state.newJobStatus);
    this.props.controlFunc(this.props.componentId, newJobStatus);
    this.closeEdit();
  }

  render() {
    return (
      this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
    );
  }

  renderEdit() {
    const { newJobStatus } = this.state;

    return (
      <div className="ui sixteen wide column grid">
        <div className='field'>
          <label>Current Status</label>
        </div>
        <div className='sixteen wide column'>
          {/* Checkbox options for job status */}
          {this.renderCheckboxOption('Actively looking for a job')}
          {this.renderCheckboxOption('Not looking for a job at the moment')}
          {this.renderCheckboxOption('Currently employed but open to offers')}
          {this.renderCheckboxOption('Will be available on a later date')}
        </div>

        <div className='ui sixteen wide column'>           
          {/* Save and cancel buttons */}
          <button type="button" className="ui teal button" onClick={this.saveJobSeekingStatus}>Save</button>
          <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
          </div> 
      </div>
    );
  }

  // Helper method to render checkbox options
  renderCheckboxOption(label) {
    const { newJobStatus } = this.state;

    return (
      <div className='sixteen wide column'>
        <Checkbox
          radio
          label={label}
          name='status'
          value={label}
          checked={newJobStatus.status === label}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  renderDisplay() {
    const { jobSeekingStatus } = this.props;
    const status = jobSeekingStatus ? jobSeekingStatus.status : 'N/A';
    const availableDate = jobSeekingStatus && jobSeekingStatus.availableDate;

    return (
      <div className="ui sixteen wide column">
        <React.Fragment>
          {/* Display the job seeking status */}
          <p>Current Status: {status}</p>
          {availableDate && <p>{availableDate}</p>}
        </React.Fragment>       
        <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
      </div>
    );
  }
}
