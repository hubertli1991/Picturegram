var React = require('react');
var Router = require('react-router').Router;
var PostStore = require("../stores/post_store");
var PostIndexItem = require('./PostIndexItem');
var HomeIndexItem = require('./HomeIndexItem');
var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");
var NavBar = require('./NavBar');
var PostForm = require('./PostForm');
var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');
var LikeStore = require('../stores/like_store');
var SessionStore = require('../stores/session_store');

var HomeIndex = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { posts: [] };
  },

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    // infinte scroll -start
    // this.infiniteScrollCallback = function(e) {
    //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //     console.log("test");
          // ClientActions.fetchSomePosts(5);
    //   }
    // }.bind(this);
    // window.addEventListener("scroll", this.infiniteScrollCallback);
    // infinte scroll -end
    ClientActions.fetchAllPosts();
  },

  _onChange: function() {
    if ( this.state.posts.length === 0 ) {
      this.setState( { posts: PostStore.fetchFive(0) } );
    } else {
      var updatedPost = PostStore.fetchMostUpdatedPost();
      var idx = null;
      for (var i = 0; i < this.state.posts.length; i++) {
        if ( this.state.posts[i].id === updatedPost.id ) {
          this.state.posts[i] = updatedPost;
          break;
        }
      }
      this.setState( { posts: this.state.posts } );
    }
  },

  fetchFive: function() {
    var idx = this.state.posts.length;
    var fivePosts = PostStore.fetchFive(idx);
    this.setState( {posts: this.state.posts.concat(fivePosts)} );
  },

  renderFetchFive: function() {
    if ( PostStore.all().length > this.state.posts.length ) {
      return (
        <div className="fetch-five" onClick={this.fetchFive}></div>
      );
    }
  },

  handleClick: function(id) {
    this.context.router.push( "/users/" + id );
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },

  render: function() {
    return(
      <div>
        <div className="spacing-above-post-form-home"></div>
        <PostForm userId={SessionStore.currentUser().id}/>
        <div className="spacing-below-post-form-home"></div>
        <ul>
          {this.state.posts.map( function(post, idx) {

            var millisecondDay = 1000*60*60*24;
            var currentDate = new Date();
            var createAtDate = new Date(post.created_at);
            var daysSince = Math.ceil( (currentDate - createAtDate) / millisecondDay );
            var timeSince = 0;
            var timeUnit = 0;
            if( daysSince/7 < 1 ) {
              timeSince = daysSince;
              timeUnit = "d";
            } else {
              timeSince = Math.floor(daysSince/7);
              timeUnit = "w";
            }

            return (
                    <li key={idx}>

                      <HomeIndexItem post={post} timeSincePosted={timeSince + timeUnit}/>

                    </li>
                  );
            }.bind(this) )}
        </ul>

        {this.renderFetchFive()}

      </div>
    );
  }
});

module.exports = HomeIndex;
