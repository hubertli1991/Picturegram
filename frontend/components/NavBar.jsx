var React = require('react');
var SessionStore = require('../stores/session_store');

var NavBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  backToRootPage: function() {
    this.context.router.push('/');
  },

  backToYourPage: function() {
    this.context.router.push('/users/' + SessionStore.currentUser().id);
  },

  render: function() {
    return(
      <div>
        <button onClick={this.backToRootPage}> Home Index </button>
        <button onClick={this.backToYourPage}> Your Index </button>
      </div>
    );
  }
});

module.exports = NavBar;
