﻿import React from 'react'

// Initial state for a new Visa
const INITIAL_VISA_STATE = { VisaStatus: '', VisaExpiryDate: '' };
// Visa types
const VISA_TYPES = ['Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa'];

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        // Initialize state
        this.state = {
            showEditSection: false,
            newVisa: INITIAL_VISA_STATE,
            isStudentWorkVisa: false
        }

        // Bind functions to 'this'
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveVisaStatus = this.saveVisaStatus.bind(this);
    }

    openEdit() {
        // Prepare newVisa state with current props
        const newVisa = {
            visaStatus: this.props.visaStatus || '',
            visaExpiryDate: this.formatDate(this.props.visaExpiryDate) || ''
        }

        // Calculate isStudentVisa flag
        const isStudentWorkVisa = !!(this.props.visaExpiryDate);

        // Update state
        this.setState({
            showEditSection: true,
            isStudentWorkVisa,
            newVisa
        });
    }

    formatDate(date) {
        // Format the date to yyyy-mm-dd format or return an empty string if no date
        return date ? new Date(date).toISOString().substr(0, 10) : '';
    }

    closeEdit() {
        // Update state to hide edit section
        this.setState({
            showEditSection: false
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
      
        // Copy newVisa from state and update the changed field
        const newVisa = Object.assign({}, this.state.newVisa);
        newVisa[name] = value;
      
        // Determine if the current visa is a student or work visa
        const isStudentWorkVisa =
          newVisa.visaStatus === "Work Visa" || newVisa.visaStatus === "Student Visa";
      
        if (!isStudentWorkVisa) {
          // If not a student or work visa, set expiry date to empty string
          newVisa.visaExpiryDate = "";
        }
      
        // Update state
        this.setState({
          newVisa: newVisa,
          isStudentWorkVisa: isStudentWorkVisa,
        });
      }
      

    saveVisaStatus() {
        // Send the new visa data back to the parent component
        this.props.controlFunc('', this.state.newVisa);

        // Close the edit section
        this.closeEdit();
    }

    render() {
        // Conditional rendering based on the state
        return this.state.showEditSection ? this.renderEdit() : this.renderDisplay();
    }

    renderEdit() {
        // Predefined visa types
        const visaOptions = VISA_TYPES.map((x) => <option key={x} value={x}>{x}</option>);       
    
        return (
            <div className='ui sixteen column grid' >
                <div className='four wide column field'>
                    <label>Visa Type</label>
                    <select className="ui right labeled dropdown"
                        placeholder="Visa Type"
                        value={this.state.newVisa.visaOptions}
                        onChange={this.handleChange}
                        name="visaStatus">
    
                        <option value="">Select a Visa</option>
                        {visaOptions}
                    </select>
                </div>
    
                {/* Conditionally render visa expiry date field */}
                {this.state.isStudentWorkVisa && (
                    <div className='four wide column field'>
                        <label>Expiry Date</label>
                        <input type='date' name='visaExpiryDate' value={this.state.newVisa.visaExpiryDate} onChange={this.handleChange}></input>
                    </div>
                )}
    
                <div className='sixteen wide column '>
                    <button type="button" className="ui teal button" onClick={this.saveVisaStatus} >Save</button>                 
                </div>
            </div>
        );
    }
    
    renderDisplay() {
        const visaStatus = this.props.visaStatus || "N/A";
        const visaExpiryDate = this.formatDate(this.props.visaExpiryDate);
    
        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <p>Visa Type: {visaStatus}</p>
    
                    {/* Conditionally render Visa Expiry section */}
                    {visaExpiryDate && <p>Visa Expiry: {visaExpiryDate}</p>}
    
                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
        )
    }
}    