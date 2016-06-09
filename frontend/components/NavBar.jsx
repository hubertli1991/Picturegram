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
      <div className="nav-bar" >
        <div className="nav-bar-refined group">
          <button className="home-link" onClick={this.backToRootPage}> Home Index </button>
          <button className="your-page-link" onClick={this.backToYourPage}> Your Index </button>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
