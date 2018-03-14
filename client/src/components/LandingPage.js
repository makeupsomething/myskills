import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class LandingPage extends Component {
    state = {
        topUsers: [],
        topSkills: []
    };

    componentDidMount = () => {
        this.getTopUsers();
        this.getTopSkills();
    }

    getTopUsers = () => {
        axios.get('/api/users/top').then(({ data }) => {
            data ? this.setState({topUsers: data.User}) : null
        });
    }

    getTopSkills = () => {
        axios.get('/api/skills/top').then(({ data }) => {
            data ? this.setState({topSkills: data.SkillType}) : null
        });
    }

    render() {
        const {newUsers, loggedIn} = this.props 

        return (
        <div>
            {loggedIn ? (null) : (<h2>Log in to view user profiles</h2>)}
            <h3>New Users</h3>
            <div className="container">
                <div className="row">
                    {newUsers ? newUsers.map(({ id, name, picture, email, time_created}) => {
                        return <div className="col s6 m4" key={id}>
                                <div className="card blue-grey darken-1">
                                    <div className="card-image">
                                        <img src={picture} alt={`${name}'s profile pic`} />
                                    </div>
                                    <p className="card-title blue-grey-text text-lighten-5">{name}</p>
                                    {loggedIn ? (<div className="card-content blue-grey-text text-lighten-5">
                                        <label>Email: </label><span>{email}</span>
                                        <br />
                                        <label>Joined: </label><span>{time_created}</span>
                                    </div>) : (null)}
                                    <div className="card-action">
                                    {loggedIn ? (<Link 
                                    to={`/profiles/${id}`} 
                                    className="waves-effect waves-light btn">
                                    Profile
                                    </Link>) : (<p>Log in to view</p>)} 
                                    </div>
                                </div>
                            </div>
                    }) : null}
                </div>
                <div className="row">
                <h3>Top Users</h3>
                    {this.state.topUsers ? this.state.topUsers.map(
                        ({ id, name, picture, email, time_created, total_endorsement_count}) => {
                        return <div className="col s6 m4" key={id}>
                                <div className="card blue-grey darken-1">
                                    <div className="card-image">
                                        <img src={picture} alt={`${name}'s profile pic`} />
                                    </div>
                                    <p className="card-title blue-grey-text text-lighten-5">{name}</p>
                                    <div className="card-content blue-grey-text text-lighten-5">
                                        <p>Total endorsements</p>
                                        <h1>{total_endorsement_count}</h1>
                                    </div>
                                    <div className="card-action">
                                    {loggedIn ? (<Link 
                                    to={`/profiles/${id}`} 
                                    className="waves-effect waves-light btn">
                                    Profile
                                    </Link>) : (<p>Log in to view</p>)}
                                    </div>
                                </div>
                            </div>
                    }) : null}
                </div>
                <div className="row">
                <h3>Top Skills</h3>
                    {this.state.topSkills ? this.state.topSkills.map(({ id, name, total_endorsement_count }) => {
                        return <div className="col s6 m4" key={id}>
                                <div className="card blue-grey darken-1">
                                    <p className="card-title blue-grey-text text-lighten-5">{name}</p>
                                    <div className="card-content blue-grey-text text-lighten-5">
                                        <h1>{total_endorsement_count}</h1>
                                    </div>
                                </div>
                            </div>
                    }) : null}
                </div>
            </div>
        </div>
        );
    }
}

export default LandingPage