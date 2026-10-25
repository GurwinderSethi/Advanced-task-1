/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { SingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { ItemSlide } from '../Form/ItemSlide.jsx';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

// Potential language proficiency levels.
const languageLevels = [
    { value: 'Basic', title: 'Basic' },
    { value: 'Conversational', title: 'Conversational' },
    { value: 'Fluent', title: 'Fluent' },
    { value: 'Native/Bilingual', title: 'Native/Bilingual' }
];

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddSection: false,
            showAddForm: false,
            newLanguage: {
                name: '',
                level: ''
            }
        };

        this.openAdd = this.openAdd.bind(this);
        this.closeAdd = this.closeAdd.bind(this);
        this.hideAdd = this.hideAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editLanguage = this.editLanguage.bind(this);
        this.deleteLanguage = this.deleteLanguage.bind(this);
        this.saveLanguage = this.saveLanguage.bind(this);
    }

    openAdd() {
        this.setState({
            showAddSection: true,
            showAddForm: true
        });
    }

    closeAdd() {
        // Also reset newLanguage to defaults so it's ready for future adds.
        this.setState({
            showAddForm: false,
            newLanguage: {
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
        const language = Object.assign({}, this.state.newLanguage);
        language[event.target.name] = event.target.value;

        this.setState({ newLanguage: language });
    }

    editLanguage(language) {
        const editedLanguage = this.props.languageData.map(value => {
            if (value.id === language.id) {
                return language;
            } else {
                return value;
            }
        });

        const profileData = {
            languages: editedLanguage
        };

        this.props.updateProfileData(profileData);
    }

    deleteLanguage(language) {
        const editedLanguage = this.props.languageData.filter(value => {
            return value.id !== language.id;
        });

        const profileData = {
            languages: editedLanguage
        };

        this.props.updateProfileData(profileData);
    }

    saveLanguage() {
        const profileData = {
            languages: [...this.props.languageData, this.state.newLanguage]
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
                            <LanguageAddForm
                                name={this.state.newLanguage.name}
                                level={this.state.newLanguage.level}
                                controlFunc={this.handleChange}
                                save={this.saveLanguage}
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
                                    Language
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
                            {this.props.languageData.map(language =>
                                <LanguageItem
                                    key={language.id}
                                    languageData={language}
                                    updateLanguage={this.editLanguage}
                                    deleteLanguage={this.deleteLanguage}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

class LanguageItem extends React.Component {
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
        this.deleteLanguage = this.deleteLanguage.bind(this);
    }

    openEdit() {
        this.setState({
            showEditForm: true,
            name: this.props.languageData.name,
            level: this.props.languageData.level
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
        const language = {
            id: this.props.languageData.id,
            name: this.state.name,
            level: this.state.level
        };

        this.props.updateLanguage(language);

        this.closeEdit();
    }

    deleteLanguage() {
        let language = Object.assign({}, this.props.languageData);

        this.props.deleteLanguage(language);

        this.closeEdit();
    }

    render() {
        return this.state.showEditForm ? this.renderEdit() : this.renderDisplay();
    }

    renderEdit() {
        return (
            <tr>
                <td colSpan='3'>
                    <LanguageEditForm
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
                <td>{this.props.languageData.name}</td>
                <td>{this.props.languageData.level}</td>
                <td className='right aligned'>
                    <i className='icon write' onClick={this.openEdit} />
                    <Popup
                        trigger={<i className='icon delete' />}
                        content={<button type='button' className='ui negative button' onClick={this.deleteLanguage}>Delete</button>}
                        on='click'
                        position='top center'
                    />
                </td>
            </tr>
        );
    }
}

LanguageItem.propTypes = {
    languageData: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        level: PropTypes.string
    }).isRequired,
    updateLanguage: PropTypes.func.isRequired
};

function LanguageAddForm(props) {
    return (
        <div className='ui grid'>
            <div className='ui five wide column'>
                <SingleInput
                    inputType='text'
                    placeholder='Add Language'
                    name='name'
                    content={props.name}
                    controlFunc={props.controlFunc}
                    errorMessage='Please enter a valid language'
                    isError={false}
                />
            </div>
            <div className='ui five wide column'>
                <Select
                    name='level'
                    placeholder='Language Level'
                    selectedOption={props.level}
                    controlFunc={props.controlFunc}
                    options={languageLevels}
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

function LanguageEditForm(props) {
    return (
        <div className='ui grid'>
            <div className='ui five wide column'>
                <SingleInput
                    inputType='text'
                    placeholder='Add Language'
                    name='name'
                    content={props.name}
                    controlFunc={props.controlFunc}
                    errorMessage='Please enter a valid language'
                    isError={false}
                />
            </div>
            <div className='ui five wide column'>
                <Select
                    name='level'
                    placeholder='Language Level'
                    selectedOption={props.level}
                    controlFunc={props.controlFunc}
                    options={languageLevels}
                />
            </div>
            <div className='ui six wide column'>
                <button type='button' className='ui primary basic button' onClick={props.save}>
                    Update
                </button>
                <button type='button' className='ui negative basic button' onClick={props.cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}