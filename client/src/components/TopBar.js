import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import axios from 'axios';

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: null,
        };

        this.responseGoogle = this.responseGoogle.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    getCurrentUser() {
        const {setLoggedIn} = this.props
        axios.get('/api/current_user').then(response => {
            if(response.data) {
                this.setState({
                    user: response.data.User[0]
                });
                setLoggedIn(true);
            } 
        });
    }

    responseGoogle(response) {
        const {getNewUsers} = this.props
        axios.post('/gconnect', {data: response.code}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(() => {
            this.getCurrentUser();
            getNewUsers();
        });
    }

    logout(response) {
        const {setLoggedIn} = this.props
        axios.post('/gdisconnect').then(() => {
            setLoggedIn(false);
            window.location.replace("/");
        });
    }

    renderContent() {
        switch (this.state.user) {
            case null:
                return (
                    <GoogleLogin
                        className="waves-effect waves-light btn"
                        clientId="250819328097-0fcd0h1cm44herthe9ok1am7o7iur29t.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        scope="openid email"
                        responseType="code"
                        ux_mode='redirect'
                        redirectUri=''
                    />
                );
            case undefined:
                return (
                    <GoogleLogin
                        className="waves-effect waves-light btn"
                        clientId="250819328097-0fcd0h1cm44herthe9ok1am7o7iur29t.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        scope="openid email"
                        responseType="code"
                        ux_mode='redirect'
                        redirectUri=''
                    />
                );
            default:
                return [
                    <div key="buttons">
                        <li key="2">
                            <Link 
                                to={`/profiles/${this.state.user.id}`} 
                                className="lwaves-effect waves-light btn">
                            My Profile
                            </Link>
                        </li>
                        <li key="1">
                            <GoogleLogout
                                className="waves-effect waves-light btn"
                                buttonText="Logout"
                                onLogoutSuccess={this.logout} 
                                tag="a"
                            />
                        </li>
                    </div>
                ];
        }
    }

    render() {
        return (
        <nav>
            <div className="nav-wrapper purple darken-4">
                <Link 
                    to={'/'} 
                    className="left brand-logo"
                >
                MySkills
                </Link>
                <ul className="right">
                    {this.renderContent()}
                </ul>
            </div>
        </nav>
        ); 
    }  
};

export default TopBar;