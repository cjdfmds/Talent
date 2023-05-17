// React and third-party libraries
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon, Table, Dropdown } from 'semantic-ui-react';

// Initial state for a new language
const INITIAL_LANGUAGE_STATE = { id: "", name: "", level: "" };

// Base API URL for profile operations
const API_URL = 'http://localhost:60290/profile/profile';

// Main class for Language component
export default class Language extends React.Component {
    constructor(props) {
        super(props);
        // State variables
        this.state = {
            languages: [], // Holds the list of languages
            newLanguage: INITIAL_LANGUAGE_STATE, // Represents a new or editable language
            showAddSection: false, // Controls if add section should be displayed
            isUpdate: false // Determines if the operation is update or add
        };

        // Binding 'this' to the methods to make it accessible within the method
        this.loadData = this.loadData.bind(this);
        this.openAddLanguage = this.openAddLanguage.bind(this);
        this.closeAddLanguage = this.closeAddLanguage.bind(this);
        this.openEditLanguage = this.openEditLanguage.bind(this);
        this.closeEditLanguage = this.closeEditLanguage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddUpdate = this.handleAddUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    // Method runs after the component has been rendered to the DOM
    componentDidMount() {
        this.loadData();
    }

    // Fetch languages from the server
    loadData() {
        const cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: `${API_URL}/getLanguage`,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                // Update state with fetched languages
                this.setState({ languages: res.data });
            }.bind(this)
        })
    }

    // Opens the add language section
    openAddLanguage() {
        this.setState({
            showAddSection: true,
            newLanguage: INITIAL_LANGUAGE_STATE,
            isUpdate: false
        });
    }

    // Closes the add language section
    closeAddLanguage() {
        this.setState({ showAddSection: false });
    }

    // Opens the edit language section
    openEditLanguage(event) {
        // Find the language to edit from the list
        const language = this.state.languages.find(element => element.id === event.target.id);
        // If the language is found, set it as the new language and indicate we're updating
        if (language) {
            this.setState({
                isUpdate: true,
                showAddSection: false,
                newLanguage: language
            });
        }
    }

    // Closes the edit language section
    closeEditLanguage() {
        this.setState({ isUpdate: false });
    }

    // Handles changes in form fields
    handleChange(event) {
        // Get the name of the input field
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // Create a copy of the newLanguage state
        let newLanguage = Object.assign({}, this.state.newLanguage);

        // Update the specific field in the copied newLanguage object
        newLanguage[name] = value;

        // Now update the state with the modified copy
        this.setState({
            newLanguage: newLanguage
        });
    }


    // Decides if we're updating or adding a language, and calls the appropriate function
    handleAddUpdate() {
        const url = this.state.isUpdate
            ? `${API_URL}/updateLanguage`
            : this.state.showAddSection && `${API_URL}/addLanguage`;
        url && this.updateLanguage(url);
    }

    // Finds a language from the list and deletes it
    handleDelete(event) {
        // Find the language to delete from the list
        const language = this.state.languages.find(element => element.id === event.target.id);
        // If the language is found, delete it
        if (language) {
            this.deleteLanguage(language);
        }
        // Reset the state after deletion
        this.setState({
            isUpdate: false,
            showAddSection: false
        });
    }

    // Adds or updates a language
    updateLanguage(url) {
        const cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(this.state.newLanguage),
            success: function (res) {
                if (res.success === true) {
                    TalentUtil.notification.show("Profile updated successfully", "success", null, null)
                    this.loadData();
                    this.setState({ isUpdate: false });
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function () {
                TalentUtil.notification.show("Error while saving User details", "error", null, null);
            }
        })
    }

    // Deletes a language
    deleteLanguage(language) {
        const cookies = Cookies.get('talentAuthToken');
        const url = `${API_URL}/deleteLanguage`;

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(language),
            success: function (res) {
                if (res.success === true) {
                    TalentUtil.notification.show("Profile updated successfully", "success", null, null)
                    this.loadData();
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function () {
                TalentUtil.notification.show("Error while saving User details", "error", null, null);
            }
        })
    }

    // Renders the component
    render() {
        // Get languages array from the state, or initialize it as an empty array if it doesn't exist
        const languages = this.state.languages || [];
        let tableData = [];

        // Map each language to a table row
        languages.forEach((language, index) => {
            // Create a new row for each language, with special input fields if the language is currently being updated
            tableData.push(
                <Table.Row key={language.id}>
                    <Table.Cell>
                        {this.state.isUpdate && language.id === this.state.newLanguage.id
                            ? <input
                                type='text'
                                name='name'
                                value={this.state.newLanguage.name}
                                placeholder='Add Language'
                                maxLength={80}
                                onChange={this.handleChange}
                            />
                            : language.name}
                    </Table.Cell>
                    <Table.Cell>
                        {this.state.isUpdate && language.id === this.state.newLanguage.id
                            ? <select placeholder='Language Level' value={this.state.newLanguage.level} name='level' onChange={this.handleChange}>
                                <option value=''></option>
                                <option value='Basic'>Basic</option>
                                <option value='Conversational'>Conversational</option>
                                <option value='Fluent'>Fluent</option>
                                <option value='Native/Bilingual'>Native/Bilingual</option>
                            </select>
                            : language.level}
                    </Table.Cell>
                    {this.state.isUpdate && language.id === this.state.newLanguage.id
                        ? <Table.Cell>
                            <button id={language.id} className='ui blue basic button' type='button' onClick={this.handleAddUpdate}>Update</button>
                            <button className='ui basic red button' type='button' color='red' onClick={this.closeEditLanguage}>Cancel</button>
                        </Table.Cell>
                        : <Table.Cell className='right aligned'>
                            <Icon id={language.id} name='pencil' onClick={this.openEditLanguage} />
                            <Icon id={language.id} name='delete' onClick={this.handleDelete} />
                        </Table.Cell>
                    }
                </Table.Row>
            );
        });

        // Conditionally render the "Add Language" section
        const addLanguageSection = this.state.showAddSection && (
            <div className="ui sixteen column grid">
                <div className='ui five wide column'>
                    <input
                        type='text'
                        name='name'
                        value={this.state.newLanguage.name}
                        placeholder='Add Language'
                        maxLength={80}
                        onChange={this.handleChange}
                    />
                </div>
                <div className='ui five wide column'>
                    <select placeholder='Language Level' value={this.state.newLanguage.level} name='level' onChange={this.handleChange}>
                        <option value=''>Language Level</option>
                        <option value='Basic'>Basic</option>
                        <option value='Conversational'>Conversational</option>
                        <option value='Fluent'>Fluent</option>
                        <option value='Native/Bilingual'>Native/Bilingual</option>
                    </select>
                </div>
                <div className='ui six wide column'>
                    <button type="button" className="ui teal button" onClick={this.handleAddUpdate}>Add</button>
                    <button type="button" className="ui button" onClick={this.closeAddLanguage}>Cancel</button>
                </div>
            </div>
        );

        // Return the final JSX to be rendered
        return (
            <div className='ui sixteen column wide'>
                {addLanguageSection}
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Language</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell className='right aligned'>
                                <button className='ui teal labeled icon button' type='button' onClick={this.openAddLanguage}>
                                    <i className='add icon' />Add new
                                </button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}


