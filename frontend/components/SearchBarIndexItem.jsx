var React = require('react');
var ClientActions = require('../actions/client_actions');
var UserStore = require('../stores/user_store');

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

    if ( window.location.hash.slice(0,3) !== "#/?" ) {
      this.scrollToTop( window.location.hash, this.reRoute );
      ClientActions.fetchUsersThatMatchSearch("");
      return;
    }

    this.reRoute();
    // Want to clear out the search Index under and the value inside the search bar
    // This step will skip the backend to clear the UserStore
    ClientActions.fetchUsersThatMatchSearch("");
  },

  reRoute: function() {
    if ( this.state.type === "user" ) {
      this.context.router.push( "/users/" + this.state.user.id );
    } else if ( this.state.type === "hashtag" ) {
      this.context.router.push( "/hashtags/" + this.state.user.id );
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
