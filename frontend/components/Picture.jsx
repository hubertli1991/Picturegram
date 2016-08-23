var React = require('react');
var Router = require('react-router').Router;

var LikeAnimation = require('./LikeAnimation');

var LikeStore = require('../stores/like_store');
var ClientActions = require('../actions/client_actions');

var Picture = React.createClass({

  getInitialState: function() {
    var className = this.className();
    return {
      imageUrl: this.props.imageUrl,
      postId: this.props.postId,
      containerClassName: className.container,
      pictureClassName: className.initial,
      animationType: "picture-underneath"
    };
  },

  componentDidMount: function() {
    this.likeStoreListener = LikeStore.addListener(this._onChange);
  },

  componentWillUnmount: function() {
    this.likeStoreListener.remove();
  },

  _onChange: function() {
    var likeObject = LikeStore.fetchLikeObject(this.state.postId);
    this.setState({ likeObject: likeObject });
  },

  componentWillReceiveProps: function(newProp) {
    this.setState( { imageUrl: newProp.imageUrl, postId: newProp.postId } );
  },

  className: function() {
    // Barely used this. refactor later
    if ( this.props.location === "home-index-item" ) {
      return {
        container: "home-picture-container",
        initial: "home-picture",
        likeAnimation: "like-animation",
        unlikeAnimcation: "unlike-animation"
      };
    } else if ( this.props.location === "post-index-item" ) {
      return {
        container: "picture-container",
        initial: "picture",
        likeAnimation: "like-animation",
        unlikeAnimcation: "unlike-animation"
      };
    }
  },

  handleClick: function() {
    if (this.state.inAnimation) { return; }
    // if animation is running, disable this function

    if ( this.state.likeObject.permissionToLike ) {
      this.like();
    } else {
      this.unlike();
    }
  },

  like: function() {
    this.state.animationType = "like-animation";

    this.state.inAnimation = true;
    setTimeout(function() {
      this.stripClass();
      this.state.inAnimation = false;
    }.bind(this), 2550);

    ClientActions.like(this.state.postId);
  },

  unlike: function() {
    this.state.animationType = "unlike-animation";

    this.state.inAnimation = true;
    setTimeout(function() {
      this.stripClass();
      this.state.inAnimation = false;
    }.bind(this), 2550);

    ClientActions.unlike(this.state.postId);
  },

  stripClass: function() {
    this.setState({animationType: "picture-underneath"});
  },

  render: function() {
    return (
      <div id={this.state.postId} className={this.state.containerClassName} onClick={this.handleClick}>
        <LikeAnimation animationType={this.state.animationType}/>
        <img className={this.state.pictureClassName} src={this.state.imageUrl}/>
      </div>
    );
  }
});

module.exports = Picture;
