var React = require('react');
var Router = require('react-router').Router;
var PostStore = require("../stores/post_store");
var PostIndexItem = require('./PostIndexItem');
var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");
var NavBar = require('./NavBar');
var PostForm = require('./PostForm');
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
    ClientActions.fetchAllPosts();
  },

  _onChange: function() {
    this.setState( {posts: PostStore.all() } );
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
        <PostForm userId={SessionStore.currentUser().id}/>
        <ul>
          {this.state.posts.map( function(post, idx) {
            return (
                    <li key={idx}>

                      <div className="home-index-item">

                        <div className="post-header-home">
                          <img className="thumbnail-home" src={post.thumbnail}/> <p className="thumb-username-home" onClick={this.handleClick.bind(null, post.user_id)}> {post.username} </p>
                        </div>

                        <img className="home-picture" src={post.image_url_large} />

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

                        <div className="comment-form-home">
                          <CommentForm postId={post.id}/>
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
