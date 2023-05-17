import React from 'react';
import Cookies from 'js-cookie';
import { Table, Icon } from 'semantic-ui-react';


// Initial state for a new skill
const INITIAL_SKILL_STATE = { id: "", name: "", level: "" };

// Base API URL for profile operations
const API_URL = 'http://localhost:60290/profile/profile';

// This component is responsible for handling the skills section of a form
export default class Skill extends React.Component {
    // Initialize the component with needed states
    constructor(props) {
        super(props);

        // Set up initial state
        this.state = {
            showAddSection: false, // controls visibility of the add section
            isUpdate: false, // controls whether an update operation is being performed
            skills: [], // holds the list of skills
            newSkill: INITIAL_SKILL_STATE
        }

        // Bind 'this' context to the methods
        this.openAddSection = this.openAddSection.bind(this);
        this.closeAddSection = this.closeAddSection.bind(this);
        this.openEditSection = this.openEditSection.bind(this);
        this.closeEditSection = this.closeEditSection.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddUpdate = this.handleAddUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };

    // Load data when the component mounts
    componentDidMount() {
        this.loadData();
    }

    // Fetch skill data from an API
    loadData() {
        var cookies = Cookies.get('talentAuthToken');        
        const url = `${API_URL}/getSkill`;

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                // Update the state with the fetched skills
                this.setState({
                    skills: res.data
                })
            }.bind(this)
        })
    }

    // Open the add section and initialize newSkill state
    openAddSection() {
        this.setState({
            showAddSection: true,
            isUpdate: false,
            newSkill: {
                id: '',
                name: '',
                level: ''
            }
        });
    }

    // Close the add section
    closeAddSection() {
        this.setState({
            showAddSection: false
        });
    }

    // Open the edit section and set the newSkill state to the selected skill
    openEditSection(event) {
        var skill;
        this.state.skills.forEach(element => {
            if (element.id == event.target.id) {
                skill = element;
                return;
            }
        });

        this.setState({
            isUpdate: true,
            showAddSection: false,
            newSkill: skill
        });
    }

    // Close the edit section
    closeEditSection() {
        this.setState({
            isUpdate: false
        })
    }

    // Update the state as user types into input fields
    handleChange(event) {
        let data = Object.assign({}, this.state.newSkill); // Create a copy of the newSkill state object
        data[event.target.name] = event.target.value; // Update the copied object
        this.setState({ // Update the state with the modified copy
            newSkill: data
        });
    }

    // Call the appropriate method to add or update a skill
    handleAddUpdate() {       
        const UpdateSkillUrl = `${API_URL}/updateSkill`;
        const AddSkillUrl = `${API_URL}/addSkill`;
        if (this.state.isUpdate) {            
            this.AddUpdateSkill(UpdateSkillUrl);
        } else if (this.state.showAddSection) {            
            this.AddUpdateSkill(AddSkillUrl);
        }
    }

    // Delete a skill
    handleDelete(event) {
        var skill;
        this.state.skills.forEach(element => {
            if (element.id == event.target.id) {
                skill = element;
                return;
            }
        });
        this.setState({
            isUpdate: false,
            showAddSection: false
        });
        this.deleteSkill(skill);
    }

    // Send a POST request to add or update a skill
    AddUpdateSkill(url) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(this.state.newSkill),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated successfully", "success", null, null)
                    this.loadData();
                    this.setState({
                        isUpdate: false,
                        showAddSection: false
                    })
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                TalentUtil.notification.show("Error while saving User details", "error", null, null);
            }
        })
    }

    // Send a POST request to delete a skill
    deleteSkill(skill) {
        var cookies = Cookies.get('talentAuthToken');       
        const url = `${API_URL}/deleteSkill`;

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(skill),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated successfully", "success", null, null)
                    this.loadData();
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res);
                TalentUtil.notification.show("Error while deleting skill", "error", null, null);
            }
        })
    }

    // Render the component
    render() {
        // Define skill levels and create options for select
        const levels = ["Beginner", "Intermediate", "Expert"];
        const skillOptions = levels.map((x) => <option key={x} value={x}>{x}</option>);

        // Conditional rendering for Add skill section
        let addSkillSection = this.state.showAddSection ? (
            <div className="ui sixteen column grid">
                <div className='ui five wide column'>
                    <input
                        type="text"
                        name="name"
                        value={this.state.newSkill.name}
                        onChange={this.handleChange}
                        maxLength={80}
                        placeholder="Add Skill"
                    />
                </div>
                <div className='ui five wide column'>
                    <select placeholder='Language Level' value={this.state.newSkill.level} name='level' onChange={this.handleChange}>
                        <option value=''>Skill Level</option>
                        {skillOptions}
                    </select>
                </div>
                <div className='ui four wide column'>
                    <button type="button" className="ui teal button" onClick={this.handleAddUpdate}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeAddSection}>Cancel</button>
                </div>
            </div>
        ) : null;


        // Create table rows for each skill
        const skills = this.state.skills ? this.state.skills : [];
        let tableData = skills.map((x) => (
            <Table.Row key={x.id}>
                    <Table.Cell>
                        {(this.state.isUpdate && x.id == this.state.newSkill.id)
                            ? <input
                                type="text"
                                name="name"
                                value={this.state.newSkill.name}
                                onChange={this.handleChange}
                                maxLength={80}
                                placeholder="Add Skill"

                            />
                            : x.name}
                    </Table.Cell>
                    <Table.Cell>
                        {(this.state.isUpdate && x.id == this.state.newSkill.id)
                            ? <select placeholder='Skill Level' value={this.state.newSkill.level} name='level' onChange={this.handleChange}>
                                {skillOptions}
                            </select>
                            : x.level}
                    </Table.Cell>
                    {(this.state.isUpdate && x.id == this.state.newSkill.id)
                        ?
                        <Table.Cell>
                            <button id={x.id} className='ui blue basic button' type='button' onClick={this.handleAddUpdate}>Update</button>
                            <button className='ui basic red button' type='button' color='red' onClick={this.closeEditSection}>Cancel</button>
                        </Table.Cell>
                        :
                        <Table.Cell className='right aligned'>
                            <Icon id={x.id} name='pencil' onClick={this.openEditSection} />
                            <Icon id={x.id} name='delete' onClick={this.handleDelete} />
                        </Table.Cell>
                    }
                </Table.Row>
            )
        );

        // Render the component
        return (
            <div className='ui sixteen wide column'>
                {addSkillSection}
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Skill</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell className='right aligned'>
                                <button className='ui teal labeled icon button' type='button' onClick={this.openAddSection}><i className='add icon' />Add new</button>
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
