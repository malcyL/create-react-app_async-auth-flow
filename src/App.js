import React, { Component } from 'react';
import './App.css';
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import Nav from './components/Nav.js'
import Dashboard from './components/Dashboard.js'
import About from './components/About.js'
import Landing from './components/Landing.js'
import Logout from './components/Logout.js'
import Login from './components/Login.js'
import User from './components/User.js'
import PageOne from './components/PageOne.js'
import PageTwo from './components/PageTwo.js'

import auth from './utils/auth.js'

class App extends Component {

  constructor() {
    super();
    this.renderLanding = this.renderLanding.bind(this);
    this.renderDashboard = this.renderDashboard.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }

  redirectToLogin(nextState, replace) {
    if (!auth.loggedIn()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }

  redirectToDashboard(nextState, replace) {
    if (auth.loggedIn()) {
      replace('/')
    }
  }

  renderLanding() {
    return (
      <Route path='/' component={Landing}>
        <IndexRoute component={PageOne}/>
        <Route path='/page2' component={PageTwo} onEnter={this.redirectToLogin}/>
      </Route>
    )
  }

  renderDashboard() {
    return (
      <Route path='/' component={Dashboard}>
        <IndexRoute component={PageOne}/>
        <Route path='/page2' component={PageTwo} onEnter={this.redirectToLogin}/>
      </Route>
    )
  }

  render() {
    let rootPath = auth.loggedIn() ? this.renderDashboard() : this.renderLanding();
    return (
      <Router history={browserHistory}>
        <Route component={Nav}>
          {rootPath}
          <Route path='/about' component={About}/>
          <Route path='/logout' component={Logout}/>
          <Route path='/login' component={Login} onEnter={this.redirectToDashboard} />
          <Route path='/user/:id' component={User} onEnter={this.redirectToLogin} />
        </Route>
      </Router>
    );
  }
}

export default App;
