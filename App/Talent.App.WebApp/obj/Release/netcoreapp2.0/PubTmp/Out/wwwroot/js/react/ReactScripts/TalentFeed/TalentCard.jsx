﻿import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon, Card, Label } from 'semantic-ui-react'
import TalentCardDetail from '../TalentFeed/TalentCardDetail.jsx';


export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);

    };



    render() {
        const talent = this.props.talentData;

        let skills = talent.skills && talent.skills.length > 0
            ? talent.skills.map(s => {
                if (s != '') {
                    return <Label basic color='blue' key={s} content={s} />
                }
            })
            : <p>No skills</p>

        return (
            <Card fluid key={talent.id}>
                <Card.Content>
                    <Card.Header>{talent.name}<Icon name='star' className='right floated' /></Card.Header>
                    
                </Card.Content>
                <TalentCardDetail talentData={talent} />
                <Card.Content extra>
                    {skills}
                </Card.Content>
            </Card>
        );
    }
}

