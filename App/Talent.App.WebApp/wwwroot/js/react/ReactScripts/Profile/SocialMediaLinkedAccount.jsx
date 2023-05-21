import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state with linkedAccounts from props or default values
        const linkedAccounts = props.linkedAccounts
            ? props.linkedAccounts
            : {
                  linkedAccounts: {
                      linkedIn: '',
                      github: ''
                  }
              };

        this.state = {
            newLinkedAccounts: linkedAccounts
        };

        this.handleLinkedInChange = this.handleLinkedInChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    componentDidMount() {
        $('.ui.button.social-media').popup();
    }

    // Update the state with the new LinkedIn URL entered by the user
    handleLinkedInChange(event) {
        const data = Object.assign({}, this.state.newLinkedAccounts);
        data.linkedIn = event.target.value;
        this.setState({
            newLinkedAccounts: data
        });
    }

    // Update the state with the new GitHub URL entered by the user
    handleGithubChange(event) {
        const data = Object.assign({}, this.state.newLinkedAccounts);
        data.github = event.target.value;
        this.setState({
            newLinkedAccounts: data
            });        
    }

    // Save the updated linked accounts and trigger the control function
    handleSave() {
        const data = this.state.newLinkedAccounts;

        $('.ui.modal').modal('hide');
        this.props.controlFunc(this.props.componentId, data);
        console.log(data);
    }

    // Handle the "Edit" button click
    handleEditClick() {
        console.log(this.state.linkedInURL);
        $('.ui.modal').modal('hide');
    }

    render() {
        let linkedIn = this.props.linkedAccounts ? this.props.linkedAccounts.linkedIn : '';
        let github = this.props.linkedAccounts ? this.props.linkedAccounts.github : '';

        return (
            <div className="ui four column grid">
                <div className="column">
                    {/* LinkedIn link */}
                    <a href={linkedIn} className="ui linkedin button social-media" target="_blank">
                        <i className="linkedin icon"></i>LinkedIn
                    </a>
                </div>
                <div className="column">
                    {/* GitHub link */}
                    <a href={github} className="ui github black button social-media" target="_blank">
                        <i className="github icon"></i>GitHub
                    </a>
                </div>

                {/* "Edit" button */}
                <button type="button" className="ui right floated teal button" onClick={() => $('.ui.modal').modal('show')}>
                    Edit
                </button>

                    {/* Modal for editing social media links */}
                    <div className="ui modal">
                    <div className="header">Edit Social Media Links</div>
                    <div className="content">
                        <div className="ui form">
                            {/* LinkedIn input */}
                            <div className="field">
                                <label>LinkedIn</label>
                                <ChildSingleInput
                                    inputType="text"
                                    name="linkedInUrl"
                                    value={this.state.newLinkedAccounts.linkedIn}
                                    controlFunc={this.handleLinkedInChange}
                                    maxLength={80}
                                    placeholder="Enter your LinkedIn URL"
                                    errorMessage="Please enter a valid LinkedIn URL"
                                />
                            </div>

                            {/* GitHub input */}
                            <div className="field">
                                <label>GitHub</label>
                                <ChildSingleInput
                                    inputType="text"
                                    name="githubUrl"
                                    value={this.state.newLinkedAccounts.github}
                                    controlFunc={this.handleGithubChange}
                                    maxLength={80}
                                    placeholder="Enter your GitHub URL"
                                    errorMessage="Please enter a valid GitHub URL"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        {/* "Cancel" button */}
                        <button type="button" className="ui black button" onClick={this.handleEditClick}>
                            Cancel
                        </button>
                        {/* "Save" button */}
                        <button type="button" className="ui teal button" onClick={this.handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
