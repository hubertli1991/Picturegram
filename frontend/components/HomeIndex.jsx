var React = require('react');
var Router = require('react-router').Router;
var PostStore = require("../stores/post_store");
var PostIndexItem = require('./PostIndexItem');
var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");
var NavBar = require('./NavBar');
var PostForm = require('./PostForm');
var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');
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
    this.setState( {posts: PostStore.fetchFive(0) } );
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
            var daysSince = Math.ceil( (currentDate - createAtDate) / millisecondDay);
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

                      <div className="home-index-item">

                        <div className="post-header-home">
                          <img className="thumbnail-home" src={post.thumbnail} onClick={this.handleClick.bind(null, post.user_id)}/>
                          <p className="thumb-username-home" onClick={this.handleClick.bind(null, post.user_id)}> {post.username} </p>
                          <div className="time-since-home"> {timeSince + timeUnit} </div>
                        </div>

                        <img className="home-picture" src={post.image_url_large} />

                        <LikeCount postId={post.id} location={"home"}/>

                        <div className="caption-and-comments-home" >
                          <div className="caption">
                            <div> <p className="username-home" onClick={ this.handleClick.bind(null, post.user_id) }> {post.username} </p>
                              {post.caption} </div>
                          </div>

                          <ul className="comment-list-home">
                            {post.comments.map( function(comment, idex){
                              return ( <li className="comment" key={idex}>
                                        <p> <a className="username-home" onClick={this.handleClick.bind(null, comment.user_id)}> {comment.username} </a>
                                        {comment.body} </p>
                                      </li> );
                            }.bind(this))}
                          </ul>
                        </div>

                        <LikeButton postId={post.id} caption={post.caption} key={idx} location={"home"}/>

                        <div className="comment-form-home">
                          <CommentForm postId={post.id} location={"home"}/>
                        </div>
                      </div>

                    </li>
                  );
            }.bind(this) )}
        </ul>

      </div>
    );
  }
});

module.exports = HomeIndex;
