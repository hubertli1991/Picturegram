var React = require('react');

var PostIndexItem = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  handleClick: function() {
    this.context.router.push('' + this.props.post.id);
  },

  // <img src={this.props.post.image_url}/>
  render: function() {
    return (
      <li onClick={this.handleClick}>
        <img src={this.props.post.image_url}/> 
      </li>
    );
  }
});

module.exports = PostIndexItem;
