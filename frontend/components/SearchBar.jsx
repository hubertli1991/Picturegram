var React = require('react');
var UserStore = require('../stores/user_store');
var ClientActions = require('../actions/client_actions');
var SessionApiUtil = require('../util/session_api_util');

var SearchBarIndexItem = require('./SearchBarIndexItem');

var SearchBar = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return ( { username: "", matchedUsers: [] } );
  },

  componentDidMount: function() {
    this.userStorelistener = UserStore.addListener(this._onChange);
  },

  searchForUser: function(e) {
    e.preventDefault();
    if ( this.state.matchedUsers[0] ) {
      var targetUserId = this.state.matchedUsers[0].id;
      this.context.router.push( "/users/" + targetUserId );
    }
    this.setState( { username: "", matchedUsers: [] } );
  },

  changeSearchValue: function(e) {
    var newSearchValue = e.target.value;
    // asynchronous
    this.fetchUsersThatMatchSearch( newSearchValue );
    this.setState( { username: newSearchValue } );
  },

  fetchUsersThatMatchSearch: function(searchValue) {
    ClientActions.fetchUsersThatMatchSearch( searchValue );
  },

  _onChange: function() {
    this.setState( { matchedUsers: UserStore.all() } );
  },

  render: function() {
    // console.log(this.state.matchedUsers);
    return (
      <div>
        <form onSubmit={this.searchForUser}>
          <input type="text" value={this.state.username} onChange={this.changeSearchValue}/>
          <input type="submit" value="search"/>
        </form>

        <ul>
          {this.state.matchedUsers.map(function(user, idx) {
            return (<SearchBarIndexItem user={user} key={idx}/>);
          })}
        </ul>

      </div>
    );
  }
});

module.exports = SearchBar;
