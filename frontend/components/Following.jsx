var React = require('react');
var Router = require('react-router').Router;

var Modal = require("react-modal");
var _Follow_Style = require("../modal_styles/follow_styles");

var FollowButton = require('./FollowButton');

var FollowStore = require('../stores/follow_store');
var SessionStore = require('../stores/session_store');

var ClientActions = require('../actions/client_actions');

var Followers = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { userId: this.props.userId, postCount: this.props.postCount, type: "", followersCount: 0, followingCount: 0, followSet: {}, onYourOwnPage: this.props.onYourOwnPage };
  },


  openModal: function(type){
    this.setState({ modalOpen: true, type: type, followSet: FollowStore.fetchAllUsers(this.state.userId, type)} );
  },
  closeModal: function(){
    this.setState({ modalOpen: false, type: "" });
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
    this.state.onYourOwnPage = newProp.onYourOwnPage;
    ClientActions.fetchFollowersAndFollowees(this.state.userId);
  },

  _onChange: function() {
    // may get called before fetchFollowersAndFollowees cycle is complete because FollowButton also kicks off a cycle
    // that updates the FollowStore
    var counts = FollowStore.fetchCount( this.state.userId );
    if ( this.state.followersCount !== counts.followersCount || this.state.followingCount !== counts.followingCount ) {
      this.setState({ followersCount: counts.followersCount, followingCount: counts.followingCount });
    }
  },

  handleClick: function(type) {
    this.openModal(type);
  },

  renderFollowButton: function(userId) {
    if ( userId !== SessionStore.currentUser().id ) {
      return <FollowButton userId={userId} onYourOwnPage={this.state.onYourOwnPage} location="follow-index-item"/>;
    }
  },

  clickRoute: function(userId) {
    this.closeModal();
    this.context.router.push( "/users/" + userId );
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
        <div className="user-stat-posts">
          <div className="user-stat-number"> {this.state.postCount} </div>
          <div className="user-stat-unit"> {postsUnit} </div>
        </div>
        <div className="user-stat" onClick={this.handleClick.bind(null, "followers")}>
          <div className="user-stat-number"> {this.state.followersCount} </div>
          <div className="user-stat-unit"> {followersUnit} </div>
        </div>
        <div className="user-stat" onClick={this.handleClick.bind(null, "following")}>
          <div className="user-stat-number"> {this.state.followingCount} </div>
          <div className="user-stat-unit"> {followingUnit} </div>
        </div>

        <Modal isOpen={this.state.modalOpen} onRequestClose={this.closeModal} style={_Follow_Style}>
          <div className="follow-header"><div className="follow-header-text">{this.state.type.toUpperCase()}</div></div>

          <ul className="follow-list">
            { Object.keys( this.state.followSet ).map( function(userId, idx) {
              return (
                <li className="follow-index-item" key={idx}>
                  <img className="searchbar-thumbnail" onClick={this.clickRoute.bind(null, userId)} src={this.state.followSet[userId].profile_picture_url_thumb_nail} />
                  <div className="follow-index-item-username" onClick={this.clickRoute.bind(null, userId)}> {this.state.followSet[userId].username} </div>
                  {this.renderFollowButton( this.state.followSet[userId].id )}
                </li>
              );
              }.bind(this) ) }
          </ul>

        </Modal>
      </div>
    );
  }
});

module.exports = Followers;
