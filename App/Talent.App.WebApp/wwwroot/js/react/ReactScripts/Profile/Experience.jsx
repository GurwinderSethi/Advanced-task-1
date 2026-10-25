/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { ItemSlide } from '../Form/ItemSlide.jsx';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddSection: false,
            showAddForm: false,
            newExperience: {
                company: '',
                position: '',
                responsibilities: '',
                start: '',
                end: ''
            }
        };

        this.openAdd = this.openAdd.bind(this);
        this.closeAdd = this.closeAdd.bind(this);
        this.hideAdd = this.hideAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editExperience = this.editExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
        this.saveExperience = this.saveExperience.bind(this);
    }

    openAdd() {
        this.setState({
            showAddSection: true,
            showAddForm: true
        });
    }

    closeAdd() {
        // Also reset newExperience to defaults so it's ready for future adds.
        this.setState({
            showAddForm: false,
            newExperience: {
                company: '',
                position: '',
                responsibilities: '',
                start: '',
                end: ''
            }
        });
    }

    hideAdd() {
        this.setState({
            showAddSection: false
        });
    }

    handleChange(event) {
        const experience = Object.assign({}, this.state.newExperience);
        experience[event.target.name] = event.target.value;

        this.setState({ newExperience: experience });
    }

    editExperience(experience) {
        const editedExperience = this.props.experienceData.map(value => {
            if (value.id === experience.id) {
                return experience;
            } else {
                return value;
            }
        });

        const profileData = {
            experience: editedExperience
        };

        this.props.updateProfileData(profileData);
    }

    deleteExperience(experience) {
        const editedExperience = this.props.experienceData.filter(value => {
            return value.id !== experience.id;
        });

        const profileData = {
            experience: editedExperience
        };

        this.props.updateProfileData(profileData);
    }

    saveExperience() {
        const profileData = {
            experience: [...this.props.experienceData, this.state.newExperience]
        };

        this.props.updateProfileData(profileData, true);
        this.closeAdd();
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showAddSection && (
                    <ItemSlide isOpen={this.state.showAddForm} slideIn duration={'500ms'} onClose={this.hideAdd} >
                        <div className='ui row-padded'>
                            <ExperienceAddForm
                                company={this.state.newExperience.company}
                                position={this.state.newExperience.position}
                                responsibilities={this.state.newExperience.responsibilities}
                                start={this.state.newExperience.start}
                                end={this.state.newExperience.end}
                                controlFunc={this.handleChange}
                                save={this.saveExperience}
                                cancel={this.closeAdd}
                            />
                        </div>
                    </ItemSlide>
                )}
                <div className='ui sixteen wide column'>
                    <table className='ui fixed table'>
                        <thead>
                            <tr>
                                <th>
                                    Company
                                </th>
                                <th>
                                    Position
                                </th>
                                <th>
                                    Responsibilities
                                </th>
                                <th>
                                    Start
                                </th>
                                <th>
                                    End
                                </th>
                                <th>
                                    <button type='button' className='ui right floated button' onClick={this.openAdd}>
                                        <i className='icon add' /> Add New
                                </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.experienceData.map(experience =>
                                <ExperienceItem
                                    key={experience.id}
                                    experienceData={experience}
                                    updateExperience={this.editExperience}
                                    deleteExperience={this.deleteExperience}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

class ExperienceItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditForm: false,
            company: '',
            position: '',
            responsibilities: '',
            start: '',
            end: ''
        }

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
    }

    openEdit() {
        // Take only the date portion from the UTC date.
        const startDate = this.props.experienceData.start.slice(0, 10);
        const endDate = this.props.experienceData.end.slice(0, 10);

        this.setState({
            showEditForm: true,
            company: this.props.experienceData.company,
            position: this.props.experienceData.position,
            responsibilities: this.props.experienceData.responsibilities,
            start: startDate,
            end: endDate
        });
    }

    closeEdit() {
        this.setState({
            showEditForm: false
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    saveEdit() {
        const experience = {
            id: this.props.experienceData.id,
            company: this.state.company,
            position: this.state.position,
            responsibilities: this.state.responsibilities,
            start: this.state.start,
            end: this.state.end
        };

        this.props.updateExperience(experience);

        this.closeEdit();
    }

    deleteExperience() {
        let experience = Object.assign({}, this.props.experienceData);

        this.props.deleteExperience(experience);

        this.closeEdit();
    }

    render() {
        return this.state.showEditForm ? this.renderEdit() : this.renderDisplay();
    }

    renderEdit() {
        return (
            <tr>
                <td colSpan='6'>
                    <ExperienceEditForm
                        company={this.state.company}
                        position={this.state.position}
                        responsibilities={this.state.responsibilities}
                        start={this.state.start}
                        end={this.state.end}
                        controlFunc={this.handleChange}
                        save={this.saveEdit}
                        cancel={this.closeEdit}
                    />
                </td>
            </tr>
        );
    }

    renderDisplay() {
        const start = TalentUtil.formatHelpers.formatDateWritten(this.props.experienceData.start);
        const end = TalentUtil.formatHelpers.formatDateWritten(this.props.experienceData.end);

        return (
            <tr>
                <td>{this.props.experienceData.company}</td>
                <td>{this.props.experienceData.position}</td>
                <td>{this.props.experienceData.responsibilities}</td>
                <td>{start}</td>
                <td>{end}</td>
                <td className='right aligned'>
                    <i className='icon write' onClick={this.openEdit} />
                    <Popup
                        trigger={<i className='icon delete' />}
                        content={<button type='button' className='ui negative button' onClick={this.deleteExperience}>Delete</button>}
                        on='click'
                        position='top center'
                    />
                </td>
            </tr>
        );
    }
}

ExperienceItem.propTypes = {
    experienceData: PropTypes.shape({
        id: PropTypes.string,
        company: PropTypes.string,
        position: PropTypes.string,
        responsibilities: PropTypes.string,
        start: PropTypes.string,
        end: PropTypes.string
    }).isRequired,
    updateExperience: PropTypes.func.isRequired
};

function ExperienceAddForm(props) {
    const startDate = new Date(props.start);
    const endDate = new Date(props.end);
    const endDateTooEarly = startDate > endDate;

    return (
        <div className='ui grid'>
            <div className='ui row'>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Company:'
                        inputType='text'
                        placeholder='Company'
                        name='company'
                        value={props.company}
                        maxLength={80}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter a valid company'
                        isError={false}
                    />
                </div>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Position:'
                        inputType='text'
                        placeholder='Position'
                        name='position'
                        value={props.position}
                        maxLength={80}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter a valid position'
                        isError={false}
                    />
                </div>
            </div>
            <div className='ui row'>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Start Date:'
                        inputType='date'
                        name='start'
                        value={props.start}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter a valid start date'
                        isError={false}
                    />
                </div>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='End Date:'
                        inputType='date'
                        name='end'
                        value={props.end}
                        controlFunc={props.controlFunc}
                        errorMessage='End date is earlier than start date'
                        isError={endDateTooEarly}
                    />
                </div>
            </div>
            <div className='ui row'>
                <div className='ui sixteen wide column'>
                    <ChildSingleInput
                        label='Responsibilities:'
                        inputType='text'
                        placeholder='Responsibilities'
                        name='responsibilities'
                        value={props.responsibilities}
                        maxLength={500}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter valid responsibiltiies'
                        isError={false}
                    />
                </div>
            </div>
            <div className='ui row'>
                <div className='ui sixteen wide column'>
                    <button type='button' className='ui teal button' onClick={props.save}>
                        Add
                </button>
                    <button type='button' className='ui button' onClick={props.cancel}>
                        Cancel
                </button>
                </div>
            </div>
        </div>
    );
}

function ExperienceEditForm(props) {
    const startDate = new Date(props.start);
    const endDate = new Date(props.end);
    const endDateTooEarly = startDate > endDate;

    return (
        <div className='ui grid'>
            <div className='ui row'>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Company'
                        inputType='text'
                        placeholder='Company'
                        name='company'
                        value={props.company}
                        maxLength={80}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter a valid company'
                        isError={false}
                    />
                </div>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Position'
                        inputType='text'
                        placeholder='Position'
                        name='position'
                        value={props.position}
                        maxLength={80}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter a valid position'
                        isError={false}
                    />
                </div>
            </div>
            <div className='ui row'>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='Start Date:'
                        inputType='date'
                        name='start'
                        value={props.start}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter a valid start date'
                        isError={false}
                    />
                </div>
                <div className='ui eight wide column'>
                    <ChildSingleInput
                        label='End Date:'
                        inputType='date'
                        name='end'
                        value={props.end}
                        controlFunc={props.controlFunc}
                        errorMessage='End date is earlier than start date'
                        isError={endDateTooEarly}
                    />
                </div>
            </div>
            <div className='ui row'>
                <div className='ui sixteen wide column'>
                    <ChildSingleInput
                        label='Responsibilities'
                        inputType='text'
                        placeholder='Responsibilities'
                        name='responsibilities'
                        value={props.responsibilities}
                        maxLength={500}
                        controlFunc={props.controlFunc}
                        errorMessage='Please enter valid responsibiltiies'
                        isError={false}
                    />
                </div>
            </div>
            <div className='ui row'>
                <div className='ui sixteen wide column'>
                    <button type='button' className='ui teal button' onClick={props.save}>
                        Update
                                </button>
                    <button type='button' className='ui button' onClick={props.cancel}>
                        Cancel
                                </button>
                </div>
            </div>
        </div>
    );
}