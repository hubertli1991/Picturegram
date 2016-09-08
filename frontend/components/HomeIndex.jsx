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
    return { posts: [], following: true };
  },

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    // infinte scroll -start
    this.infiniteScrollCallback = function(e) {
      if ( window.location.hash.slice(0,3) !== "#/?" ) {
        // if we leave homeIndex page, we removeEventListener
        window.removeEventListener("scroll", this.infiniteScrollCallback);
        return;
      }
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.fetchFive();
      }
    }.bind(this);
    window.addEventListener("scroll", this.infiniteScrollCallback);
    // infinte scroll -end

    ClientActions.fetchFive(null, this.state.following, true);
  },

  _onChange: function() {
    this.setState( { posts: PostStore.all() } );
  },

  fetchFive: function() {
    var lastPost = this.state.posts[ this.state.posts.length - 1 ];
    ClientActions.fetchFive(lastPost.id, this.state.following, false);
  },

  renderFetchFive: function() {
    if ( PostStore.all().length > this.state.posts.length ) {
      return (
        <div className="fetch-five" onClick={this.fetchFive}></div>
      );
    }
  },

  handleSwitch: function() {
    if ( this.state.following ) {
      this.state.following = false;
    } else {
      this.state.following = true;
    }
    window.scrollTo(0, 0);
    ClientActions.fetchFive(null, this.state.following, true);
  },

  handleClick: function(id) {
    this.context.router.push( "/users/" + id );
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },

  render: function() {
    var buttonName;
    if ( this.state.following ) {
      buttonName = "NOT FOLLOWING";
    } else {
      buttonName = "FOLLOWING";
    }

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

        <div className="follow-not-follow-button" onClick={this.handleSwitch}> <div className="follow-not-follow-button-text"> {buttonName} </div> </div>

        <div className="floor"/>
      </div>
    );
  }
});

module.exports = HomeIndex;
