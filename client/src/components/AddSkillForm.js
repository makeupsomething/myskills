import React, { Component } from 'react';
import axios from 'axios';

class AddSkillForm extends Component {
    state = {
        value: '',
        skillSuggestions: [],
    };

    handleChange = (event) => {
        this.setState({value: event.target.value});
        event.target.value ? (this.getSkillByName(event.target.value)) : (null)
    }

    handleSubmit = (event) => {
        const { userProfile, addASkill } = this.props;
        const { skillSuggestions, value } = this.state;
        if(skillSuggestions.length === 0) {
            this.addASkillType(value);
        } else {
            var skillToAdd = skillSuggestions.filter(skill => skill.name === value)
            addASkill(userProfile.id, skillToAdd[0].id);
        }
        this.setState({
            value: '', 
            skillSuggestions: []
        });
        event.preventDefault();
    }

    addASkillType = (skill_name) => {
        const { userProfile, addASkill } = this.props;
        let bodyFormData = new FormData();
        bodyFormData.set('skill_name', skill_name);
        axios({
            method: 'post',
            url: `/api/skills`,
            data: bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(({ data }) => {
            data ? addASkill(userProfile.id, data.SkillType[0].id) : null
        });
    }

    getSkillByName = (skill_name) => {
        axios.get(`/api/skills/${skill_name}`).then(({ data }) => {
            this.setState({skillSuggestions: data.SkillType});
        });
    }

    render() {
        return (
        <div>
            <div className="col s6 m4">
                <div className="card teal lighten-1">
                    <div className="card-content white-text">
                        <span className="card-title">Add Skill</span>
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input list="skills" id="skill" name="skill" placeholder="Skill Name" value={this.state.value} onChange={this.handleChange}/>
                                    <datalist id="skills">
                                    {this.state.skillSuggestions.map(({ id, name}) => {
                                        return <option id={id} name={id} value={name} key={id}>{name}</option>
                                    })}
                                    </datalist>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-action">
                        {this.state.value ?(<button onClick={this.handleSubmit} className="waves-effect waves-light amber darken-3 btn">
                        <i className="material-icons left">add</i>ADD SKILL</button>) : (null)}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default AddSkillForm