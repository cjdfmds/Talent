﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.loadData();
        this.loadEmployerProfile();
    };

     handleScroll() {

        if ((($(document).height() - $(window).height()) == Math.round($(window).scrollTop()))
            || ($(document).height() - $(window).height()) - Math.round($(window).scrollTop()) == 1) {

            let loadData = TalentUtil.deepCopy(this.state.loaderData)
            loadData.isLoading = true;
            let currentPosition = this.state.loadPosition;
            currentPosition += this.state.loadNumber;
            this.setState({
                loaderData: loadData,
                loadPosition: currentPosition
            },()=>{
                this.loadData()
            });
             
        }

    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        var localUrl = 'http://localhost:60290/profile/profile/getTalent'
       // var remoteUrl = 'https://talent-profile.azurewebsites.net/profile/profile/getTalent';
        $.ajax({
            url: localUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                position: this.state.loadPosition,
                number: this.state.loadNumber
            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let feedData = this.state.feedData.length > 0 ? this.state.feedData:[];
                if (res.data) {
                    feedData.push(...res.data)
                   
                }
                this.updateWithoutSave(feedData), console.log(feedData)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        });
        this.init()
    }

    loadEmployerProfile() {
        var cookies = Cookies.get('talentAuthToken');
        var localUrl = 'http://localhost:60290/profile/profile/getEmployerProfile';
        //var remoteUrl = 'https://talent-profile.azurewebsites.net/profile/profile/getEmployerProfile';
        $.ajax({
            url: localUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                
                if (res.employer) {
                    this.setState({
                        companyDetails: res.employer.companyContact
                    })
                }
               
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
        this.init()
    }

    //updates component's state without saving data
    updateWithoutSave(newData) {

        this.setState({
            feedData: newData
        });
    }


    render() {
        var talentFeed = this.state.feedData && this.state.feedData.length > 0
            ? this.state.feedData.map((t) =>
                <TalentCard talentData={t} key={t.id} />
            )
            : <p>There are no talent found for your recruitment company</p>;
        
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui grid">
                    <div className='ui four wide column'>
                        <CompanyProfile companyDetails={this.state.companyDetails} />
                    </div>
                    <div className='ui eight wide column'>
                        {talentFeed}
                    </div>
                    <div className='ui four wide column'>
                        <FollowingSuggestion />
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}
