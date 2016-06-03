var React = require('react');
var PostStore = require('../stores/post_store');
var ClientAction = require('../actions/client_actions');

var PostIndex = React.createClass({

  getInititalState: function() {
    return PostStore.all();
  },

  componentDidMount: function() {
    PostStore.addListener(this._onChange);
    ClientActions.fetchUserAndPosts(this.props.params.id)
  },

  _onChange: function() {

  };

  render: function() {
    return (
      <div>
        <ul>
          {this.state.posts.map(function(post) {

          })}
        </ul>
      </div>
    )
  }
});
