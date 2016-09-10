var React = require('react');
var SessionStore = require('../stores/session_store');
var SearchBar = require('./SearchBar');

var NavBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  backToRootPage: function() {
    this.context.router.push('/');
    window.scrollTo(0, 0);
  },

  backToYourPage: function() {
    this.context.router.push('/users/' + SessionStore.currentUser().id);
    window.scrollTo(0, 0);
  },


  render: function() {

    return(
      <div className="nav-bar" >
        <div className="nav-bar-refined group">
          <div className="home-link" onClick={this.backToRootPage}>
            <a className="home-link-button"></a>
          </div>
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
