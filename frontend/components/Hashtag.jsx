var React = require('react');
var Router = require('react-router').Router;

var Hashtag = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { hashtag: this.props.hashtag, hashtagId: this.props.hashtagId };
  },

  handleClick: function(hashtagId) {
    this.context.router.push( "/hashtag/" + hashtagId );
  },

  render: function() {
    return <div className="hashtag" onClick={this.handleClick.bind(null, this.state.hashtagId)}>{this.state.hashtag}</div>;
  }
});

module.exports = Hashtag;
