﻿/* Photo upload section */
import React from 'react';
import ReactDOM from "react-dom";
import Cookies from 'js-cookie';
import { Icon, Button, Form, FormField, Input, Image } from 'semantic-ui-react';

export default class PhotoUpload extends React.Component {

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();

        this.state = {
            fileUploadState: null,
            photoIcon: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
    };

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        var localUrl = 'http://localhost:60290/profile/profile/getProfileImage';       
        $.ajax({
            url: localUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                Id: this.props.imageId
            },
            success: function (res) {
                this.setState({
                    photoIcon: res.data
                })
            }.bind(this)
        })
    }


    handleChange(event) {
        var imageFile = event.target.files[0];
        console.log(imageFile)
        var isValidImage = this.checkFileExtension(imageFile['type']);

        if (isValidImage) {

            this.setState({
                fileUploadState: imageFile,
                photoIcon: URL.createObjectURL(event.target.files[0])
            });
        } else {
            alert("Invalid File Extension");
        }
    }

    // Check For File type to be of image
    checkFileExtension(fileType) {
        const validImageTypes = ['image/jpeg', 'image/png'];
        return validImageTypes.includes(fileType);
    }


    uploadPhoto() {
        var formData = new FormData();
        formData.append('file', this.state.fileUploadState);

        var cookies = Cookies.get('talentAuthToken');
        var localUrl = 'http://localhost:60290/profile/profile/updateProfilePhoto';       

        $.ajax({
            url: localUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,

            },
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    this.loadData();

                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)

                TalentUtil.notification.show("Error while saving User details", "error", null, null);
            }
        })
    }










    render() {
        //var site = "https://talent-profile.scm.azurewebsites.net/api/vfs/site/wwwroot/wwwroot/images/";
        var buttonIcon;
        if (this.state.photoIcon == null){
            buttonIcon =
                <Icon name='camera retro' circular size='huge' onClick={() => this.fileInputRef.current.click()} />
        } else {
            buttonIcon =
                <Image ui src={this.state.photoIcon} circular onClick={() => this.fileInputRef.current.click()} width='150px' height='150px' />
        }
        return (
            <div className='ui sixteen wide column'>

                <div>
                    <input ref={this.fileInputRef} type='file' hidden onChange={this.handleChange} />
                    {buttonIcon}
                </div>

                <Button style={{ marginTop: '10px' }} type='button' icon='upload' color='black' name='upload' content='upload' onClick={this.uploadPhoto} />

            </div>
        );

    }
}
