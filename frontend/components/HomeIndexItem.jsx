var React = require('react');
var Router = require('react-router').Router;

var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");
var Picture = require("./Picture");

var PostStore = require("../stores/post_store");
var LikeStore = require("../stores/like_store");
var SessionStore = require("../stores/session_store");
var ErrorStore = require("../stores/error_store");

var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');
var UpdateCaptionForm = require('./UpdateCaptionForm');
var FollowButton = require('./FollowButton');

var Helpers = require('../helpers/helpers');

var HomeIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { post: this.props.post, timeSincePosted: this.props.timeSincePosted, editFormOpen: false };
  },

  componentDidMount: function() {
    this.postStoreListener = PostStore.addListener(this._onChange);
  },

  componentWillUnmount: function() {
    this.postStoreListener.remove();
  },

  _onChange: function() {
    if ( this.state.editFormOpen ) {
      this.closeEditForm();
    }
  },

  // when a comment is submitted, the Post Store changes and HomeIndex will update its post objects
  // a newPost will be passed to update the comments
  componentWillReceiveProps: function(newProps) {
    this.setState({ post: newProps.post });
  },

  handleClick: function(id, type) {
    if ( this.state.editFormOpen ) {
      this.closeEditForm();
    }

    if ( type === "user" ) {
      this.context.router.push( "/users/" + id );
    } else if ( type === "hashtag" ) {
      this.context.router.push( "/hashtags/" + id );
    }
  },

  renderCaption: function() {
    hashtagsArray = Helpers.parseHashtags(this.state.post.caption, this.state.post.hashtags);

    if ( hashtagsArray.length ) {
      var caption = this.state.post.caption;
      var idx = 0;
      var final = [];
      for (var i = 0; i < hashtagsArray.length; i++) {
        final[idx] = caption.slice(idx, hashtagsArray[i][1]);
        final[hashtagsArray[i][1]] = <div className="hashtag" key={i} onClick={this.handleClick.bind(null, hashtagsArray[i][2], "hashtag")}>{hashtagsArray[i][0]}</div>;
        idx = hashtagsArray[i][1] + hashtagsArray[i][0].length;
      }
      final[idx] = caption.slice(idx, caption.length);
      return <div className="caption-text">{final}</div>;
    } else {
      return <div className="caption-text">{this.state.post.caption}</div>;
    }
  },

  renderEditButton: function() {
    if ( SessionStore.currentUser().id === this.state.post.user_id ) {
      return <div className="edit-caption-home" onClick={this.openEditForm}> Edit Caption </div>;
    }
  },

  openEditForm: function() {
    document.addEventListener("click", this.closeEditForm);
    this.setState({editFormOpen: true});
  },

  closeEditForm: function(e) {
    if ( e === undefined || (e.target.className !== "post-edit-form-home" && e.target.className !== "post-edit-form-text-home") ) {
      document.removeEventListener("click", this.closeEditForm);
      ErrorStore.clearErrors();
      this.setState({editFormOpen: false});
    }
  },

  renderEditForm: function() {
    if ( this.state.editFormOpen ) {
      return (
        <UpdateCaptionForm postId={this.state.post.id} hashtags={this.state.post.hashtags} caption={this.state.post.caption} location="home" />
      );
    }
  },

  renderFollowButton: function() {
    if ( this.state.post.user_id !== SessionStore.currentUser().id ) {
      return <FollowButton userId={this.state.post.user_id} location="home"/>;
    }
  },

  render: function() {
    return (
      <div className="home-index-item">

        <div className="post-header-home">
          <img className="thumbnail-home" src={this.state.post.thumbnail} onClick={this.handleClick.bind(null, this.state.post.user_id, "user")}/>
          <p className="thumb-username-home" onClick={this.handleClick.bind(null, this.state.post.user_id, "user")}> {this.state.post.username} </p>
          {this.renderFollowButton()}
      </div>

        <Picture imageUrl={this.state.post.image_url_large} postId={this.state.post.id} location="home-index-item"/>

        {this.renderEditForm()}

        <LikeCount postId={this.state.post.id} location={"home"}/>
        <div className="time-since-home"> {this.state.timeSincePosted} </div>

        {this.renderEditButton()}

        <div className="caption-and-comments-home" >
          <div className="caption">
            <div> <p className="username-home" onClick={ this.handleClick.bind(null, this.state.post.user_id, "user") }> {this.state.post.username} </p>
              {this.renderCaption()} </div>
          </div>

          <ul className="comment-list-home">
            {this.state.post.comments.map( function(comment, idex){
              return ( <li className="comment" key={idex}>
                        <p> <a className="username-home" onClick={this.handleClick.bind(null, comment.user_id, "user")}> {comment.username} </a>
                        {comment.body} </p>
                      </li> );
            }.bind(this))}
          </ul>
        </div>

        <LikeButton postId={this.state.post.id} caption={this.state.post.caption} location={"home"}/>

        <div className="comment-form-home">
          <CommentForm postId={this.state.post.id} location={"home"}/>
        </div>
      </div>
    );
  }
});

module.exports = HomeIndexItem;
