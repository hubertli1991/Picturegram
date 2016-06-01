//React
var React = require('react');
var ReactDOM = require('react-dom');
//Router
var ReactRouter = require('react-router');
var Link = require('react-router').Link;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;
//Components
var LoginForm = require('./components/LoginForm');
//Auth
var SessionStore = require('./stores/session_store');
var SessionApiUtil = require('./util/session_api_util');

var App = React.createClass({

  componentDidMount: function () {
    SessionStore.addListener(this.forceUpdate.bind(this));
    SessionApiUtil.fetchCurrentUser();
  },

  greeting: function(){

    if (SessionStore.isUserLoggedIn()) {
    	return (
    		<hgroup>
    			<h2>Hi, {SessionStore.currentUser().username}</h2>
    			<input type="submit" value="logout" onClick={ SessionApiUtil.logout } />
    		</hgroup>
    	);
    } else if (["/login", "/signup"].indexOf(this.props.location.pathname) === -1) {
      return (
        <nav>
          <Link to="/login" activeClassName="current">Login</Link>
          <br></br>
          <Link to="/signup" activeClassName="current">Sign up!</Link>
        </nav>
      );
    }
  },

  render: function(){
    return (
        <div>
          <header>
            <h1>Picturegram</h1>
            { this.greeting() }
          </header>
          {this.props.children}
        </div>
    );
  }
});

var _Router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={ LoginForm } />
      <Route path="signup" component={ LoginForm } />
    </Route>
  </Router>
);

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(_Router, document.getElementById('content'));
});
