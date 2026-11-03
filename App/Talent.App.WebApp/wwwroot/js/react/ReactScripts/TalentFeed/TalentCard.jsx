import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'

// An icon that opens a link in a new tab, or is greyed out when the talent hasn't provided one.
function LinkIcon({ iconName, url, label }) {
    // Links are entered by talents, so only allow http(s) to block "javascript:" URLs.
    if (!url || !/^https?:\/\//i.test(url)) {
        return <Popup trigger={<Icon name={iconName} disabled />} content={`No ${label} provided`} />;
    }
    return (
        <Popup
            trigger={<a href={url} target='_blank' rel='noopener noreferrer'><Icon name={iconName} /></a>}
            content={label}
        />
    );
}

export default function TalentCard({ talent }) {
    const [showProfile, setShowProfile] = useState(false);
    const skills = talent.skills || [];

    const renderVideo = () => {
        if (!talent.videoUrl) {
            return (
                <div className="content">
                    <p>This talent hasn't uploaded a video yet.</p>
                </div>
            );
        }
        return <ReactPlayer url={talent.videoUrl} controls width='100%' height='250px' />;
    };

    const renderProfile = () => (
        <div className="ui grid">
            <div className="eight wide column image-column">
                <img className="ui image image-talent" src={talent.photoId || '/images/no-image.png'} />
            </div>
            <div className="eight wide column talent-snapshot">
                <div className="ui vertical segment">
                    <h4>Talent snapshot</h4>
                    <p><b>CURRENT EMPLOYER</b><br />{talent.currentEmployment || '-'}</p>
                    <p><b>VISA STATUS</b><br />{talent.visa || '-'}</p>
                    <p><b>POSITION</b><br />{talent.level || '-'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="ui fluid card talent-card">
            <div className="content">
                <i className="right floated star icon" />
                <div className="header">{talent.name}</div>
            </div>

            {showProfile ? renderProfile() : renderVideo()}

            <div className="extra content profile-link">
                <div className="ui four column grid">
                    <div className="column">
                        <Popup
                            trigger={<Icon name={showProfile ? 'video camera' : 'user'} onClick={() => setShowProfile(!showProfile)} />}
                            content={showProfile ? 'Show video' : 'Show profile'}
                        />
                    </div>
                    <div className="column"><LinkIcon iconName='file pdf outline' url={talent.cvUrl} label='CV' /></div>
                    <div className="column"><LinkIcon iconName='linkedin' url={talent.linkedIn} label='LinkedIn' /></div>
                    <div className="column"><LinkIcon iconName='github' url={talent.github} label='GitHub' /></div>
                </div>
            </div>

            <div className="extra content">
                {skills.length === 0
                    ? <span>No skills listed</span>
                    : skills.map(skill => <span key={skill} className="ui blue basic label">{skill}</span>)
                }
            </div>
        </div>
    );
}

TalentCard.propTypes = {
    talent: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        photoId: PropTypes.string,
        videoUrl: PropTypes.string,
        cvUrl: PropTypes.string,
        currentEmployment: PropTypes.string,
        visa: PropTypes.string,
        level: PropTypes.string,
        skills: PropTypes.arrayOf(PropTypes.string),
        linkedIn: PropTypes.string,
        github: PropTypes.string
    }).isRequired
};
