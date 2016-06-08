var React = require('react');
var Router = require('react-router').Router;
var PostStore = require("../stores/post_store");
var PostIndexItem = require('./PostIndexItem');
var ClientActions = require('../actions/client_actions');
var CommentForm = require("./CommentForm");

var HomeIndex = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {posts: PostStore.all()};
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
        <ul>
          {this.state.posts.map( function(post, idx) {
            return (
                    <li key={idx}>
                        <p onClick={this.handleClick.bind(null, post.user_id)}> {post.username} </p>
                        <img src={post.image_url_large} />
                        <p> {post.caption} </p>
                        <ul>
                          {post.comments.map( function(comment, idex){
                            return ( <li key={idex}>
                                      <p onClick={this.handleClick.bind(null, comment.user_id)}> {comment.username} </p>
                                      {comment.body}
                                    </li> );
                          }.bind(this))}
                        </ul>
                        <CommentForm postId={post.id}/>
                    </li>
                  );
            }.bind(this) )}
        </ul>
    );
  }
});

module.exports = HomeIndex;
