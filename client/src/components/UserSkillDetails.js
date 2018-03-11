import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class UserSkillDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSkill: null,
            usersWhoEndorsed: []
        };

        this.getCurrentSkill = this.getCurrentSkill.bind(this);
        this.getUserEndorsements = this.getUserEndorsements.bind(this);
    }

    componentDidMount() {
        const {match} = this.props   
        this.getCurrentSkill(match.params.skill_id);
        this.getUserEndorsements(match.params.user_id, match.params.skill_id); 
    }

    componentWillReceiveProps(nextProps) {
        const {match} = this.props
        if(match.params.user_id !== nextProps.match.params.user_id || match.params.skill_id !== nextProps.match.params.skill_id) {
            this.getCurrentSkill(nextProps.match.params.skill_id);
            this.getUserEndorsements(nextProps.match.params.user_id, nextProps.match.params.skill_id);  
        }
    }

    getCurrentSkill(skill_id) {
        axios.get(`/api/skills/${skill_id}`).then(response => {
            this.setState({currentSkill: response.data.SkillType[0]});
        });
    }

    getUserEndorsements(user_id, skill_id) {
        axios.get(`/api/users/${user_id}/skills/${skill_id}/endorsements`).then(response => {
            response.data.Endorsement.forEach(endorsement => {
                this.getUserById(endorsement.endorsed_by_id);
            });
        });
    }

    getUserById(id) {
        axios.get(`/api/users/${id}`).then(response => {
            this.setState({
                usersWhoEndorsed: [...this.state.usersWhoEndorsed, response.data.User[0]]
            });
        });
    }

    render() {
        return (
        <div>
            {this.state.currentSkill ? (
                <div className="row">
                <div className="col s6 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content blue-grey-text text-lighten-5">
                            <span className="card-title blue-grey-text text-lighten-5">{this.state.currentSkill.name}</span>
                            <h1>{this.state.usersWhoEndorsed.length}</h1>
                        </div>
                    </div>
                </div>
                <div className="col s6 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content blue-grey-text text-lighten-5">
                            <span className="card-title blue-grey-text text-lighten-5">In total this skill hs been endorsed</span>
                            <h1>{this.state.currentSkill.total_endorsement_count}times</h1>
                        </div>
                    </div>
                </div>
                </div>) : (null)}
                <h2>You were endored by these awesome people</h2>
                <ul className="row">
                {this.state.usersWhoEndorsed ? (this.state.usersWhoEndorsed.map(user => {
                    return <li className="col s4" key={user.id}>
                    <div className="card horizontal blue-grey darken-1">
                        <div className="card-image blue-grey-text text-lighten-5">
                            <img src={user.picture} alt={`${user.name}'s profile pic`}/>
                        </div>
                        <div className="card-stacked">
                            <div className="card-content blue-grey-text text-lighten-5">
                                <p>{user.name}</p>
                            </div>
                            <div className="card-action">
                            <Link 
                                to={`/profiles/${user.id}`} 
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