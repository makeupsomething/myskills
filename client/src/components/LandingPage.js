import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topUsers: [],
            topSkills: []
        };

        this.getTopUsers = this.getTopUsers.bind(this);
        this.getTopSkills = this.getTopSkills.bind(this);
    }

    componentDidMount() {
        this.getTopUsers();
        this.getTopSkills();
    }

    getTopUsers() {
        axios.get('/api/users/top').then(response => {
            if(response.data) {
                this.setState({
                    topUsers: response.data.User
                });
            }
        });
    }

    getTopSkills() {
        axios.get('/api/skills/top').then(response => {
            if(response.data) {
                this.setState({
                    topSkills: response.data.SkillType
                });
            }
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
                    {newUsers ? newUsers.map(user => {
                        return <div className="col s6 m4" key={user.id}>
                                <div className="card blue-grey darken-1">
                                    <div className="card-image">
                                        <img src={user.picture} alt={`${user.name}'s profile pic`} />
                                    </div>
                                    <p className="card-title blue-grey-text text-lighten-5">{user.name}</p>
                                    {loggedIn ? (<div className="card-content blue-grey-text text-lighten-5">
                                        <label>Email: </label><span>{user.email}</span>
                                        <br />
                                        <label>Joined: </label><span>{user.time_created}</span>
                                    </div>) : (null)}
                                    <div className="card-action">
                                    {loggedIn ? (<Link 
                                    to={`/profiles/${user.id}`} 
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
                    {this.state.topUsers ? this.state.topUsers.map(user => {
                        return <div className="col s6 m4" key={user.id}>
                                <div className="card blue-grey darken-1">
                                    <div className="card-image">
                                        <img src={user.picture} alt={`${user.name}'s profile pic`} />
                                    </div>
                                    <p className="card-title blue-grey-text text-lighten-5">{user.name}</p>
                                    <div className="card-content blue-grey-text text-lighten-5">
                                        <p>Total endorsements</p>
                                        <h1>{user.total_endorsement_count}</h1>
                                    </div>
                                    <div className="card-action">
                                    {loggedIn ? (<Link 
                                    to={`/profiles/${user.id}`} 
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
                    {this.state.topSkills ? this.state.topSkills.map(skill => {
                        return <div className="col s6 m4" key={skill.id}>
                                <div className="card blue-grey darken-1">
                                    <p className="card-title blue-grey-text text-lighten-5">{skill.name}</p>
                                    <div className="card-content blue-grey-text text-lighten-5">
                                        <h1>{skill.total_endorsement_count}</h1>
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