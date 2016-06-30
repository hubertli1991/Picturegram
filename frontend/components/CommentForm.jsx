var React = require('react');
var PostStore = require('../stores/post_store');
var ClientActions = require('../actions/client_actions');

var CommentForm = React.createClass({

  getInitialState: function() {
    return {body: ""};
  },

  bodyChange: function(e) {
    var newBody = e.target.value;
    this.setState( {body: newBody} );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    // "post_id" is writen this way because in the controller, the variable is post_id
    var commentFormData = { body: this.state.body, post_id: this.props.postId };
    ClientActions.createOneComment(commentFormData);
    this.setState( {body: ""} );
  },

  render: function() {
    return(
        <form onSubmit={this.handleSubmit}>
          <input className="comment-form-text" type="text" placeholder="Add a comment..." value={this.state.body} onChange={this.bodyChange}></input>
        </form>
    );
  }
});

module.exports = CommentForm;
