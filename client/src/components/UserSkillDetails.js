import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class UserSkillDetails extends Component {
    state = {
        currentSkill: null,
        usersWhoEndorsed: []
    };

    componentDidMount = () => {
        const {match} = this.props   
        this.getCurrentSkill(match.params.skill_id);
        this.getUserEndorsements(match.params.user_id, match.params.skill_id); 
    }

    componentWillReceiveProps = (nextProps) => {
        const {match} = this.props
        if(match.params.user_id !== nextProps.match.params.user_id || match.params.skill_id !== nextProps.match.params.skill_id) {
            this.getCurrentSkill(nextProps.match.params.skill_id);
            this.getUserEndorsements(nextProps.match.params.user_id, nextProps.match.params.skill_id);  
        }
    }

    getCurrentSkill = (skill_id) => {
        axios.get(`/api/skills/${skill_id}`).then(({ data }) => {
            this.setState({currentSkill: data.SkillType[0]});
        });
    }

    getUserEndorsements = (user_id, skill_id) => {
        axios.get(`/api/users/${user_id}/skills/${skill_id}/endorsements`).then(({ data }) => {
            data.Endorsement.forEach(({ endorsed_by_id }) => {
                this.getUserById(endorsed_by_id);
            });
        });
    }

    getUserById = (id) => {
        axios.get(`/api/users/${id}`).then(({ data }) => {
            this.setState({
                usersWhoEndorsed: [...this.state.usersWhoEndorsed, data.User[0]]
            });
        });
    }

    render() {
        const { currentSkill, usersWhoEndorsed} = this.state;
        return (
        <div>
            {currentSkill ? (
                <div className="row">
                <div className="col s6 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content blue-grey-text text-lighten-5">
                            <span className="card-title blue-grey-text text-lighten-5">{currentSkill.name}</span>
                            <h1>{usersWhoEndorsed.length}</h1>
                        </div>
                    </div>
                </div>
                <div className="col s6 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content blue-grey-text text-lighten-5">
                            <span className="card-title blue-grey-text text-lighten-5">In total this skill hs been endorsed</span>
                            <h1>{currentSkill.total_endorsement_count}times</h1>
                        </div>
                    </div>
                </div>
                </div>) : (null)}
                <h2>You were endored by these awesome people</h2>
                <ul className="row">
                {usersWhoEndorsed ? (usersWhoEndorsed.map(({ id, picture, name }) => {
                    return <li className="col s4" key={id}>
                    <div className="card horizontal blue-grey darken-1">
                        <div className="card-image blue-grey-text text-lighten-5">
                            <img src={picture} alt={`${name}'s profile pic`}/>
                        </div>
                        <div className="card-stacked">
                            <div className="card-content blue-grey-text text-lighten-5">
                                <p>{name}</p>
                            </div>
                            <div className="card-action">
                            <Link 
                                to={`/profiles/${id}`} 
                                className="waves-effect waves-light btn">
                                <span>PROFILE</span>
                            </Link>
                            </div>
                        </div>
                    </div>
                    </li>
                })) : (null)}
                </ul>
        </div>
        );
    }
}

export default UserSkillDetails