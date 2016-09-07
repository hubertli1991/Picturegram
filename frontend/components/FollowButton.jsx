var React = require('react');
var Router = require('react-router').Router;

var FollowStore = require('../stores/follow_store');
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
    }
  },

  componentDidMount: function() {
    this.FollowStoreListener = FollowStore.addListener(this._onChange);
    ClientActions.fetchFollow( this.state.userId );
  },

  componentWillUnmount: function() {
    this.FollowStoreListener.remove();
  },

  _onChange: function() {
    var currentlyFollowing = FollowStore.fetchFollowStatus( this.state.userId );
    this.setState({ currentlyFollowing: currentlyFollowing });
  },

  componentWillReceiveProps: function(newProp) {
    this.state.userId = newProp.userId;
    ClientActions.fetchFollow( this.state.userId );
  },

  handleClick: function() {
    ClientActions.toggleFollow( this.state.userId );
  },

  style: function() {
    if ( this.state.currentlyFollowing ) {
      return {color: "#ffffff", backgroundColor: "#70c050"};
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
