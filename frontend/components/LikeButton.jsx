var React = require('react');
var Router = require('react-router').Router;

var LikeStore = require('../stores/like_store');
var ClientActions = require('../actions/client_actions');

var LikeButton = React.createClass({
  getInitialState: function() {
    var className = this.className().permissionGranted;
    return { postId: this.props.postId, caption: this.props.caption, permissionToLike: true,
      className: className };
  },

  className: function() {
    if ( this.props.location === "home" ) {
      return {
        container: "like-button-container-home",
        permissionGranted: "like-button-like",
        permissionDenied: "like-button-unlike"
      };
    }
    return {
      container: "like-button-container",
      permissionGranted: "like-button-like",
      permissionDenied: "like-button-unlike"
    };
  },

  componentDidMount: function() {
    this.likeListener = LikeStore.addListener(this._onChange);
    // if ( this.state.postId === 114 ) {
    //   debugger;
    // }
    // console.log(this.state.postId);
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
    // if ( likeObject === undefined ) {
    //   debugger;
    // }
    // debugger;
    // var className = "like-button-unlike";
    if ( likeObject && (likeObject.permissionToLike !== this.state.permissionToLike) ) {
      // className = "like-button-like";
      var className = this.likeButtonClassName( likeObject.permissionToLike );
      this.setState({ permissionToLike: likeObject.permissionToLike, className: className });
    }
  },

  likeButtonClassName: function(status) {
    if ( status ) {
      return this.className().permissionGranted;
    }
    return this.className().permissionDenied;
  },

  like: function() {
    ClientActions.like(this.state.postId);
    this.setState({className: this.className().permissionDenied});
  },

  unlike: function() {
    ClientActions.unlike(this.state.postId);
    this.setState({className: this.className().permissionGranted});
  },

  handleClick: function() {
    if ( this.state.permissionToLike ) {
      this.like();
    } else {
      this.unlike();
    }
  },

  render: function() {

    return(
      <div className={this.className().container}><div className={this.state.className} onClick={this.handleClick}></div></div>
    );
  }
});

module.exports = LikeButton;
