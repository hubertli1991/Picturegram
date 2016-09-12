var React = require('react');
var SessionStore = require('../stores/session_store');
var SearchBar = require('./SearchBar');

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
      this.scrollToTop( window.location.hash );
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
      // otherwise just jump to it
      this.scrollToTop( window.location.hash );
      return;
    }

    this.context.router.push('/users/' + SessionStore.currentUser().id);
    window.scrollTo(0, 0);
  },

  followToggle: function() {
    if ( this.currentlyScrolling ) { return; }
    if ( window.location.hash.slice(0,3) === "#/?" ) {
      // the followToggle button only appears on the HomeIndex page, so this if statement is overkill
      // just want to be safe
      this.scrollToTop( window.location.hash, this.state.handleSwitch );
      return;
    }
  },

  scrollToTop: function( currentPage, callback ) {
    this.currentY = this.currentY || window.scrollY;

    if ( this.currentY <= 0 || (window.location.hash !== currentPage) ) {
      this.currentY = null;
      clearTimeout( this.currentlyScrolling );
      this.currentlyScrolling = null;
      if (callback) { callback(); }
      return;
    }

    this.currentlyScrolling = setTimeout( function() {
      this.currentY -= 70;
      window.scrollTo(0, this.currentY);
      this.scrollToTop( currentPage, callback );
    }.bind(this), 1);
  },

  renderFollowToggle: function() {
    if ( window.location.hash.slice(0,3) === "#/?" ) {

      var buttonName;
      var style={};
      if ( this.state.following ) {
        buttonName = "NOT FOLLOWING";
        style = {};
      } else {
        buttonName = "FOLLOWING";
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
