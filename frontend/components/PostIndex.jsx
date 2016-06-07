var React = require('react');
var PostStore = require('../stores/post_store');
var ClientActions = require('../actions/client_actions');

var PostIndexItem = require('./PostIndexItem');
var PostForm = require('./PostForm');

var PostIndex = React.createClass({

  getInitialState: function() {
    return { posts: PostStore.all() };
  },

  _onChange: function() {
    console.log(PostStore.all());
    this.setState({ posts: PostStore.all() });
  },

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    ClientActions.fetchUserAndPosts(this.props.params.id);
  },

  componentWillReceiveProps: function(newProps) {
    ClientActions.fetchUserAndPosts(parseInt(newProps.params.id));
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },

// < PostIndexItem post={post} />
// <h1> Hello </h1>

// debugger;
// console.log(post);

  render: function() {

    var currentPathLocation = this.props.location.pathname;

    return (
        <ul>
          <h1> Hi User {this.props.params.id}!</h1>
          {this.state.posts.map(function(post, idx) {
            return (< PostIndexItem post={post} path={currentPathLocation} key={idx} />);
          })}
          <PostForm userId={this.props.params.id}/>
          {this.props.children}
        </ul>
    );
  }
});

module.exports = PostIndex;
