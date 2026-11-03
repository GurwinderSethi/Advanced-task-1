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

    needsExpiryDate() {
        return this.props.visaStatus === 'Work Visa' || this.props.visaStatus === 'Student Visa';
    }

    saveVisaStatus() {
        // Citizens and permanent residents have no expiry, so don't keep a stale date for them.
        this.props.saveProfileData({
            visaStatus: this.props.visaStatus,
            visaExpiryDate: this.needsExpiryDate() ? (this.props.visaExpiryDate || null) : null
        });
    }

    render() {
        const needsExpiryDate = this.needsExpiryDate();
        // The server returns a full timestamp (e.g. 2026-12-31T00:00:00Z), but a date input only accepts yyyy-MM-dd.
        const expiryDate = this.props.visaExpiryDate ? String(this.props.visaExpiryDate).substring(0, 10) : '';
        const alreadyExpired = expiryDate !== '' && new Date(expiryDate) <= Date.now();

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
                            value={expiryDate}
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