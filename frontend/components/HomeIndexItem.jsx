var React = require('react');
var Router = require('react-router').Router;

var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");
var Picture = require("./Picture");

var PostStore = require("../stores/post_store");
var LikeStore = require("../stores/like_store");

var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');

var Helpers = require('../helpers/helpers');

var HomeIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { post: this.props.post, timeSincePosted: this.props.timeSincePosted };
  },

  // when a comment is submitted, the Post Store changes and HomeIndex will update its post objects
  // a newPost will be passed to update the comments
  componentWillReceiveProps: function(newProps) {
    this.setState({ post: newProps.post });
  },

  handleClick: function(id) {
    this.context.router.push( "/users/" + id );
  },

  redirectToHashtag: function(hashtagId) {
    this.context.router.push( "/hashtags/" + hashtagId );
  },

  renderCaption: function() {
    hashtagsArray = Helpers.parseHashtags(this.state.post.caption, this.state.post.hashtags);

    if ( hashtagsArray.length ) {
      var caption = this.state.post.caption;
      var idx = 0;
      var final = [];
      for (var i = 0; i < hashtagsArray.length; i++) {
        final[idx] = caption.slice(idx, hashtagsArray[i][1]);
        final[hashtagsArray[i][1]] = <div className="hashtag" key={i} onClick={this.redirectToHashtag.bind(null, hashtagsArray[i][2])}>{hashtagsArray[i][0]}</div>;
        idx = hashtagsArray[i][1] + hashtagsArray[i][0].length;
      }
      final[idx] = caption.slice(idx, caption.length);
      return <div className="caption-text">{final}</div>;
    } else {
      return <div className="caption-text">{this.state.post.caption}</div>;
    }
  },

  render: function() {
    return (
      <div className="home-index-item">

        <div className="post-header-home">
          <img className="thumbnail-home" src={this.state.post.thumbnail} onClick={this.handleClick.bind(null, this.state.post.user_id)}/>
          <p className="thumb-username-home" onClick={this.handleClick.bind(null, this.state.post.user_id)}> {this.state.post.username} </p>
          <div className="time-since-home"> {this.state.timeSincePosted} </div>
        </div>

        <Picture imageUrl={this.state.post.image_url_large} postId={this.state.post.id} location="home-index-item"/>

        <LikeCount postId={this.state.post.id} location={"home"}/>

        <div className="caption-and-comments-home" >
          <div className="caption">
            <div> <p className="username-home" onClick={ this.handleClick.bind(null, this.state.post.user_id) }> {this.state.post.username} </p>
              {this.renderCaption()} </div>
          </div>

          <ul className="comment-list-home">
            {this.state.post.comments.map( function(comment, idex){
              return ( <li className="comment" key={idex}>
                        <p> <a className="username-home" onClick={this.handleClick.bind(null, comment.user_id)}> {comment.username} </a>
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
