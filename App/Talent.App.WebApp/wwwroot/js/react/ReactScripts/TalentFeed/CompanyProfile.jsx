import React from 'react';
import { Loader } from 'semantic-ui-react';

export default function CompanyProfile({ companyDetails }) {
    if (!companyDetails) {
        return (
            <div className="ui card">
                <div className="content">
                    <Loader active inline='centered' />
                </div>
            </div>
        );
    }

    const location = companyDetails.location || {};
    const locationText = [location.city, location.country].filter(x => x).join(', ');

    return (
        <div className="ui card">
            <div className="content">
                <div className="center aligned">
                    <img className="ui tiny circular centered image" src="/images/no-image.png" />
                </div>
                <div className="center aligned header">{companyDetails.name}</div>
                <div className="center aligned meta">
                    <i className="marker icon" />{locationText || 'Location not set'}
                </div>
                <div className="center aligned description">
                    <p>We currently do not have specific skills that we desire.</p>
                </div>
            </div>
            <div className="extra content">
                <div><i className="phone icon" /> : {companyDetails.phone || '-'}</div>
                <div><i className="envelope icon" /> : {companyDetails.email || '-'}</div>
            </div>
        </div>
    );
}
