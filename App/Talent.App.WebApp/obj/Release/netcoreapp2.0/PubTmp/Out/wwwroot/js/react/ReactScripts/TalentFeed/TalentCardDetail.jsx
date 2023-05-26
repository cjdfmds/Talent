﻿import React from 'react';
import ReactPlayer from 'react-player';
import { Icon, Card, Image } from 'semantic-ui-react';

export default class TalentCardDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showVideo: true
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        var isShowVideo = true
        switch (event.target.id) {
            case 'user':
                isShowVideo = false;
                break;
            case 'video':
                isShowVideo = true;
                break;
            default:
                isShowVideo = true;
        }
        this.setState({
            showVideo: isShowVideo
        })
    }
    render() {
        let talent = this.props.talentData;
        let videoUrl = talent.videoUrl === null || talent.videoUrl === "" ? 'https://www.youtube.com/watch?v=XxXyfkrP298' : talent.videoUrl;
        let photoUrl = talent.photoId === null || talent.photoId === "" ? 'https://react.semantic-ui.com/images/avatar/large/matthew.png' : talent.photoId;
        let cardContent = undefined;
        if (!this.state.showVideo) {
            cardContent = <Card.Content className=''>
                <Image src={photoUrl} size='large' floated='left' />
                <Card.Header style={{ paddingBottom: '10px' }}>Talent snapshot</Card.Header>
                <Card.Meta style={{ color: 'black', paddingTop: '5px' }}>
                    <div style={{ paddingBottom:'10px' }}><b>CURRENT EMPLOYER</b><br />
                        {talent.currentEmployment === null || talent.currentEmployment === "" ? "N/A" : talent.currentEmployment}</div>
                    <div style={{ paddingBottom: '10px' }}><b>VISA STATUS</b><br />
                        {talent.visa === null || talent.visa === "" ? "N/A" : talent.visa}</div>
                    <div style={{ paddingBottom: '10px' }}><b>POSITION</b><br />
                        {talent.level === null || talent.level ===""?"N/A":talent.level}</div>
                </Card.Meta>
            </Card.Content>
        } else {
            cardContent = <Card.Content style={{ height: '300px' }}>
                <ReactPlayer url={videoUrl} controls={true} height='100%' width='100%' />
            </Card.Content>
        }
        var icon = this.state.showVideo ?
            <Icon id='user' name='user' size='large' onClick={this.handleClick} color='black' style={{ cursor: 'pointer' }} />
            : <Icon id='video' name='video' size='large' onClick={this.handleClick} color='black' style={{ cursor: 'pointer' }} />
        return (
            <div>
                <Card fluid>
                    {cardContent}

                    <Card.Content className='ui grid center aligned' extra>

                        <div style={{ marginRight: '0em' }} className='four wide column'>
                            {icon}
                        </div>
                        <div style={{ marginRight: '0em' }} className='four wide column '>

                            <Icon name='file pdf outline' size='large' color='black' style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ marginRight: '0em' }} className='four wide column ' >

                            <a href={talent.linkedin} target='_blank'><Icon name='linkedin' size='large' color='black' style={{ cursor: 'pointer' }} /></a>
                        </div>
                        <div style={{ marginRight: '0em' }} className='four wide column '>

                            <a href={talent.github} target='_blank'><Icon name='github' size='large' color='black' style={{ cursor: 'pointer' }} /></a>
                        </div>


                    </Card.Content>
                </Card>
            </div>
        );
    }
}
