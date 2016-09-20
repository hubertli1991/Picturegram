var React = require('react');
var SessionStore = require('../stores/session_store');
var SearchBar = require('./SearchBar');
var Helper = require('../helpers/helpers');

var NavBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
   return( { handleSwitch: this.props.handleSwitch, following: this.props.following } );
  },

  componentWillReceiveProps: function(newProp) {
    // handleSwitch should never change
    this.setState( { following: newProp.following } );
  },

  backToRootPage: function() {
    if ( this.currentlyScrolling ) { return; }
    if ( window.location.hash.slice(0,3) === "#/?" ) {
      Helper.scrollToTop( window.location.hash );
      return;
    }
    this.context.router.push('/');
  },

  backToYourPage: function() {
    if ( this.currentlyScrolling ) { return; }

    var idx = window.location.hash.indexOf("?");
    if ( window.location.hash.slice(0,8) === "#/users/" &&
    parseInt(window.location.hash.slice(8, idx)) === SessionStore.currentUser().id ) {
      // only slow scroll to top if on your own page
      // otherwise, slow scroll to top and jump to own page
      Helper.scrollToTop( window.location.hash );
      return;
    }

    Helper.scrollToTop( window.location.hash, this.context.router.push.bind(null, '/users/' + SessionStore.currentUser().id) );
  },

  followToggle: function() {
    if ( this.currentlyScrolling ) { return; }
    if ( window.location.hash.slice(0,3) === "#/?" ) {
      // the followToggle button only appears on the HomeIndex page, so this if statement is overkill
      // just want to be safe
      Helper.scrollToTop( window.location.hash, this.state.handleSwitch );
      return;
    }
  },

  renderFollowToggle: function() {
    if ( window.location.hash.slice(0,3) === "#/?" ) {

      var buttonName;
      var style={};
      if ( this.state.following ) {
        buttonName = "DISCOVER OTHERS";
        style = {};
      } else {
        buttonName = "CURRENTLY FOLLOWING";
        style = { color: "white", backgroundColor: "#70c050", borderColor: "#70c050" };
      }

      return <div className="follow-toggle" onClick={this.followToggle} style={style}> <div className="follow-not-follow-button-text"> {buttonName} </div>  </div>;
    }
  },

  render: function() {

    return(
      <div className="nav-bar" >
        <div className="nav-bar-refined group">
          <div className="home-link" onClick={this.backToRootPage}>
            <a className="home-link-button"></a>
          </div>
          { this.renderFollowToggle() }
          <SearchBar/>
          <div className="your-page-link">
            <div className="fa fa-user" onClick={this.backToYourPage}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
