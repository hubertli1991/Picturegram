var React = require('react');
var Router = require('react-router').Router;

var ClientActions = require('../actions/client_actions');

var PostStore = require("../stores/post_store");
var SessionStore = require("../stores/session_store");

var PostIndexItem = require("./PostIndexItem");
var PostForm = require("./PostForm");

var NavBar = require('./NavBar');

var HashtagIndex = React.createClass({
  getInitialState: function() {
    return {hashtagId: this.props.params.id, posts: []};
  },

  componentDidMount: function() {
    this.postStoreListener = PostStore.addListener(this._onChange);
    ClientActions.fetchHashtagAndPosts(this.state.hashtagId);
  },

  componentWillUnmount: function() {
    this.postStoreListener.remove();
  },

  componentWillReceiveProps: function(newProp) {
    this.state.hashtagId = newProp.params.id;
    ClientActions.fetchHashtagAndPosts(this.state.hashtagId);
  },

  _onChange: function() {
    // debugger;
    this.setState({posts: PostStore.all()});
    // var hashtagId = parseInt(this.props.params.id);
    // if ( PostStore.PostDoesNotBelong(parseInt(this.state.hashtagId)).length ) {
    //   ClientActions.fetchHashtagAndPosts(this.state.hashtagId);
    // }
  },

  render: function() {
    var hashtag = PostStore.fetchHashtag();
    var postCount = hashtag.count;
    var currentPathLocation = this.props.location.pathname;
    // var hashtagPathId = ParseInt( this.state.hashtagId );

    var unit = " posts";
    if ( postCount === 1) {
      unit = " post";
    }

    return (
      <div>
        <NavBar/>
        <div className="hashtag-header">
          <div className="hashtag-title">{hashtag.hashtag}</div>
          <div className="hashtag-post-count-container"><div className="hashtag-post-count">{postCount}</div>{unit}</div>
        </div>

        <PostForm className="hashtag-post-form" userId={SessionStore.currentUser().id}/>

        <div className="spacing-below-post-form"/>

        <div className="user-picture-index group">
          <ul>
            {this.state.posts.map(function(post, idx) {
              return ( <div className="posted-picture" key={idx}>< PostIndexItem post={post} postNumber={idx} postCount={postCount} thumbnail={post.thumbnail} hashtagPathId={this.state.hashtagId}/></div>);
            }.bind(this))}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = HashtagIndex;
