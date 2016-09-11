var React = require('react');
var Router = require('react-router').Router;

var FollowStore = require('../stores/follow_store');
var SessionStore = require('../stores/session_store');
var ClientActions = require('../actions/client_actions');

var FollowButton = React.createClass({
  getInitialState: function() {
    return( { userId: this.props.userId, currentlyFollowing: false, location: this.props.location } );
  },

  className: function(location) {
    if ( location === "index" ) {
      return "follow-button-index";
    } else if ( location === "home" ) {
      return "follow-button-home";
    }  else if ( location === "index-item" ) {
      return "follow-button-index-item";
    } else if ( location === "follow-index-item" ) {
      return "follow-button-follow-index-item";
    }
  },

  componentDidMount: function() {
    this.followStoreListener = FollowStore.addListener(this._onChange);
    ClientActions.fetchFollow( this.state.userId, SessionStore.currentUser().id );
  },

  componentWillUnmount: function() {
    this.followStoreListener.remove();
  },

  _onChange: function() {
    var currentlyFollowing = FollowStore.fetchFollowStatus( this.state.userId, SessionStore.currentUser().id );
    this.setState({ currentlyFollowing: currentlyFollowing });
  },

  componentWillReceiveProps: function(newProp) {
    this.state.userId = newProp.userId;
    this.state.location = newProp.location;
    ClientActions.fetchFollow( this.state.userId, SessionStore.currentUser().id );
  },

  handleClick: function() {
    ClientActions.toggleFollow( this.state.userId, SessionStore.currentUser().id );
  },

  style: function() {
    if ( this.state.currentlyFollowing ) {
      return {color: "#ffffff", backgroundColor: "#70c050", borderColor: "#70c050"};
    } else {
      return {};
    }
  },

  render: function() {
    var text = "Follow";
    if ( this.state.currentlyFollowing ) {
      text = "Following";
    }
    return <div className={this.className(this.state.location)} onClick={this.handleClick} style={this.style()}> {text} </div>;
  }
});

module.exports = FollowButton;
