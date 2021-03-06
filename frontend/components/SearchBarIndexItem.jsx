var React = require('react');
var ClientActions = require('../actions/client_actions');
var UserStore = require('../stores/user_store');
var Helper = require('../helpers/helpers');

var SearchBarIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    // console.log("search index item");
    return { user: this.props.user, hoverStyle: {}, type: this.props.user.type, removeClickListener: this.props.removeClickListener };
  },

  componentWillReceiveProps: function(newProp) {
    // this.setState will not invoke render, but when you change the props, this.render will get invoked after this function
    this.setState( { user: newProp.user,  hoverStyle: {}, type: newProp.user.type, removeClickListener: newProp.removeClickListener } );
  },

  searchForUser: function() {
    this.state.removeClickListener();

    var newRoute;
    if ( this.state.type === "user" ) {
      newRoute = "/users/" + this.state.user.id;
    } else if ( this.state.type === "hashtag" ) {
      newRoute = "/hashtags/" + this.state.user.id;
    }

    if ( window.location.hash.slice(0,3) !== "#/?" ) {
      Helper.scrollToTop( window.location.hash, this.context.router.push.bind(null, newRoute) );
      ClientActions.fetchUsersThatMatchSearch("");
      return;
    }

    this.context.router.push(newRoute);
    // Want to clear out the search Index under and the value inside the search bar
    // This step will skip the backend to clear the UserStore
    ClientActions.fetchUsersThatMatchSearch("");
  },

  addHoverEffect: function(idx) {
    this.setState( {hoverStyle: {backgroundColor: "#ededed"}} );
  },

  removeHoverEffect: function(idx) {
    this.setState( {hoverStyle: {}} );
  },

  render: function() {
    if ( this.state.type === "user" ) {
      return(
        <li className="searchbar-index-item" onClick={this.searchForUser} style={this.state.hoverStyle}>
          <img className="searchbar-thumbnail" src={this.state.user.profile_picture_url_thumb_nail} />
          <div className="searchbar-username" > {this.state.user.username} </div>
        </li>
      );
    } else if ( this.state.type === "hashtag" ) {
      var unit = "posts";
      if ( this.state.user.count === 1 ) {
        unit = "post";
      }
      return(
        <li className="searchbar-index-item" onClick={this.searchForUser} style={this.state.hoverStyle}>
          <div className="searchbar-thumbnail-hashtag"/>
          <div className="searchbar-username-hashtag" > {this.state.user.hashtag.slice(1)} </div>
          <div className="searchbar-hashtag-post-count" > {this.state.user.count} {unit} </div>
        </li>
      );
    }
  }
});

module.exports = SearchBarIndexItem;
