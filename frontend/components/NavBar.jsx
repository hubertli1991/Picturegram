var React = require('react');
var SessionStore = require('../stores/session_store');
var SearchBar = require('./SearchBar');

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
          <div className="home-link">
            <button className="fa fa-instagram" onClick={this.backToRootPage}/>
          </div>
          <SearchBar/>
          <div className="your-page-link">
            <button className="fa fa-user" onClick={this.backToYourPage}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
