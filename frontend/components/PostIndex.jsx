var React = require('react');
var PostStore = require('../stores/post_store');
var ClientActions = require('../actions/client_actions');

var PostIndexItem = require('./postIndexItem.jsx');

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
    return (
        <ul>
          {this.state.posts.map(function(post) {
            return (< PostIndexItem post={post} />);
          })}
        </ul>
    );
  }
});

module.exports = PostIndex;
