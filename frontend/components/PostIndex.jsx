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

var PostIndex = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { posts: [], modalOpen: false };
  },


  closeModal: function(){
    this.setState({ modalOpen: false });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },


  _onChange: function() {
    this.setState({ posts: PostStore.all() });
  },

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    ClientActions.fetchUserAndPosts(this.props.params.id);
  },

  componentWillReceiveProps: function(newProps) {
    ClientActions.fetchUserAndPosts(parseInt(newProps.params.id));
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },


  handleLogOut: function() {
    SessionApiUtil.logout();
    this.backToRootPage();
  },

  backToRootPage: function() {
    this.context.router.push('/');
  },
// < PostIndexItem post={post} />
// <h1> Hello </h1>


  renderProfileFormIfOnYourPage: function() {
    if (parseInt(this.props.params.id) === SessionStore.currentUser().id) {
      return <ProfileForm user={SessionStore.currentUser()} userId={SessionStore.currentUser().id}/>;
    }
  },

  render: function() {

    var currentPathLocation = this.props.location.pathname;
    var user = PostStore.fetchUser();

    return (
      <div>
        <NavBar/>

        <div className="right-below-nav group" >

          <img className="profile-picture" src={user.profile_picture_url_regular}/>

          <div className="stuff-under-nav-top-part group">
            <h1 className="user-name"> {user.username} </h1>
            {this.renderProfileFormIfOnYourPage()}
            <div className="logout-modal-button">
              <button className="fa fa-bars" onClick={this.openModal} />
            </div>
            <p className="profile-bio"> {user.bio} </p>
          </div>

        </div>

        <div>
          <PostForm userId={SessionStore.currentUser().id}/>
        </div>

        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}
          style={_Logout_Style}>
          <div className="logout-modal" >
            <button className="logout-half" onClick={ this.handleLogOut }> Log out </button>
            <button className="cancel-half" onClick={this.closeModal}> Cancel </button>
          </div>
        </Modal>

        <div className="user-picture-index group">
          <ul>
            {this.state.posts.map(function(post, idx) {
              return ( <div className="posted-picture" key={idx}>< PostIndexItem post={post} thumbnail={user.profile_picture_url_thumb_nail} path={currentPathLocation}/></div>);
            })}
          </ul>
        </div>

        {this.props.children}
      </div>
    );
  }
});

module.exports = PostIndex;
