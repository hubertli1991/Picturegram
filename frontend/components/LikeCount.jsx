var React = require('react');
var Router = require('react-router').Router;

var LikeStore = require('../stores/like_store');
var ClientActions = require('../actions/client_actions');

var LikeCount = React.createClass({

  getInitialState: function() {
    var className = "like-count";
    if ( this.props.location === "home" ) {
      className = "like-count-home";
    } else if ( this.props.location === "index-page" ) {
      className = "like-count-index";
    }
    return({count: 0, className: className});
  },

  componentDidMount: function() {
    this.LikeStoreListener = LikeStore.addListener(this._onChange);
    ClientActions.fetchLikes(this.props.postId);
  },

  componentWillUnmount: function() {
    this.LikeStoreListener.remove();
  },

  // Don't need a componentWillReceiveProps because we have a listener attached to the LikeStore
  // LikeButton already triggered teh change that we would otherwise call for when props change
  // Think of LikeCount and LikeButton as the some component. We split them because I want to place
  // them under different parent tags.

  _onChange: function() {
    var likeObject = LikeStore.fetchLikeObject(this.props.postId);
    if ( likeObject ) {
      this.setState({count: likeObject.count});
    }
  },

  render: function() {
    var unit = "Likes";
    if ( this.state.count === 1 ) {
      unit = "Like";
    }
    if ( this.props.location === "index-page" ) {
      unit = null;
    }
    return <p className={this.state.className}>{this.state.count} {unit}</p>;
  }
});

module.exports = LikeCount;
