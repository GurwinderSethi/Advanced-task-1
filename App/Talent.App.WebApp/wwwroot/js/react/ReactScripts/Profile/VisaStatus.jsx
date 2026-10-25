import React from 'react'
import { Select } from '../Form/Select.jsx';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props);

        this.visaTypes = [
            { value: 'Citizen', title: 'Citizen' },
            { value: 'Permanent Resident', title: 'Permanent Resident' },
            { value: 'Work Visa', title: 'Work Visa' },
            { value: 'Student Visa', title: 'Student Visa' }
        ];

        this.handleChange = this.handleChange.bind(this);
        this.saveVisaStatus = this.saveVisaStatus.bind(this);
    }

    handleChange(event) {
        this.props.updateProfileData({ [event.target.name]: event.target.value });
    }

    saveVisaStatus() {
        this.props.saveProfileData({
            visaStatus: this.props.visaStatus,
            visaExpiryDate: this.props.visaExpiryDate
        });
    }

    render() {
        const needsExpiryDate = this.props.visaStatus === 'Work Visa' || this.props.visaStatus === 'Student Visa';
        const alreadyExpired = new Date(this.props.visaExpiryDate) <= Date.now();

        return (
            <React.Fragment>
                <div className='ui six wide column'>
                    <div className='field'>
                        <label>Visa Type</label>
                        <Select
                            name='visaStatus'
                            selectedOption={this.props.visaStatus}
                            controlFunc={this.handleChange}
                            placeholder='Please select a visa type'
                            options={this.visaTypes}
                        />
                    </div>
                </div>
                <div className='ui six wide column'>
                    {needsExpiryDate && (
                        <ChildSingleInput
                            label='Visa Expiry Date'
                            inputType='date'
                            name='visaExpiryDate'
                            value={this.props.visaExpiryDate}
                            controlFunc={this.handleChange}
                            errorMessage='Already past expiry date'
                            isError={alreadyExpired}
                        />
                    )}
                </div>
                <div className='ui four wide column'>
                    <button type='button' className='visa-status ui teal button' onClick={this.saveVisaStatus}>Save</button>
                </div>
            </React.Fragment>
        );
    }
}