var React = require('react');
var Router = require('react-router').Router;

var LikeStore = require('../stores/like_store');
var ClientActions = require('../actions/client_actions');

var LikeCount = React.createClass({

  getInitialState: function() {
    return({count: 0});
  },

  componentDidMount: function() {
    this.LikeStoreListener = LikeStore.addListener(this._onChange);
    // ClientActions.
    ClientActions.fetchLikes(this.props.postId);
  },

  componentWillUnmount: function() {
    this.LikeStoreListener.remove();
  },

  // Don't need a componentWillReceiveProps because we have alistener attached to the LikeStore
  // LikeButton already triggered teh change that we would otherwise call for when props change
  // Think of LikeCount and LikeButton as the some component. We split them because I want to place
  // them under different parent tags.

  _onChange: function() {
    var likeObject = LikeStore.fetchLikeObject(this.props.postId);
    this.setState({count: likeObject.count});
  },

  render: function() {
    var unit = "Likes";
    if ( this.state.count === 1 ) {
      unit = "Like";
    }
    return <p className="like-count">{this.state.count} {unit}</p>;
  }
});

module.exports = LikeCount;
