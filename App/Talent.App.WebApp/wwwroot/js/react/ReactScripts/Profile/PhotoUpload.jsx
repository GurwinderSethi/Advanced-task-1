/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uploaded: true,
            uploading: false
        };

        this.form = React.createRef();
        this.photoUpload = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.openUpload = this.openUpload.bind(this);
        this.upload = this.upload.bind(this);
    };

    handleChange() {
        if (this.photoUpload.current.files.length > 0) {
            const imageUrl = URL.createObjectURL(this.photoUpload.current.files[0]);

            this.setState({
                uploaded: false
            });

            this.props.updateProfileData({
                profilePhotoUrl: imageUrl
            });
        }
    }

    openUpload() {
        this.photoUpload.current.click();
    }

    upload() {
        var cookies = Cookies.get('talentAuthToken');
        const data = new FormData();
        data.append('photo', this.photoUpload.current.files[0]);

        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies
            },
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success === true) {
                    this.setState({
                        uploaded: true,
                        uploading: false
                    });

                    TalentUtil.notification.show("Updated profile photo successfully", "success", null, null);
                } else {
                    this.setState({
                        uploading: false
                    });

                    TalentUtil.notification.show("Couldn't upload profile photo", "error", null, null);
                }
            }.bind(this),
            error: function (res, a, b) {
                this.setState({
                    uploading: false
                });

                console.log(res);
                console.log(a);
                console.log(b);
            }
        });

        // Disable upload button after clicking.
        this.setState({
            uploading: true
        });
    }

    render() {
        const uploadButtonClasses = this.state.uploading ? 'ui loading teal button' : 'ui teal button';

        return (
            <div className='ui sixteen wide column'>
                <div className='photo-upload field' onClick={this.openUpload}>
                    {this.props.imageId ? 
                        <img className='ui circular image' src={this.props.imageId} />
                        :
                        <i className='ui circular icon camera retro' />
                    }
                    <input type='file' style={{ display: 'none' }} accept='image/*' ref={this.photoUpload} onChange={this.handleChange} />
                </div>
                {!this.state.uploaded &&
                    <button type='button' className={uploadButtonClasses} disabled={this.state.uploading} onClick={this.upload}>
                        <i className='icon upload' /> Upload
                    </button>
                }
            </div>
        );
        
    }
}
