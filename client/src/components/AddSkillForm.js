import React, { Component } from 'react';
import axios from 'axios';

class AddSkillForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            skillSuggestions: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        if(event.target.value) {
            this.getSkillByName(event.target.value);
        }
    }

    handleSubmit(event) {
        const { userProfile, addASkill } = this.props;
        if(this.state.skillSuggestions.length === 0) {
            this.addASkillType(this.state.value);
        } else {
            var skillToAdd = this.state.skillSuggestions.filter(skill => {
                return skill.name === this.state.value;
            });
            addASkill(userProfile.id, skillToAdd[0].id);
        }
        this.setState({value: ''});
        this.setState({skillSuggestions: []});
        event.preventDefault();
    }

    addASkillType(skill_name) {
        const { userProfile, addASkill } = this.props;
        var bodyFormData = new FormData();
        bodyFormData.set('skill_name', skill_name);
        axios({
            method: 'post',
            url: `/api/skills`,
            data: bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(response => {
            if(response.data) {
                addASkill(userProfile.id, response.data.SkillType[0].id);
            }
        });
    }

    getSkillByName(skill_name) {
        axios.get(`/api/skills/${skill_name}`).then(response => {
            this.setState({skillSuggestions: response.data.SkillType});
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
                                    {this.state.skillSuggestions.map(skill => {
                                        return <option id={skill.id} name={skill.id} value={skill.name} key={skill.id}>{skill.name}</option>
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