var React = require('react');
var Router = require('react-router').Router;

var LikeStore = require('../stores/like_store');
var ClientActions = require('../actions/client_actions');

var LikeButton = React.createClass({
  getInitialState: function() {
    return { postId: this.props.postId, caption: this.props.caption, permissionToLike: true, className: "like-button-like" };
  },

  componentDidMount: function() {
    this.likeListener = LikeStore.addListener(this._onChange);
    ClientActions.fetchLikes(this.state.postId);
  },

  componentWillUnmount: function() {
    this.likeListener.remove();
  },

  componentWillReceiveProps: function(newProps) {
    // console.log(this.props);
    // console.log(newProps);
    // console.log(this.state);
    this.state.postId = newProps.postId;
    this.state.caption = newProps.caption;
    // console.log(this.state);
    // this._onChange();
    ClientActions.fetchLikes(this.state.postId);
  },

  _onChange: function() {
    var likeObject = LikeStore.fetchLikeObject(this.state.postId);
    var className = "like-button-unlike";
    if ( likeObject.permissionToLike ) {
      className = "like-button-like";
    }
    this.setState({ permissionToLike: likeObject.permissionToLike, className: className });
  },

  like: function() {
    ClientActions.like(this.state.postId);
    this.setState({className: "like-button-unlike"});
  },

  unlike: function() {
    ClientActions.unlike(this.state.postId);
    this.setState({className: "like-button-like"});
  },

  likeOrUnlike: function() {
    if ( this.state.permissionToLike ) {
      this.like();
    } else {
      this.unlike();
    }
  },

  render: function() {

    return(
      <div className="like-button-container"><div className={this.state.className} onClick={this.likeOrUnlike}></div></div>
    );
  }
});

module.exports = LikeButton;
