import os
from flask import (
    Flask,
    render_template,
    request, redirect,
    jsonify,
    url_for,
    flash,
    send_from_directory
)
from sqlalchemy import create_engine, asc, desc, func, and_, or_
from sqlalchemy.orm import sessionmaker
from setup_db import Base, Skill, SkillType, User, Endorsement
from flask import session as login_session
import random
import string
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
import httplib2
import json
from flask import make_response
import requests
from sets import Set

app = Flask(__name__, static_folder='client/build')

engine = create_engine('sqlite:///userandskills.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

CLIENT_ID = json.loads(
    open('client_secret.json', 'r').read())['web']['client_id']
APPLICATION_NAME = "Catalog App"

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory('client/build', 'index.html')
    else:
        if(os.path.exists("client/build/" + path)):
            return send_from_directory('client/build', path)
        else:
            return send_from_directory('client/build', 'index.html')

# If the user is not in the database then create an entry for them
def createUser(login_session):
    print "create user"
    newUser = User(name=login_session['username'], email=login_session[
                   'email'], picture=login_session['picture'])
    session.add(newUser)
    session.commit()
    user = session.query(User).filter_by(email=login_session['email']).one()
    return user.id


# Return the user data from the database
def getUserInfo(user_id):
    user = session.query(User).filter_by(id=user_id).one()
    return user


# Return the user id from the databse based on their email address
def getUserID(email):
    try:
        user = session.query(User).filter_by(email=email).one()
        return user.id
    except:
        return None


def checkIfEndorsed(for_id, by_id, skill_id):
    try:
        endorsements = session.query(Endorsement).filter_by(
            user_id=for_id).filter_by(
            endorsed_by_id=by_id).filter_by(skill_id=skill_id).all()
        return endorsements
    except:
        return None

@app.route('/gconnect', methods=['POST'])
def gconnect():
    """
    Logs a user in
    1. Obtain authorization code from the request and exchange it for a
    credentials object.
    2. Verify that the credentials access token is a valid access token.
    3. Verify that the credentials access token is valid for
    the user and for the app.
    4. If they are valid we set the credenitals access token
    as our login session.
    5. We check to see if the user is already logged in or not.
    6. If they are not, we get the users username,
    picture and email and save itinto our login session.
    """
    content = request.get_json(silent=True)

    # Obtain authorization code
    code = content.get('data')

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secret.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps('Failed to upgrade the authorization code.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps("Token's user ID doesn't match given user ID."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps("Token's client ID does not match app's."), 401)
        print("Token's client ID does not match app's.")
        response.headers['Content-Type'] = 'application/json'
        return response

    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        response = make_response(json.dumps('User is already connected.'),
                                 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later use.
    login_session['access_token'] = credentials.access_token
    login_session['gplus_id'] = gplus_id

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    login_session['username'] = data['name']
    login_session['picture'] = data['picture']
    login_session['email'] = data['email']

    user_id = getUserID(login_session['email'])
    if not user_id:
        login_session['user_id'] = createUser(login_session)
    else:
        login_session['user_id'] = user_id
    output = ''
    output += '<h1>Welcome, '
    output += login_session['username']
    output += '!</h1>'
    output += '<img src="'
    output += login_session['picture']
    output += ' " style = "width: 300px; height: 300px;border-radius: \
    150px;-webkit-border-radius: 150px;-moz-border-radius: 150px;"> '
    flash("you are now logged in as %s" % login_session['username'])
    print ("done!")
    return output

@app.route('/gdisconnect', methods=['GET', 'POST'])
def gdisconnect():
    """
    Logs a user out
    If there is an access token in the login session,
    send a request to revoke it and delete the users
    data from the login session.
    If there is no access token in the login session
    then abort
    """
    access_token = login_session.get('access_token')
    if access_token is None:
        print('Access Token is None')
        response = make_response(json.dumps('User not connected.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    print('In gdisconnect access token is %s', access_token)
    print('User name is: ')
    print(login_session['username'])
    revoke = requests.post('https://accounts.google.com/o/oauth2/revoke',
                           params={'token': login_session.get('access_token')},
                           headers={'content-type':
                                    'application/x-www-form-urlencoded'})

    status_code = getattr(revoke, 'status_code')
    if status_code == 200:
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        response = make_response(json.dumps('Successfully disconnected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        response = make_response(json.dumps('Failed to revoke token.', 400))
        response.headers['Content-Type'] = 'application/json'
        return response

@app.route('/api/users')
def usersJSON():
    users = session.query(User).all()
    return jsonify(User=[u.serialize for u in users])

@app.route('/api/users/new')
def newUsersJSON():
    users = session.query(User).order_by(desc(User.time_created)).limit(3).all()
    return jsonify(User=[u.serialize for u in users])

@app.route('/api/users/top')
def topUsersJSON():
    users = session.query(User).order_by(desc(User.total_endorsement_count)).limit(3).all()
    return jsonify(User=[u.serialize for u in users])

@app.route('/api/skills/top')
def topSkillsJSON():
    skills = session.query(SkillType).order_by(desc(SkillType.total_endorsement_count)).limit(3).all()
    return jsonify(SkillType=[s.serialize for s in skills])

@app.route('/api/users/<int:user_id>')
def oneUserJSON(user_id):
    user = session.query(User).filter_by(
        id=user_id).all()
    return jsonify(User=[u.serialize for u in user])

@app.route('/api/users/<int:user_id>/skills', methods=['GET', 'POST'])
def userSkillsJSON(user_id):
    if request.method == 'POST':
        newSkill = Skill(
            user_id=user_id,
            skill_id=request.form['skill_id'])
        session.add(newSkill)
        session.commit()
        newEndorsement = Endorsement(
            user_id=user_id,
            skill_id=request.form['skill_id'],
            endorsed_by_id=request.form['by_user_id'])
        session.add(newEndorsement)
        session.commit()
        skills = session.query(Skill).filter(Skill.user_id == user_id).all()
        return jsonify(Skill=[(row.serialize) for row in skills])
    else:
        skills = session.query(Skill).filter(Skill.user_id == user_id).order_by(desc(Skill.endorsement_count)).all()
        return jsonify(Skill=[(row.serialize) for row in skills])

@app.route('/api/users/<int:user_id>/skills/<int:skill_id>/endorsements', methods=['GET', 'POST'])
def userSkillEndorsementsJSON(user_id, skill_id):
    if request.method == 'POST':
        newEndorsement = Endorsement(
            user_id=user_id,
            skill_id=skill_id,
            endorsed_by_id=request.form['by_user_id'])
        session.add(newEndorsement)
        session.commit()
        endorsements = session.query(Endorsement).filter_by(
            user_id=user_id).filter_by(skill_id=skill_id).all()
        return jsonify(Endorsement=[e.serialize for e in endorsements])
    else:
        endorsements = session.query(Endorsement).filter_by(
            user_id=user_id).filter_by(skill_id=skill_id).all()
        return jsonify(Endorsement=[e.serialize for e in endorsements])

@app.route('/api/skills', methods=['GET', 'POST'])
def skillsJSON():
    if request.method == 'POST':
        newSkill = SkillType(
            name=request.form['skill_name'])
        session.add(newSkill)
        session.commit()
        skill = session.query(SkillType).filter(SkillType.name.like("%"+request.form['skill_name']+"%")).all()
        return jsonify(SkillType=[s.serialize for s in skill])
    else:
        skills = session.query(SkillType).all()
        return jsonify(SkillType=[s.serialize for s in skills])

@app.route('/api/skills/<string:skill_name>')
def getSkillByName(skill_name):
    skill = session.query(SkillType).filter(SkillType.name.like("%"+skill_name+"%")).all()
    return jsonify(SkillType=[s.serialize for s in skill])

@app.route('/api/skills/<int:skill_id>')
def getSkillByID(skill_id):
    skills = session.query(SkillType).filter_by(
        id=skill_id).all()
    return jsonify(SkillType=[s.serialize for s in skills])

@app.route('/api/current_user')
def getCurrentUser():
    if 'username' not in login_session:
        return ('', 204)
    else:
        user_id = getUserID(login_session['email'])
        user = session.query(User).filter_by(id=user_id).all()
        return jsonify(User=[u.serialize for u in user])

if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=8000)