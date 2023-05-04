import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        const linkedAccounts = props.linkedAccounts ?
            props.linkedAccounts
            : {
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                }
            };

        this.state = {
            newLinkedAccounts: linkedAccounts,
        
        }


        this.handleLinkedInChange = this.handleLinkedInChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    componentDidMount() {

        $('.ui.button.social-media')
            .popup();


    }

    handleLinkedInChange(event) {
        this.setState({
            newLinkedAccounts: Object.assign({}, this.state.newLinkedAccounts, {
                linkedIn: event.target.value
            })
        });
    }

    handleGithubChange(event) {
        this.setState({
            newLinkedAccounts: Object.assign({}, this.state.newLinkedAccounts, {
                github: event.target.value
            })
        });
    }

    handleSave() {
        const data = this.state.newLinkedAccounts;

        $('.ui.modal').modal('hide');
        this.props.controlFunc(this.props.componentId, data);
        console.log(data);

    }

    handleEditClick() {
        console.log(this.state.linkedInURL)
        $('.ui.modal').modal('hide');
    }



    render() {
        let linkedIn = this.props.linkedAccounts ? this.props.linkedAccounts.linkedIn : "";
        let github = this.props.linkedAccounts ? this.props.linkedAccounts.github : "";

        return (
            <div className="ui four column grid">
                <div className="column">
                    <a href={linkedIn} className="ui linkedin button social-media" target='_blank'>
                        <i className="linkedin icon"></i>LinkedIn
                    </a>
                </div>
                <div className="column">
                    <a href={github} className="ui github black button social-media" target='_blank'>
                        <i className="github icon"></i>GitHub
                    </a>
                </div>

                <button type='button' className='ui right floated teal button' onClick={() => $('.ui.modal').modal('show')}>
                    Edit
                </button>

                <div className="ui modal">
                    <div className="header">Edit Social Media Links</div>
                    <div className="content">
                        <ChildSingleInput
                            inputType="text"
                            label="LinkedIn"
                            name="linkedInUrl"
                            value={this.state.newLinkedAccounts.linkedIn}
                            controlFunc={this.handleLinkedInChange}
                            maxLength={80}
                            placeholder="Enter your LinkedIn URL"
                            errorMessage="Please enter a valid LinkedIn URL"
                        />

                        <ChildSingleInput
                            inputType="text"
                            label="GitHub"
                            name="githubUrl"
                            value={this.state.newLinkedAccounts.github}
                            controlFunc={this.handleGithubChange}
                            maxLength={80}
                            placeholder="Enter your GitHub URL"
                            errorMessage="Please enter a valid GitHub URL"
                        />
                    </div>
                    <div className="actions">
                        <button type='button' className="ui black button" onClick={this.handleEditClick}>
                            Cancel
                        </button>
                        <button type='button' className="ui teal button" onClick={this.handleSave}>
                            Save
                        </button>
                    </div>
                </div>

            </div>


        )
    }
}
