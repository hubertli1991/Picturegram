var React = require('react');
var Router = require('react-router').Router;

var LikeAnimation = React.createClass({

  getInitialState: function() {
    return { animationType: this.props.animationType };
  },

  componentWillReceiveProps: function(newProp) {
    this.setState({ animationType: newProp.animationType });
  },

  render: function() {
    return <div className={this.state.animationType}/>;
  }
});

module.exports = LikeAnimation;
