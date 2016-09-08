var React = require('react');
var Router = require('react-router').Router;

var FollowStore = require('../stores/follow_store');

var ClientActions = require('../actions/client_actions');

var Followers = React.createClass({
  getInitialState: function() {
    return { userId: this.props.userId, postCount: this.props.postCount, followersCount: 0, followingCount: 0 };
  },

  componentDidMount: function() {
    this.followStoreListener = FollowStore.addListener(this._onChange);
    ClientActions.fetchFollowersAndFollowees(this.state.userId);
  },

  componentWillUnmount: function() {
    this.followStoreListener.remove();
  },

  componentWillReceiveProps: function(newProp) {
    this.state.userId = newProp.userId;
    this.state.postCount = newProp.postCount;
    ClientActions.fetchFollowersAndFollowees(this.state.userId);
  },

  _onChange: function() {
    // may get called before fetchFollowersAndFollowees cycle is complete because FollowButton also kicks off a cycle
    // that updates the FollowStore
    var counts = FollowStore.fetchCount( this.state.userId );
    this.setState({ followersCount: counts.followersCount, followingCount: counts.followingCount });
  },

  render: function() {
    var followersUnit = " followers";
    if ( this.state.followersCount === 1 ) {
      followersUnit = " follower";
    }

    var postsUnit = " posts";
    if ( this.state.postCount === 1 ) {
      postsUnit = " post";
    }

    var followingUnit = " following";

    return (
      <div className="user-profile-stats group">
        <div className="user-stat">
          <div className="user-stat-number"> {this.state.postCount} </div>
          <div className="user-stat-unit"> {postsUnit} </div>
        </div>
        <div className="user-stat">
          <div className="user-stat-number"> {this.state.followersCount} </div>
          <div className="user-stat-unit"> {followersUnit} </div>
        </div>
        <div className="user-stat">
          <div className="user-stat-number"> {this.state.followingCount} </div>
          <div className="user-stat-unit"> {followingUnit} </div>
        </div>
      </div>
    );
  }
});

module.exports = Followers;
