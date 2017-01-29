# Create React App example of Auth Flow with Shared Root using React Router

The react-router example for Auth Flow with a Shared Root contains an
example in which react-router is configured using 'Plain Routes'.
The configuration file looks like this:

(see it [here](https://github.com/ReactTraining/react-router/blob/master/examples/auth-with-shared-root/config/routes.js)) 

```js
export default {
  component: require('../components/App'),
  childRoutes: [
    { path: '/logout',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Logout'))
        })
      }
    },
    { path: '/about',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/About'))
        })
      }
    },

    { onEnter: redirectToDashboard,
      childRoutes: [
        // Unauthenticated routes
        // Redirect to dashboard if user is already logged in
        { path: '/login',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Login'))
            })
          }
        }
        // ...
      ]
    },

    { onEnter: redirectToLogin,
      childRoutes: [
        // Protected routes that don't share the dashboard UI
        { path: '/user/:id',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/User'))
            })
          }
        }
        // ...
      ]
    },

    { path: '/',
      getComponent: (nextState, cb) => {
        // Share the path
        // Dynamically load the correct component
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
            cb(null, require('../components/Dashboard'))
          })
        }
        return require.ensure([], (require) => {
          cb(null, require('../components/Landing'))
        })
      },
      indexRoute: {
        getComponent: (nextState, cb) => {
          // Only load if we're logged in
          if (auth.loggedIn()) {
            return require.ensure([], (require) => {
              cb(null, require('../components/PageOne'))
            })
          }
          return cb()
        }
      },
      childRoutes: [
        { onEnter: redirectToLogin,
          childRoutes: [
            // Protected nested routes for the dashboard
            { path: '/page2',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/PageTwo'))
                })
              }
            }
            // ...
          ]
        }
      ]
    }

  ]
}
```

This example does two things:

1) It converts the 'Plain Routes' into more readable basic route configuration.

2) The example is contained in a project created using create-react-app.

The basic route configuration is much clearer:

```js
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

```
