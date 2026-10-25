/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            validLinkedIn: true,
            validGitHub: true
        };

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveLinkedAccounts = this.saveLinkedAccounts.bind(this);
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEdit() {
        this.setState({ showEditSection: true });
    }

    closeEdit() {
        this.setState({ showEditSection: false });
    }

    handleChange(event) {
        let validLinkedIn = this.state.validLinkedIn;
        let validGitHub = this.state.validGitHub;

        switch (event.target.name) {
            case 'linkedIn':
                // A LinkedIn profile url must have between 3 and 100 letters or numbers. Taken from the site when you edit your custom URL.
                // Accented characters are allowed which makes checking quite convoluted.
                if (event.target.value && !/^https:\/\/(www.)?linkedin.com\/in\/.{3,100}\/?$/.test(event.target.value)) {
                    validLinkedIn = false;
                } else {
                    validLinkedIn = true;
                }

                break;
            case 'github':
                // A GitHub profile url must have at least 1 alphanumeric character up to 39 maximum.
                // Also allowed is single hyphens but not at the beginning or end.
                // This RegExp will become quite large trying to follow the previous rule so we'll just allow hyphens anywhere.
                if (event.target.value && !/^https:\/\/(www.)?github.com\/[a-zA-Z0-9\-]{1,39}\/?$/.test(event.target.value)) {
                    validGitHub = false;
                } else {
                    validGitHub = true;
                }

                break;
            default:
                break;
        }

        // Update validation states so we can show errors.
        this.setState({
            validLinkedIn: validLinkedIn,
            validGitHub: validGitHub
        });

        // We want linkedAccounts to be an innerobject just like how the AccountProfile state object has it.
        const profileData = {
            linkedAccounts: Object.assign({}, this.props.linkedAccounts)
        };
        profileData.linkedAccounts[event.target.name] = event.target.value;
        this.props.updateProfileData(profileData);
    }

    saveLinkedAccounts() {
        const validLinkedIn = this.state.validLinkedIn;
        const validGitHub = this.state.validGitHub;

        if (!validLinkedIn || !validGitHub) {
            TalentUtil.notification.show("Please enter valid LinkedIn and GitHub URLs", "error", null, null);
        } else {
            // We want linkedAccounts to be an innerobject just like how the AccountProfile state object has it.
            const profileData = {
                linkedAccounts: Object.assign({}, this.props.linkedAccounts)
            };
            profileData.linkedAccounts[event.target.name] = event.target.value;
            this.props.saveProfileData(profileData);
            this.closeEdit();
        }
    }

    render() {
        return this.state.showEditSection ? this.renderEdit() : this.renderDisplay();
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.props.linkedAccounts.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your LinkedIn URL"
                    isError={!this.state.validLinkedIn}
                    errorMessage="Please enter a valid LinkedIn URL: https://www.linkedin.com/in/example"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.props.linkedAccounts.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your GitHub URL"
                    isError={!this.state.validGitHub}
                    errorMessage="Please enter a valid GitHub URL: https://www.github.com/example"
                />

                <button type="button" className="ui teal button" onClick={this.saveLinkedAccounts}>Save</button>
                <button type='button' className='ui button' onClick={this.closeEdit}>Cancel</button>
            </div>
        );
    }

    renderDisplay() {
        return (
            <div className='ui sixteen wide column'>
                <a className='ui linkedin button' href={this.props.linkedAccounts.linkedIn} >
                    <i className='icon linkedin' /> LinkedIn
                </a>
                <a className='ui black button' href={this.props.linkedAccounts.github} >
                    <i className='icon github' /> GitHub
                </a>
                <button type='button' className='ui right floated black button' onClick={this.openEdit}>
                    Edit
                </button>
            </div>
        );
    }
}