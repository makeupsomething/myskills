import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import UserSkillDetails from './components/UserSkillDetails';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			userSkills: [],
			value: '',
			skillSuggestions: [],
			newUsers: [],
			loggedIn: false
		};

		this.getCurrentUser = this.getCurrentUser.bind(this);
		this.getNewUsers = this.getNewUsers.bind(this);
		this.setLoggedIn = this.setLoggedIn.bind(this);
	}
  
	componentDidMount() {
		this.getCurrentUser();
		this.getNewUsers();
	}

  	getCurrentUser() {
		axios.get('/api/current_user').then(response => {
			if(response.data) {
				this.setState({
					user: response.data.User[0]
				});
				this.setState({
					loggedIn: true
				});
			}
		});
	}

  	getNewUsers() {
    	axios.get('/api/users/new').then(response => {
        	if(response.data) {
				this.setState({
					newUsers: response.data.User
				});
        	}
    	});
  	}	

  	setLoggedIn(loggedIn) {
    	this.setState({
      		loggedIn
    	});
  	}

  	MyLandingPage = (props) => {
		return (
      		<LandingPage 
        		newUsers={this.state.newUsers}
        		loggedIn={this.state.loggedIn}
        		{...props}
      		/>
    	);
  	}

  	render() {
    	return (
      		<div className="App">
      			<BrowserRouter>
        			<div>
          				<TopBar getNewUsers={this.getNewUsers} setLoggedIn={this.setLoggedIn} />
          				<Route exact path="/" component={this.MyLandingPage}/>
          				<Route exact path="/profiles/:user_id/skills/:skill_id" component={UserSkillDetails} />
          				<Route exact path="/profiles/:user_id" component={Profile} />
        			</div>
      			</BrowserRouter>
      		</div>
    	);
  	}
}

export default App;
