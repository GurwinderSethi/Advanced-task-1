import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showEditSection: false
        };

        // Map the countries into value title pairs for the country select field.
        this.countries = Object.keys(Countries).map(country => ({ value: country, title: country }));

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
    }

    openEdit() {
        this.setState({ showEditSection: true });
    }

    closeEdit() {
        this.setState({ showEditSection: false });
    }

    handleChange(event) {
        const profileData = {
            address: Object.assign({}, this.props.addressData, { [event.target.name]: event.target.value })
        };

        if (event.target.name === 'country') {
            // Country has changed so we need to invalidate the city or a user could save, sending an invalid combination to the database.
            profileData.address.city = '';
        }

        this.props.updateProfileData(profileData);
    }

    saveAddress() {
        const profileData = {
            address: this.props.addressData
        };

        this.props.saveProfileData(profileData);

        this.closeEdit();
    }

    render() {
        return this.state.showEditSection ? this.renderEdit() : this.renderDisplay();
    }

    renderDisplay() {
        const addressData = this.props.addressData;
        const address = `${addressData.number}, ${addressData.street}, ${addressData.suburb}, ${addressData.postCode}`;
        const city = addressData.city;
        const country = addressData.country;

        return (
            <div className='ui sixteen wide column'>
                <p>Address: {address}</p>
                <p>City: {city}</p>
                <p>Country: {country}</p>
                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
        );
    }

    renderEdit() {
        let cities;

        // Map the cities too if we have a country already set or set cities to an empty array for no options.
        if (this.props.addressData.country) {
            cities = Countries[this.props.addressData.country].map(city => ({ value: city, title: city }));
        } else {
            cities = [];
        }

        return (
            <React.Fragment>
                <div className='ui row'>
                    <div className='ui four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={this.props.addressData.number}
                            controlFunc={this.handleChange}
                            maxLength={12}
                            placeholder="Enter your street number and/or unit code"
                            errorMessage="Please enter a valid street number and/or unit code"
                        />
                    </div>
                    <div className='ui eight wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.props.addressData.street}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your street address"
                            errorMessage="Please enter a valid street address"
                        />
                    </div>
                    <div className='ui four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.props.addressData.suburb}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your suburb"
                            errorMessage="Please enter a valid suburb"
                        />
                    </div>
                </div>
                <div className='ui row'>
                    <div className='ui six wide column'>
                        <div className='field'>
                            <label>
                                Country
                            </label>
                            <Select
                                name='country'
                                selectedOption={this.props.addressData.country}
                                controlFunc={this.handleChange}
                                placeholder='Please select your country'
                                options={this.countries}
                            />
                        </div>
                    </div>
                    <div className='ui six wide column'>
                        <div className='field'>
                            <label>
                                City
                            </label>
                            <Select
                                name='city'
                                selectedOption={this.props.addressData.city}
                                controlFunc={this.handleChange}
                                placeholder='Please select your City'
                                options={cities}
                            />
                        </div>
                    </div>
                    <div className='ui four wide column'>
                        <ChildSingleInput
                            className='ui four wide column'
                            inputType="number"
                            label="Post Code"
                            name="postCode"
                            value={this.props.addressData.postCode}
                            controlFunc={this.handleChange}
                            maxLength={10}
                            placeholder="Enter your post code"
                            errorMessage="Please enter a post code"
                        />
                    </div>
                </div>
                <div className='ui sixteen wide column'>
                    <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                </div>
            </React.Fragment>
        );
    }
}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        // Map the countries into value title pairs for the nationality select field.
        this.nationalities = Object.keys(Countries).map(country => ({ value: country, title: country }));

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const profileData = { nationality: event.target.value };

        this.props.saveProfileData(profileData);
    }

    render() {
        return (
            <div className='ui six wide column'>
                <div className='field'>
                    <Select
                        name='nationality'
                        selectedOption={this.props.nationalityData}
                        controlFunc={this.handleChange}
                        placeholder='Please select your nationality'
                        options={this.nationalities}
                    />
                </div>
            </div>
        );
    }
}