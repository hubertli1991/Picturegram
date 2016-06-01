//React
var React = require('react');
var ReactDOM = require('react-dom');
//Router
var ReactRouter = require('react-router');
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
  render: function(){
    return (
        <div>
          <header><h1>Picturegram</h1></header>
          {this.props.children}
        </div>
    );
  }
});

var _Router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>

    </Route>
  </Router>
);

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(_Router, document.getElementById('content'));
});
