﻿import React from 'react';
import Cookies from 'js-cookie';
import { Table, Icon } from 'semantic-ui-react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

// Define initial state for newExperience
const INITIAL_EXPERIENCE_STATE = {  
id: '',
company: '',
position: '',
responsibilities: '',
start: '',
end: '' 
};

// Base API URL for profile operations
const API_URL = 'http://localhost:60290/profile/profile';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddSection: false,
            isUpdate: false,
            experiences: [],
            newExperience: INITIAL_EXPERIENCE_STATE
        }

        this.openAddSection = this.openAddSection.bind(this);
        this.closeAddSection = this.closeAddSection.bind(this);
        this.openEditSection = this.openEditSection.bind(this);
        this.closeEditSection = this.closeEditSection.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddUpdate = this.handleAddUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.AddUpdateExperience = this.AddUpdateExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
        this.loadData = this.loadData.bind(this);       
        this.renderAddExperienceSection = this.renderAddExperienceSection.bind(this);
        this.renderEditExperienceRow = this.renderEditExperienceRow.bind(this);
        this.renderExperienceRow = this.renderExperienceRow.bind(this);      
        this.renderViewExperienceRow = this.renderViewExperienceRow.bind(this); 
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(){
        const cookies = Cookies.get('talentAuthToken');      
        const url = `${API_URL}/getExperience`;       

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function(res){
                this.setState({
                    experiences: res.data
                })
            }.bind(this)
        })
    }

    openAddSection(){
        this.setState({
            showAddSection: true,
            isUpdate: false,
            newExperience: Object.assign({}, INITIAL_EXPERIENCE_STATE)
        });
    }

    closeAddSection(){
        this.setState({
            showAddSection: false
        });
    }

    openEditSection(event){
        const experience = this.state.experiences.find(e => e.id === event.target.id);
        const start = new Date(experience.start);
        experience.start = start.toISOString().substr(0, 10);
        const end = new Date(experience.end);
        experience.end = end.toISOString().substr(0, 10);

        this.setState({
            isUpdate: true,
            showAddSection: false,
            newExperience: experience
        });
    }

    closeEditSection(){
        this.setState({
            isUpdate: false
        });
    }

    handleChange(event){
        const data = Object.assign({}, this.state.newExperience);
        data[event.target.name] = event.target.value;
        this.setState({
            newExperience: data
        });
    }

    handleAddUpdate(){
        const urlSuffix = this.state.isUpdate ? 'updateExperience' : 'addExperience';
        const url = `${API_URL}/${urlSuffix}`;
        this.AddUpdateExperience(url);
    }

    handleDelete(event){
        const experience = this.state.experiences.find(e => e.id === event.target.id);
        const start = new Date(experience.start);
        experience.start = start.toISOString().substr(0, 10);
        const end = new Date(experience.end);
        experience.end = end.toISOString().substr(0, 10);

        this.setState({
            isUpdate: false,
            showAddSection: false
        });

        this.deleteExperience(experience);
    }

    AddUpdateExperience(url){
        const cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(this.state.newExperience),
            success: (res) => {
                if (res.success === true) {
                    TalentUtil.notification.show("Profile updated successfully", "success", null, null)
                    this.loadData();
                    this.setState({
                        isUpdate: false,
                        showAddSection: false
                    })
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            },
            error: (res, a, b) => {
                console.log(res)
                TalentUtil.notification.show("Error while saving User details", "error", null, null);
            }
        })
    }

    deleteExperience(experience){
        const cookies = Cookies.get('talentAuthToken');     
        const url = `${API_URL}/deleteExperience`;  
        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(experience),
            success: (res) => {
                if (res.success === true) {
                    TalentUtil.notification.show("Profile updated successfully", "success", null, null)
                    this.loadData();
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            },
            error: (res, a, b) => {
                console.log(res);
                TalentUtil.notification.show("Error while saving User details", "error", null, null);
            }
        })
    }

    formatDate(d){
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const date = new Date(d);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day}th ${month}, ${year}`;
    }

    render() {
        const addExperienceSection = this.state.showAddSection ? this.renderAddExperienceSection() : null;
        const tableData = this.state.experiences.map(this.renderExperienceRow);

        return (
            <div className='ui sixteen wide column'>
                {addExperienceSection}
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Company</Table.HeaderCell>
                            <Table.HeaderCell>Position</Table.HeaderCell>
                            <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                            <Table.HeaderCell>Start</Table.HeaderCell>
                            <Table.HeaderCell>End</Table.HeaderCell>
                            <Table.HeaderCell className='right aligned'>
                                <button className='ui teal labeled icon button' type='button' onClick={this.openAddSection}>
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

    renderAddExperienceSection(){
        return (
            <div className="ui sixteen column grid">
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Company'
                        inputType="text"
                        name="company"
                        value={this.state.newExperience.company}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Company"
                        errorMessage="Please enter a valid company" />
                </div>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Position'
                        inputType="text"
                        name="position"
                        value={this.state.newExperience.position}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Position"
                        errorMessage="Please enter a valid position" />
                </div>
                <div className='ui eight wide column field'>
                    <label>Start Date</label>
                    <input type='date' name='start' value={this.state.newExperience.start} onChange={this.handleChange}></input>
                </div>
                <div className='ui eight wide column field'>
                    <label>End Date</label>
                    <input type='date' name='end' value={this.state.newExperience.end} onChange={this.handleChange}></input>
                </div>
                <div className='ui sixteen wide column'>
                    <ChildSingleInput
                        label='Responsibilities'
                        inputType="text"
                        name="responsibilities"
                        value={this.state.newExperience.responsibilities}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Responsibilities"
                        errorMessage="Please enter a valid" />
                </div>
                <div className='ui sixteen wide column'>
                    <button type="button" className="ui teal button" onClick={this.handleAddUpdate}>Add</button>
                    <button type="button" className="ui button" onClick={this.closeAddSection}>Cancel</button>
                </div>
            </div>
        );
    }


    renderExperienceRow(experience){
        if (this.state.isUpdate && experience.id === this.state.newExperience.id) {
            return this.renderEditExperienceRow(experience);
        } else {
            return this.renderViewExperienceRow(experience);
        }
    }

    renderEditExperienceRow(experience){
        return (
            <Table.Row key={experience.id}>
                <Table.Cell className='field' colSpan='3'>
                    <ChildSingleInput
                        label='Company'
                        inputType="text"
                        name="company"
                        value={this.state.newExperience.company}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Company"
                        errorMessage="Please enter a valid company" />

                    <label>Start Date</label>
                    <input type='date' name='start' value={this.state.newExperience.start} onChange={this.handleChange}></input>

                    <ChildSingleInput
                        label='Responsibilities'
                        inputType="text"
                        name="responsibilities"
                        value={this.state.newExperience.responsibilities}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Responsibilities"
                        errorMessage="Please enter a valid" />

                    <button id={experience.id} className='ui blue basic button' type='button' onClick={this.handleAddUpdate}>Update</button>
                    <button className='ui basic red button' type='button' color='red' onClick={this.closeEditSection}>Cancel</button>
                </Table.Cell>
                <Table.Cell verticalAlign='top' className='field' colSpan='3'>
                    <ChildSingleInput
                        label='Position'
                        inputType="text"
                        name="position"
                        value={this.state.newExperience.position}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Position"
                        errorMessage="Please enter a valid position" />

                    <label>End Date</label>
                    <input type='date' name='end' value={this.state.newExperience.end} onChange={this.handleChange}></input>
                </Table.Cell>
            </Table.Row>
        );
    }

    renderViewExperienceRow(experience){
        return (
            <Table.Row key={experience.id}>
                <Table.Cell>{experience.company}</Table.Cell>
                <Table.Cell>{experience.position}</Table.Cell>
                <Table.Cell>{experience.responsibilities}</Table.Cell>
                <Table.Cell>{this.formatDate(experience.start)}</Table.Cell>
                <Table.Cell>{this.formatDate(experience.end)}</Table.Cell>
                <Table.Cell className='right aligned'>
                    <Icon id={experience.id} name='pencil' onClick={this.openEditSection} />
                    <Icon id={experience.id} name='delete' onClick={this.handleDelete} />
                </Table.Cell>
            </Table.Row>
        );
    }

}


