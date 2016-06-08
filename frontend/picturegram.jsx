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
var PostIndex = require('./components/PostIndex');
var PostForm = require('./components/PostForm');
var HomeIndex = require('./components/HomeIndex');
//Auth
var SessionStore = require('./stores/session_store');
var SessionApiUtil = require('./util/session_api_util');

// Modal Require Start
var Modal = require("react-modal");
var _Style = require("./modal_styles/modal_styles");
// Modal Require End


var App = React.createClass({

  // For Modal Purposes Start
  getInitialState: function(){
    return({ modalOpen: false });
  },
  closeModal: function(){
    this.setState({ modalOpen: false });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },
  // For Modal Purposes End

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
    }
  },

  render: function(){
    if (!SessionStore.isUserLoggedIn()) {
      return (
        <div>
          <LoginForm/>
          {this.props.children}
        </div>
          );
    } else {
      return (
        <div>
          <header>
            { this.greeting() }
          </header>
          <HomeIndex/>
          {this.props.children}
        </div>
      );
    }
  }
});
// <IndexRoute component={LoginForm} />

var _Router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/users/:id" component={ PostIndex } onEnter={ _ensureLoggedIn }/>
  </Router>
);

function _ensureLoggedIn(nextState, replace, asyncDoneCallback) {
  if (SessionStore.currentUserHasBeenFetched()) {
    redirectIfNotLoggedIn();
  } else {
    SessionApiUtil.fetchCurrentUser(redirectIfNotLoggedIn);
  }

  function redirectIfNotLoggedIn() {
    if (!SessionStore.isUserLoggedIn()) {
      replace('/');
    }
    asyncDoneCallback();
  }
}

// <Route path="post/:postid" component={ PostDetail }/>
// <Route path="login" component={ LoginForm } />
// <Route path="signup" component={ LoginForm } />

document.addEventListener('DOMContentLoaded', function() {
  Modal.setAppElement(document.body); // Add this line for Modal
  ReactDOM.render(_Router, document.getElementById('content'));
});
