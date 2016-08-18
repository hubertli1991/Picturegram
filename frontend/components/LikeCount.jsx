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
