import React, { Component } from 'react';
import axios from 'axios';
import Skill from './Skill';
import AddSkillForm from './AddSkillForm';
import Materialize from 'materialize-css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            currentUser: null,
            userSkills: [],
        };

        this.addASkill = this.addASkill.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.getUserSkills = this.getUserSkills.bind(this);
    }

    componentDidMount() {
        const {match} = this.props   
        this.getCurrentUser();
        this.getUserProfile(match.params.user_id); 
    }

    componentWillReceiveProps(nextProps) {
        const {match} = this.props
        if(match.params.user_id !== nextProps.match.params.user_id) {
            this.getCurrentUser();
            this.getUserProfile(nextProps.match.params.user_id);  
        }
    }

    getCurrentUser() {
        axios.get('/api/current_user').then(response => {
            if(response.data) {
                this.setState({
                    currentUser: response.data.User[0]
                });
            } 
        });
    }

    addASkill(user_id, skill_id) {
        var skillToAdd = this.state.userSkills.filter(skill => {
            return skill.skill_id === skill_id;
        });
        if(skillToAdd.length > 0) {
            Materialize.toast('User already has the skill!', 3000)
        } else {
            var bodyFormData = new FormData();
            bodyFormData.set('skill_id', skill_id);
            bodyFormData.set('by_user_id', this.state.currentUser.id);
            axios({
                method: 'post',
                url: `/api/users/${user_id}/skills`,
                data: bodyFormData,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
            }).then(response => {
                this.getUserSkills(this.state.userProfile.id);
            });
        }
    }

    getUserProfile(user_id) {
        axios.get(`/api/users/${user_id}`).then(response => {
            if(response.data) {
                this.setState({
                    userProfile: response.data.User[0]
                });
            } 
        }).then(() => {
            this.getUserSkills(this.state.userProfile.id);
        });
    }

    getUserSkills(user_id) {
        if(this.state.userProfile) {
            axios.get(`/api/users/${user_id}/skills`).then(response => {
                this.setState({
                    userSkills: response.data.Skill
                });
            });
        }
    }

    render() {
        return (
        <div className="container">
            <h1>
                {this.state.userProfile ? this.state.userProfile.email : null}
            </h1>
            <div className="row">
            {this.state.userSkills ? this.state.userSkills.map(skill => {
                return <Skill key={skill.id} getUserSkills={this.getUserSkills} skill={skill} currentUser={this.state.currentUser} userProfile={this.state.userProfile}/>
            }) : null}
            <AddSkillForm currentUser={this.state.currentUser} userProfile={this.state.userProfile} addASkill={this.addASkill} />
            </div>
        </div>
        );
    }
}

export default Profile