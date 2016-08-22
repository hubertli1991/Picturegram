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
  },

  componentWillUnmount: function() {
    // Resetting instance variable to be safe. Doesn't have any effects for now
    this.newSearchValue = "";
    this.userStorelistener.remove();
  },

  searchForUser: function(e) {
    e.preventDefault();
    if ( this.netUpDown !== 0) {return;}
    if ( this.state.matchedUsers[0] ) {
      var targetUserId = this.state.matchedUsers[0].id;
      this.context.router.push( "/users/" + targetUserId );
    }
    // Resetting instance variable to be safe. Doesn't have any effects for now
    this.newSearchValue = "";
    this.setState( { username: "", matchedUsers: [], showSearchIndex: true  } );
  },

  changeSearchValue: function(e) {
    this.newSearchValue = e.target.value;
    // create this varable so we setState with it in _onChange
    // this way we don't need to call setState in this current function
    // avoid asynchronous conflicts

    this.currentTarget = this.currentTarget || 0;
    if ( this.currentTarget ) {
      this.refs[this.currentTarget].removeHoverEffect();
    }

    this.fetchUsersThatMatchSearch( this.newSearchValue );
    // this.setState( { username: newSearchValue, showSearchIndex: true  } );
  },

  fetchUsersThatMatchSearch: function(searchValue) {
    ClientActions.fetchUsersThatMatchSearch( searchValue );
  },

  clearSearchBar: function() {
    this.setState( { username: "", showSearchIndex: true  } );
  },

  _onChange: function() {
    this.setState( { username: this.newSearchValue, matchedUsers: UserStore.all(), showSearchIndex: true  } );
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
    // reset these two values to make sure search bar runs properly after search
    this.netUpDown = 0;
    this.currentTarget = 0;

    if ( this.state.matchedUsers.length && this.state.showSearchIndex ) {
      this.hideSearchIndex();
      return (
        <ul className="searchbar-index" onClick={this.clearSearchBar}>
          {this.state.matchedUsers.map(function(user, idx) {
            return (<SearchBarIndexItem user={user} key={idx} ref={user.username}/>);
          })}
        </ul>
      );
    }
  },

  turnBackOn: function() {
    this.setState( { showSearchIndex: true  } );
  },

  searchUsingSearchBarIndex: function(e) {
    // skip this function if there are no matched users
    if ( this.state.matchedUsers.length === 0 ) { return; }
    this.netUpDown = this.netUpDown || 0;
    var numberOfMatchedUsers = this.state.matchedUsers.length;
    if ( e.keyCode === 40 && this.netUpDown < numberOfMatchedUsers ) {
      this.netUpDown = this.netUpDown + 1;

      this.currentTarget = this.state.matchedUsers[this.netUpDown - 1].username;
      this.refs[this.currentTarget].addHoverEffect();

      if ( this.netUpDown >= 2 ) {
        this.previousTarget = this.state.matchedUsers[this.netUpDown - 2].username;
        this.refs[this.previousTarget].removeHoverEffect();
      }
    }
    else if ( e.keyCode === 38 && this.netUpDown > 0 ) {
      this.netUpDown = this.netUpDown - 1;

      if ( this.netUpDown >= 1 ) {
        this.currentTarget = this.state.matchedUsers[this.netUpDown - 1].username;
        this.refs[this.currentTarget].addHoverEffect();
      }

      if ( this.netUpDown <= numberOfMatchedUsers - 1 ) {
        this.previousTarget = this.state.matchedUsers[this.netUpDown].username;
        this.refs[this.previousTarget].removeHoverEffect();
      }
    }
    else if ( e.keyCode === 13 && this.netUpDown !== 0) {
      // ENTER key
      // var indexItemUsername = this.state.matchedUsers[this.netUpDown - 1].username;
      this.refs[this.currentTarget].searchForUser();
    }
  },

  // the id, name and autocomplete attributes inside <input> is there to remove the autocomplete history
  render: function() {
    // this.netUpDown = 0;
    return (
      <div className="searchbar" id="searchBar">
        <form className="searchbar-form" id="searchBarForm" autocomplete="nope" onSubmit={this.searchForUser}>
          <input className="searchbar-text" type="text" placeholder="Search" value={this.state.username} onClick={this.turnBackOn} onKeyDown={this.searchUsingSearchBarIndex} onChange={this.changeSearchValue}/>
        </form>

        {this.showSearchBarIndexItem()}

      </div>
    );
  }
});

module.exports = SearchBar;
