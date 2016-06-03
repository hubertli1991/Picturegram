var React = require('react');

var PostIndexItem = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  handleClick: function() {
    this.context.router.push('' + this.props.post.id);
  },

  render: function() {
    return (
      <li onClick={this.handleClick}>
        // picture tag with {this.props.post.picture}
      </li>
    );
  }
});

module.exports = PostIndexItem;
