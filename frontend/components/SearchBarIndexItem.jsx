var React = require('react');
var ClientActions = require('../actions/client_actions');
var UserStore = require('../stores/user_store');

var SearchBarIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { user: this.props.user };
  },

  searchForUser: function() {
    this.context.router.push( "/users/" + this.state.user.id );
    // Want to clear out the search Index under and the value inside the search bar
    // This step will skip the backend to clear the UserStore
    ClientActions.fetchUsersThatMatchSearch("");
  },

  render: function() {
    return(
      <li onClick={this.searchForUser}>
        <div> {this.state.user.username} </div>
        <div> { this.state.user.id } </div>
      </li>
    );
  }
});

module.exports = SearchBarIndexItem;
