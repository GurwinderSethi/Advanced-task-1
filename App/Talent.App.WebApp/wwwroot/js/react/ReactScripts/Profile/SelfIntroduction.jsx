/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
    };

    handleChange(event) {
        const profileData = { [event.target.name]: event.target.value };

        this.props.updateWithoutSave(profileData);
    }

    saveDescription() {
        if (this.props.description.length < 150 && this.props.description.length > 0) {
            TalentUtil.notification.show("Description must be empty or greater than 150 characters", "error", null, null)
            return;
        }

        const profileData = {
            summary: this.props.summary,
            description: this.props.description
        };

        this.props.updateProfileData(profileData);
    }

    render() {
        return (
            <div className="ui sixteen wide column">
                <ChildSingleInput
                    inputType="text"
                    label="Summary"
                    name="summary"
                    value={this.props.summary}
                    controlFunc={this.handleChange}
                    maxLength={150}
                    placeholder="Please enter a short summary about yourself"
                    errorMessage=""
                />
                <p>Summary must be no more than 150 characters.</p>
                <div className='field'>
                    <label>Description</label>
                    <textarea
                        name='description'
                        maxLength={600}
                        placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add"
                        value={this.props.description}
                        onChange={this.handleChange}
                    />
                </div>
                <p>Description must be between 150-600 characters.</p>
                <button type='button' className='ui right floated teal button' onClick={this.saveDescription}>Save</button>
            </div>
        );
    }
}



