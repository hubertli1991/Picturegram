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
var NavBar = require('./components/NavBar');
var HashtagIndex = require('./components/HashtagIndex');
//Auth
var SessionStore = require('./stores/session_store');
var SessionApiUtil = require('./util/session_api_util');

// Modal Require Start
var Modal = require("react-modal");
// Modal Require End


var App = React.createClass({

  componentDidMount: function () {
    this.sessionStoreListener = SessionStore.addListener(this.forceUpdate.bind(this));
    SessionApiUtil.fetchCurrentUser();
  },

  componentWillUnmount: function() {
    this.sessionStoreListener.remove();
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
          <NavBar/>
          <HomeIndex/>
          {this.props.children}
        </div>
      );
    }
  }
});

var _Router = (
  <Router history={hashHistory}>
    <Route path="/" component={App} />
    <Route path="/users/:id" component={ PostIndex } onEnter={ _ensureLoggedIn } />
    <Route path="/hashtags/:id" component={ HashtagIndex } onEnter={ _ensureLoggedIn } />
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

document.addEventListener('DOMContentLoaded', function() {
  Modal.setAppElement(document.body); // Add this line for Modal
  ReactDOM.render(_Router, document.getElementById('content'));
});
