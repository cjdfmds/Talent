// Import necessary libraries and JSON data
import React from 'react'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';


// Initial state for a new location
const INITIAL_ADDRESS_STATE = { country: '', city: '', addressNumber: '', street: '', suburb: '', postcode: '', };

// This component is responsible for handling the address section of a form
export class Address extends React.Component {
    constructor(props) {
        super(props)

        // Initialize the state with an address object and a boolean to manage the display of the edit section
        this.state = {
            showEditSection: false,
            newAddress: INITIAL_ADDRESS_STATE
        }

        // Bind 'this' context to the methods
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
    }

    // When opening the edit section, copy the current address to the newAddress state
    openEdit() {
        this.setState({
            showEditSection: true,
            newAddress: Object.assign({}, this.props.address)
        })
    }

    // When closing the edit section, simply update the boolean controlling the display
    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    // Update the state as user types into input fields
    handleChange(event) {
        const data = Object.assign({}, this.state.newAddress);
        data[event.target.name] = event.target.value;
        this.setState({
            newAddress: data
        });
    }

    // Save the new address when the user hits save button
    saveAddress() {
        const data = Object.assign({}, this.state.newAddress);
        this.props.controlFunc(this.props.componentId, data);
        this.closeEdit();
    }

    // Depending on the state of showEditSection, it renders the edit form or the display view
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        );
    }

    // Render the edit form with fields for address details
    renderEdit() {
        let countriesOptions = [];
        let citiesOptions = [];
        const selectedCountry = this.state.newAddress.country || '';
        const selectedCity = this.state.newAddress.city || '';

        countriesOptions = Object.keys(Countries).map((x) => (
            <option key={x} value={x}>
                {x}
            </option>
        ));

        if (selectedCountry !== '' && selectedCountry !== null) {
            citiesOptions = Countries[selectedCountry].map((x) => (
                <option key={x} value={x}>
                    {' '}
                    {x}
                </option>
            ));
        }

        return (
            <div className='ui sixteen column grid' >
                <div className='row'>
                    <div className='four wide column'>

                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={this.state.newAddress.number}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your house number"
                            errorMessage="Please enter a valid number"
                        />
                    </div>
                    <div className='eight wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.state.newAddress.street}
                            controlFunc={this.handleChange}
                            maxLength={200}
                            placeholder="Enter your street"
                            errorMessage="Please enter a valid street"

                        />
                    </div>
                    <div className='four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.state.newAddress.suburb}
                            controlFunc={this.handleChange}
                            maxLength={200}
                            placeholder="Enter your street"
                            errorMessage="Please enter a valid street"
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='field six wide column'>
                        <label>Country</label>
                        <select className="ui right labeled dropdown"
                            placeholder="Country"
                            value={selectedCountry}
                            onChange={this.handleChange}
                            name="country">

                            <option value="">Select a country</option>
                            {countriesOptions}
                        </select>
                    </div>
                    <div className='field six wide column'>
                        <label>Cities</label>
                        <select className="ui right labeled dropdown"
                            placeholder="City"
                            value={selectedCity}
                            onChange={this.handleChange}
                            name="city">

                            <option value="">Select a City</option>
                            {citiesOptions}
                        </select>
                    </div>
                    <div className='four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Postcode"
                            name="postCode"
                            value={this.state.newAddress.postCode}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your postcode"
                            errorMessage="Please enter a valid postcode"
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='eight wide column'>
                        <button type="button" className="ui teal button" onClick={this.saveAddress} >Save</button>
                        <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    renderDisplay() {
        const number = this.props.address ? this.props.address.number + ',' : '';
        const street = this.props.address ? this.props.address.street + ',' : '';
        const suburb = this.props.address ? this.props.address.suburb + ',' : '';
        const postCode = this.props.address ? this.props.address.postCode : 0;
        const city = this.props.address ? this.props.address.city : "";
        const country = this.props.address ? this.props.address.country : "";

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <React.Fragment>
                            <p>Address: {number}{street}{suburb}{postCode}</p>
                            <p>City: {city}</p>
                            <p>Country: {country}</p>
                        </React.Fragment>

                    </React.Fragment>
                    <button type='button' className='ui right floated teal button' onClick={this.openEdit} >Edit</button>
                </div>
            </div>
        );
    }
}

// This component is responsible for handling the nationality section of a form
export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        // Initialize the state with a string for newNationality and a boolean to manage the display of the save button
        this.state = {
            showEditSection: false,
            newNationality: "",
            showSaveButton: false
        }

        // Bind 'this' context to the methods
        this.handleChange = this.handleChange.bind(this);
        this.saveNationality = this.saveNationality.bind(this);
    }

    // If props.nationality changes, update the state
    componentDidUpdate(prevProps) {
        if (this.props.nationality !== prevProps.nationality) {
            this.setState({
                newNationality: this.props.nationality
            });
        }
    }

    // Update the state as user selects a nationality and show the save button
    handleChange(event) {
        this.setState({
            newNationality: event.target.value,
            showSaveButton: true
        });
    }

    // Save the new nationality when the user hits save button
    saveNationality() {
        const data = this.state.newNationality;
        this.props.controlFunc(this.props.componentId, data);
        this.setState({
            showSaveButton: false
        })
    }
    // Render the select field for nationality and a save button when a change is detected
    render() {
        const { showSaveButton, newNationality } = this.state;
        const countriesOptions = Object.keys(Countries).map((x) => (
            <option key={x} value={x}>
                {x}
            </option>
        ));
        const selectedNationality = newNationality || '';

        return (
            <div className='ui sixteen wide column'>
                <div className='ui grid'>
                    <div className='six wide column'>
                        <select className="ui right labeled dropdown"
                            placeholder="Select Your Nationality"
                            value={selectedNationality}
                            onChange={this.handleChange}
                            name="nationality">

                            <option value="">Select Your Nationality</option>
                            {countriesOptions}
                        </select>
                    </div>
                    {showSaveButton && (
                        <div className="ui four wide column">
                            <button type="button" className="ui teal button" onClick={this.saveNationality}>
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
