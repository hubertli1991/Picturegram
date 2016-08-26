var AppDispatcher = require('../dispatcher/dispatcher.js');
var Store = require('flux/utils').Store;
var UserAndPostConstants = require('../constants/user_and_post_constants');

 var PostStore = new Store(AppDispatcher);

 var _posts = [];

 var _updatedIndex = null;

 var addAllUserPosts = function(userPosts) {
   _posts = userPosts;
 };

 var addAllPosts = function(allPosts) {
   _posts = allPosts;
 };

 var addFivePosts = function(fivePosts) {
   _posts = _posts.concat(fivePosts);
 };

 var addNewUserPost = function(post) {
   _posts = _posts.concat(post);
 };

 var UpdateUserPost = function(post) {
   for (var i = 0; i < _posts.length; i++) {
     if (_posts[i].id === post.id) {
       _posts[i] = post;
       _updatedIndex = i;
     }
   }
 };

 var DeleteUserPost = function(post) {
   _posts.splice(_posts.indexOf(post[0]),1);
 };

 PostStore.all = function() {
   return _posts;
 };

 PostStore.fetchFive = function(idx) {
   return _posts.slice(idx, idx + 5);
 };

 PostStore.fetchSinglePost = function(postId) {
   for (var i = 0; i < _posts.length; i++) {
     if (_posts[i].id === postId) {
       return _posts[i];
     }
   }
 };

 PostStore.fetchMostUpdatedPost = function() {
   return _posts[_updatedIndex];
 };

 PostStore.fetcherPostByArrayIndex = function(postNumber) {
   return _posts[postNumber];
 };

 PostStore.fetchUser = function() {
   var user = {};
   if (this.userAndPosts) {
     ["id", "username", "bio", "profile_picture_url_regular", "profile_picture_url_thumb_nail"].map( function(key) {
       user[key] = this.userAndPosts[key];
     }.bind(this));
   }
   return user;
 };

 PostStore.__onDispatch = function(payload) {
   switch(payload.actionType) {
     case UserAndPostConstants.ALL_POSTS:
      var allPosts = payload.allPosts.posts;
      addAllPosts(allPosts);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.FIVE_POSTS:
      var fivePosts = payload.fivePosts.posts;
      addFivePosts(fivePosts);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.ADD_USER_OR_ALL_HIS_POSTS:
      this.userAndPosts = payload.userAndPosts;
      var userPosts = payload.userAndPosts.posts;
      addAllUserPosts(userPosts);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.ADD_NEW_USER_POST:
      addNewUserPost(payload.userPost);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.UPDATE_USER_POST:
      UpdateUserPost(payload.userPost);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.DELETE_USER_POST:
      DeleteUserPost(payload.userPost);
      PostStore.__emitChange();
      break;
    //  case UserConstants.USER_RECEIVED:
    //   addAllUsersPosts(payload.user.posts);
    //   PostStore.__emitChange();
    //   break;
   }
 };

module.exports = PostStore;

  // UserStore.__onDispatch = function(payload) {
  //   switch(payload.actionType) {
  //     case UserConstants.USER_RECEIVED:
  //      setShownUser(payload.user);
  //      PostStore.__emitChange();
  //      break;
  //   }
