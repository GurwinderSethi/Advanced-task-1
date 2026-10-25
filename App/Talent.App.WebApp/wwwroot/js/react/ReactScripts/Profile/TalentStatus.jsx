import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const jobStatus = Object.assign({}, this.props.jobStatus, { status: event.target.value });
        this.props.saveProfileData({ jobSeekingStatus: jobStatus });
    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                <div className='field'>
                    <label>Current Status</label>
                </div>
                <div className='field'>
                    <div className='ui radio checkbox'>
                        <input
                            type='radio'
                            name='jobSeekingStatus'
                            value='active'
                            onChange={this.handleChange}
                            checked={this.props.jobStatus.status === 'active'}
                        />
                        <label htmlFor='active'>Actively looking for a job</label>
                    </div>
                </div>
                <div className='field'>
                    <div className='ui radio checkbox'>
                        <input
                            type='radio'
                            name='jobSeekingStatus'
                            value='inactive'
                            onChange={this.handleChange}
                            checked={this.props.jobStatus.status === 'inactive'}
                        />
                        <label htmlFor='inactive'>Not looking for a job at the moment</label>
                    </div>
                </div>
                <div className='field'>
                    <div className='ui radio checkbox'>
                        <input
                            type='radio'
                            name='jobSeekingStatus'
                            value='employed'
                            onChange={this.handleChange}
                            checked={this.props.jobStatus.status === 'employed'}
                        />
                        <label htmlFor='employed'>Currently employed but open to offers</label>
                    </div>
                </div>
                <div className='field'>
                    <div className='ui radio checkbox'>
                        <input
                            type='radio'
                            name='jobSeekingStatus'
                            value='later'
                            onChange={this.handleChange}
                            checked={this.props.jobStatus.status === 'later'}
                        />
                        <label htmlFor='later'>Will be available on later date</label>
                    </div>
                </div>
            </div>
        );
    }
}