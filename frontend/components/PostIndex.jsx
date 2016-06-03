var React = require('react');
var PostStore = require('../stores/post_store');
var ClientAction = require('../actions/client_actions');

var PostIndex = React.createClass({

  getInititalState: function() {
    return { posts: PostStore.all() };
  },

  _onChange: function() {
    this.setState({ posts: PostStore.all() });
  };

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    ClientActions.fetchUserAndPosts(this.props.params.id)
  },

  componentWillReceiveProps: function(newProps) {
    ClientActions.fetchUserAndPosts(parseInt(newProps.params.id));
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },

  render: function() {
    return (
      <div>
        <ul>
          {this.state.posts.map(function(post) {
            return (< PostIndexItem post={post} />);
          })}
        </ul>
      </div>
    )
  }
});
