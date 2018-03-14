import React, { Component } from 'react';
import axios from 'axios';
import Skill from './Skill';
import AddSkillForm from './AddSkillForm';
import Materialize from 'materialize-css';

class Profile extends Component {
    state = {
        userProfile: null,
        currentUser: null,
        userSkills: [],
    };

    componentDidMount = () => {
        const {match} = this.props   
        this.getCurrentUser();
        this.getUserProfile(match.params.user_id); 
    }

    componentWillReceiveProps = (nextProps) => {
        const {match} = this.props
        if(match.params.user_id !== nextProps.match.params.user_id) {
            this.getCurrentUser();
            this.getUserProfile(nextProps.match.params.user_id);  
        }
    }

    getCurrentUser = () => {
        axios.get('/api/current_user').then(({ data }) => {
            data ? this.setState({currentUser: data.User[0]}) : null
        });
    }

    addASkill = (user_id, sid) => {
        const skillToAdd = this.state.userSkills.filter(({ skill_id }) => skill_id === sid);

        if(skillToAdd.length > 0) {
            Materialize.toast('User already has the skill!', 3000)
        } else {
            const bodyFormData = new FormData();
            const { currentUser, userProfile } = this.state;

            bodyFormData.set('skill_id', sid);
            bodyFormData.set('by_user_id', currentUser.id);
            axios({
                method: 'post',
                url: `/api/users/${user_id}/skills`,
                data: bodyFormData,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
            }).then(response => {
                this.getUserSkills(userProfile.id);
            });
        }
    }

    getUserProfile = (user_id) => {
        axios.get(`/api/users/${user_id}`).then(({ data }) => {
            data ? this.setState({userProfile: data.User[0]}) : null
        }).then(() => {
            this.getUserSkills(this.state.userProfile.id);
        });
    }

    getUserSkills = (user_id) => {
        if(this.state.userProfile) {
            axios.get(`/api/users/${user_id}/skills`).then(({ data }) => {
                this.setState({
                    userSkills: data.Skill
                });
            });
        }
    }

    render() {
        const {userProfile, currentUser, userSkills} = this.state;

        return (
        <div className="container">
            <h1>
                {userProfile ? userProfile.email : null}
            </h1>
            <div className="row">
            {userSkills ? userSkills.map(skill => {
                return <Skill key={skill.id} getUserSkills={this.getUserSkills} skill={skill} currentUser={this.state.currentUser} userProfile={userProfile}/>
            }) : null}
            <AddSkillForm currentUser={currentUser} userProfile={userProfile} addASkill={this.addASkill} />
            </div>
        </div>
        );
    }
}

export default Profile