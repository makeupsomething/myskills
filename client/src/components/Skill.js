import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Skill extends Component {
    state = {
        can_endorse: true,
      };

    componentDidMount = () => {
        this.getEndorsements();
    }

    endorseSkill = (for_user_id, by_user_id, skill_id) => {
        const { getUserSkills } = this.props;
        const bodyFormData = new FormData();
        bodyFormData.set('by_user_id', by_user_id);
        axios({
            method: 'post',
            url: `/api/users/${for_user_id}/skills/${skill_id}/endorsements`,
            data: bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(({ data }) => {
            this.checkCanEndorse(data.Endorsement);
            getUserSkills(for_user_id);
        });
    }

    getEndorsements = () => {
        const { skill, userProfile } = this.props;
        axios.get(`/api/users/${userProfile.id}/skills/${skill.skill_id}/endorsements`).then(({ data }) => {
            this.checkCanEndorse(data.Endorsement);
        });
    }

    checkCanEndorse = (endorsementList) => {
        const { currentUser } = this.props;
        const result = endorsementList.find( endorsement => endorsement.endorsed_by_id === currentUser.id );
        this.setState({can_endorse: result});
    }

    render() {
        const { skill, currentUser, userProfile } = this.props;
        return (
        <div>
            <div className="col s6 m4">
                <div className="card blue-grey darken-1">
                    <div className="card-content blue-grey-text text-lighten-5">
                        <span className="card-title blue-grey-text text-lighten-5">{skill.skill_name}</span>
                        <h1>{skill.endorsement_count}</h1>
                    </div>
                    <div className="card-action">
                        <div className="row">                        
                            {userProfile.id !== currentUser.id && !this.state.can_endorse ? (
                            <a className="waves-effect waves-light btn col s6" onClick={() => this.endorseSkill(userProfile.id, currentUser.id, skill.skill_id)}>
                            LIKE</a>) 
                            : (<a className="waves-effect waves-light disabled btn col s6">
                            LIKED</a>)}
                            <Link 
                                to={`/profiles/${userProfile.id}/skills/${skill.skill_id}`} 
                                className="waves-effect waves-light amber darken-3 btn col s6">
                                DETAILS
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Skill