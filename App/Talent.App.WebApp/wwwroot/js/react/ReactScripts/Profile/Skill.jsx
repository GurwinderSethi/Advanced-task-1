/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { SingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { ItemSlide } from '../Form/ItemSlide.jsx';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

// Potential skill proficiency levels.
const skillLevels = [
    { value: 'Beginner', title: 'Beginner' },
    { value: 'Intermediate', title: 'Intermediate' },
    { value: 'Expert', title: 'Expert' }
];

export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddSection: false,
            showAddForm: false,
            newSkill: {
                name: '',
                level: ''
            }
        };

        this.openAdd = this.openAdd.bind(this);
        this.closeAdd = this.closeAdd.bind(this);
        this.hideAdd = this.hideAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editSkill = this.editSkill.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.saveSkill = this.saveSkill.bind(this);
    }

    openAdd() {
        this.setState({
            showAddSection: true,
            showAddForm: true
        });
    }

    closeAdd() {
        // Also reset newSkill to defaults so it's ready for future adds.
        this.setState({
            showAddForm: false,
            newSkill: {
                name: '',
                level: ''
            }
        });
    }

    hideAdd() {
        this.setState({
            showAddSection: false
        });
    }

    handleChange(event) {
        const skill = Object.assign({}, this.state.newSkill);
        skill[event.target.name] = event.target.value;

        this.setState({ newSkill: skill });
    }

    editSkill(skill) {
        const editedskill = this.props.skillData.map(value => {
            if (value.id === skill.id) {
                return skill;
            } else {
                return value;
            }
        });

        const profileData = {
            skills: editedskill
        };

        this.props.updateProfileData(profileData);
    }

    deleteSkill(skill) {
        const editedskill = this.props.skillData.filter(value => {
            return value.id !== skill.id;
        });

        const profileData = {
            skills: editedskill
        };

        this.props.updateProfileData(profileData);
    }

    saveSkill() {
        const profileData = {
            skills: [...this.props.skillData, this.state.newSkill]
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
                            <SkillAddForm
                                name={this.state.newSkill.name}
                                level={this.state.newSkill.level}
                                controlFunc={this.handleChange}
                                save={this.saveSkill}
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
                                    Skill
                                </th>
                                <th>
                                    Level
                                </th>
                                <th>
                                    <button type='button' className='ui right floated button' onClick={this.openAdd}>
                                        <i className='icon add' /> Add New
                                </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.skillData.map(skill =>
                                <SkillItem
                                    key={skill.id}
                                    skillData={skill}
                                    updateSkill={this.editSkill}
                                    deleteSkill={this.deleteSkill}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );

    }
}

class SkillItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditForm: false,
            name: '',
            level: ''
        }

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
    }

    openEdit() {
        this.setState({
            showEditForm: true,
            name: this.props.skillData.name,
            level: this.props.skillData.level
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
        const skill = {
            id: this.props.skillData.id,
            name: this.state.name,
            level: this.state.level
        };

        this.props.updateSkill(skill);

        this.closeEdit();
    }

    deleteSkill() {
        let skill = Object.assign({}, this.props.skillData);

        this.props.deleteSkill(skill);

        this.closeEdit();
    }

    render() {
        return this.state.showEditForm ? this.renderEdit() : this.renderDisplay();
    }

    renderEdit() {
        return (
            <tr>
                <td colSpan='3'>
                    <SkillEditForm
                        name={this.state.name}
                        level={this.state.level}
                        controlFunc={this.handleChange}
                        save={this.saveEdit}
                        cancel={this.closeEdit}
                    />
                </td>
            </tr>
        );
    }

    renderDisplay() {
        return (
            <tr>
                <td>{this.props.skillData.name}</td>
                <td>{this.props.skillData.level}</td>
                <td className='right aligned'>
                    <i className='icon write' onClick={this.openEdit} />
                    <Popup
                        trigger={<i className='icon delete' />}
                        content={<button type='button' className='ui negative button' onClick={this.deleteSkill}>Delete</button>}
                        on='click'
                        position='top center'
                    />
                </td>
            </tr>
        );
    }
}

SkillItem.propTypes = {
    skillData: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        level: PropTypes.string
    }).isRequired,
    updateSkill: PropTypes.func.isRequired
};

function SkillAddForm(props) {
    return (
        <div className='ui grid'>
            <div className='ui five wide column'>
                <SingleInput
                    inputType='text'
                    placeholder='Add Skill'
                    name='name'
                    content={props.name}
                    controlFunc={props.controlFunc}
                    errorMessage='Please enter a valid skill'
                    isError={false}
                />
            </div>
            <div className='ui five wide column'>
                <Select
                    name='level'
                    placeholder='Skill Level'
                    selectedOption={props.level}
                    controlFunc={props.controlFunc}
                    options={skillLevels}
                />
            </div>
            <div className='ui six wide column'>
                <button type='button' className='ui teal button' onClick={props.save}>
                    Add
                </button>
                <button type='button' className='ui button' onClick={props.cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

function SkillEditForm(props) {
    return (
        <div className='ui grid'>
            <div className='ui five wide column'>
                <SingleInput
                    inputType='text'
                    placeholder='Add Skill'
                    name='name'
                    content={props.name}
                    controlFunc={props.controlFunc}
                    errorMessage='Please enter a valid skill'
                    isError={false}
                />
            </div>
            <div className='ui five wide column'>
                <Select
                    name='level'
                    placeholder='Skill Level'
                    selectedOption={props.level}
                    controlFunc={props.controlFunc}
                    options={skillLevels}
                />
            </div>
            <div className='ui six wide column'>
                <button type='button' className='ui primary basic button' onClick={props.save}>Update</button>
                <button type='button' className='ui negative basic button' onClick={props.cancel}>Cancel</button>
            </div>
        </div>
    );
}