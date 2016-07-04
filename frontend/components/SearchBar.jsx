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
    return ( { username: "", matchedUsers: [], showSearchIndex: true } );
  },

  componentDidMount: function() {
    this.userStorelistener = UserStore.addListener(this._onChange);
    // $(document).on("click", this.showSearchIndexToggle);
  },

  searchForUser: function(e) {
    e.preventDefault();
    if ( this.state.matchedUsers[0] ) {
      var targetUserId = this.state.matchedUsers[0].id;
      this.context.router.push( "/users/" + targetUserId );
    }
    this.setState( { username: "", matchedUsers: [], showSearchIndex: true  } );
  },

  changeSearchValue: function(e) {
    var newSearchValue = e.target.value;
    // asynchronous
    this.fetchUsersThatMatchSearch( newSearchValue );
    this.setState( { username: newSearchValue, showSearchIndex: true  } );
  },

  fetchUsersThatMatchSearch: function(searchValue) {
    ClientActions.fetchUsersThatMatchSearch( searchValue );
  },

  clearSearchBar: function() {
    this.setState( { username: "", showSearchIndex: true  } );
  },

  _onChange: function() {
    this.setState( { matchedUsers: UserStore.all(), showSearchIndex: true  } );
  },

  hideSearchIndex: function() {
    document.addEventListener("click", this.hideHandler = this.hideHandler || function(e){
      // set this.hideHandler to event handler function or itself if it has already been set
      // remove the even listeneer as soon as even occurs
      document.removeEventListener("click", this.hideHandler);
      if ( e.target !== document.getElementById("searchBarText") ) {
        this.setState( { showSearchIndex: false } );
      }
    }.bind(this));
  },

  showSearchBarIndexItem: function() {
    if ( this.state.matchedUsers.length && this.state.showSearchIndex ) {
      this.hideSearchIndex();
      return (
        <ul className="searchbar-index" onClick={this.clearSearchBar}>
          {this.state.matchedUsers.map(function(user, idx) {
            return (<SearchBarIndexItem user={user} key={idx}/>);
          })}
        </ul>
      );
    }
  },

  turnBackOn: function() {
    this.setState( { showSearchIndex: true  } );
  },

  // the id, name and autocomplete attributes inside <input> is there to remove the autocomplete history
  render: function() {

    return (
      <div className="searchbar" id="searchBar">
        <form className="searchbar-form" id="searchBarForm" autocomplete="nope" onSubmit={this.searchForUser}>
          <input className="searchbar-text" type="text" placeholder="Search" value={this.state.username} onClick={this.turnBackOn} onChange={this.changeSearchValue}/>
        </form>

        {this.showSearchBarIndexItem()}

      </div>
    );
  }
});

module.exports = SearchBar;
