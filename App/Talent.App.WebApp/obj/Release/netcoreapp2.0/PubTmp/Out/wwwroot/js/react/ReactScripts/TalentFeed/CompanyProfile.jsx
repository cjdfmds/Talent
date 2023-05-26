﻿import React from 'react';
import { Loader, Card, Icon, Image, CommentAction } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let company = this.props.companyDetails;
        return (

            <Card className='centered'>
                <Card.Content className='center aligned'>
                    <Image src='../../../../images/no-image.png' circular size='tiny' />
                    <Card.Header>{company != null ? company.name : "NA"}</Card.Header>
                    <Card.Meta>
                        <Icon name='marker' />{company != null ? company.location.city + ", " + company.location.country : "NA"}
                    </Card.Meta>
                    <Card.Description>
                        <p>We currently do not have specific skills that we desire</p>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='phone' />:{company != null ? company.phone :"N/A"}<br />
                    <Icon name='mail' />:{company != null ? company.email : "N/A"}
                </Card.Content>
            </Card>
        )
    }
}
