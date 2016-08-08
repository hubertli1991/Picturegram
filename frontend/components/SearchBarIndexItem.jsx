var React = require('react');
var ClientActions = require('../actions/client_actions');
var UserStore = require('../stores/user_store');

var SearchBarIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { user: "" };
  },

  componentDidMount: function() {
    this.setState( { user: this.props.user, hoverStyle: {} } );
  },

  componentWillReceiveProps: function(newProps) {
    // this.setState will not invoke render, but when you change the props, this.render will get invoked after this function
    this.setState( { user: newProps.user } );
  },

  searchForUser: function() {
    this.context.router.push( "/users/" + this.state.user.id );
    // Want to clear out the search Index under and the value inside the search bar
    // This step will skip the backend to clear the UserStore
    ClientActions.fetchUsersThatMatchSearch("");
  },

  addHoverEffect: function(idx) {
    this.setState( {hoverStyle: {backgroundColor: "#fafafa",}} );
  },

  removeHoverEffect: function(idx) {
    this.setState( {hoverStyle: {}} );
  },

  render: function() {
    return(
      <li className="searchbar-index-item" onClick={this.searchForUser} style={this.state.hoverStyle}>
        <img className="searchbar-thumbnail" src={this.state.user.profile_picture_url_thumb_nail} />
        <div className="searchbar-username" > {this.state.user.username} </div>
      </li>
    );
  }
});

module.exports = SearchBarIndexItem;
