var React = require('react');
var PostStore = require('../stores/post_store');
var SessionStore = require('../stores/session_store');
var ClientActions = require('../actions/client_actions');
var SessionApiUtil = require('../util/session_api_util');
// Modal Require Start
var Modal = require("react-modal");
var _Logout_Style = require("../modal_styles/logout_styles");
// Modal Require End
var PostIndexItem = require('./PostIndexItem');
var PostForm = require('./PostForm');
var ProfileForm = require('./ProfileForm');
var NavBar = require('./NavBar');
var FollowButton = require('./FollowButton');
var Following = require('./Following');

var PostIndex = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { posts: [], modalOpen: false, userId: this.props.params.id, user: 0 };
  },


  closeModal: function(){
    this.setState({ modalOpen: false });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },


  _onChange: function() {
    this.setState({ posts: PostStore.all(), user: PostStore.fetchUser() });
  },

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    ClientActions.fetchUserAndPosts(this.state.userId);
  },

  componentWillReceiveProps: function(newProp) {
    this.state.userId = newProp.params.id;
    ClientActions.fetchUserAndPosts(parseInt(this.state.userId));
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },


  handleLogOut: function() {
    SessionApiUtil.logout(this.backToRootPage);
  },

  backToRootPage: function() {
    this.context.router.push('/');
  },

  renderProfileFormIfOnYourPage: function() {
    if (parseInt(this.state.userId) === SessionStore.currentUser().id) {
      return <ProfileForm user={SessionStore.currentUser()} userId={SessionStore.currentUser().id}/>;
    }
  },

  renderFollowButton: function() {
    if (parseInt(this.state.userId) !== SessionStore.currentUser().id) {
      return <FollowButton userId={this.state.userId} location="index"/>;
    }
  },

  renderLogoutButton: function() {
    if (parseInt(this.state.userId) === SessionStore.currentUser().id) {
      return (
          <button className="logout-modal-button" onClick={this.openModal} />
      );
    }
  },

  render: function() {
    // we don't need currentPathLocation remove this and the prop later (double ckeck)
    var currentPathLocation = this.props.location.pathname;
    var user = this.state.user;
    var postCount = this.state.posts.length;
    // placed the post count into the Following component
    // ensure previous user profile doesn't render when searching new user page
    if ( user === 0 ) { return( <div><NavBar/></div>); }

    return (
      <div>
        <NavBar/>
        <div className="body">
          <div className="right-below-nav group" >
            <img className="profile-picture" src={user.profile_picture_url_regular}/>

            <div className="stuff-under-nav-top-part">

              <div className="username-and-buttons group">
                <h1 className="user-name"> {user.username} </h1>
                {this.renderProfileFormIfOnYourPage()}
                {this.renderFollowButton()}
                {this.renderLogoutButton()}

              </div>

              <p className="profile-bio"> {user.bio} </p>

              <Following postCount={this.state.posts.length} userId={this.state.userId} type="followers" />
            </div>


          </div>

          <div>
            <PostForm userId={SessionStore.currentUser().id}/>
          </div>
          <div className="spacing-below-post-form"></div>

          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}
            style={_Logout_Style}>
            <div className="logout-modal" >
              <button className="logout-half" onClick={ this.handleLogOut }> Log out </button>
              <button className="cancel-half" onClick={ this.closeModal }> Cancel </button>
            </div>
          </Modal>

          <div className="user-picture-index group">
            <ul>
              {this.state.posts.map(function(post, idx) {
                return ( <div className="posted-picture" key={idx}>< PostIndexItem post={post} postNumber={idx} postCount={postCount} thumbnail={user.profile_picture_url_thumb_nail} path={currentPathLocation}/></div>);
              })}
            </ul>
          </div>
      </div>
      {this.props.children}
    </div>
    );
  }
});

module.exports = PostIndex;
