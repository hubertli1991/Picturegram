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
    this.context.router.push('/');
    window.scrollTo(0, 0);
  },

  backToYourPage: function() {
    this.context.router.push('/users/' + SessionStore.currentUser().id);
    window.scrollTo(0, 0);
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
        style = { color: "#70c050", borderColor: "#70c050" };
      }

      return <div className="follow-toggle" onClick={this.state.handleSwitch} style={style}> <div className="follow-not-follow-button-text"> {buttonName} </div>  </div>;
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

// <button className="fa fa-instagram"/>
// <div className="picturegram" >Picturegram</div>

// <img src="<%= asset_path('picturegram.png')%>" />
