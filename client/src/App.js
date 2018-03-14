import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import UserSkillDetails from './components/UserSkillDetails';

class App extends Component {
	state = {
		user: null,
		userSkills: [],
		value: '',
		skillSuggestions: [],
		newUsers: [],
		loggedIn: false
	};
  
	componentDidMount = () => {
		this.getCurrentUser();
		this.getNewUsers();
	}

  	getCurrentUser = () => {
		axios.get('/api/current_user').then(({ data }) => {
			data ? (this.setState({
				user: data.User[0],
				loggedIn: true
			})) : (null);
		});
	}

  	getNewUsers = () => {
    	axios.get('/api/users/new').then(({ data }) => {
        	data ? (this.setState({
				newUsers: data.User})) : (null);
		});
	}	

  	setLoggedIn = (loggedIn) => {
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
