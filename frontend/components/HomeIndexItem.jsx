var React = require('react');
var Router = require('react-router').Router;

var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");
var Picture = require("./Picture");

var PostStore = require("../stores/post_store");
var LikeStore = require("../stores/like_store");

var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');


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
              {this.state.post.caption} </div>
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
