var AppDispatcher = require('../dispatcher/dispatcher.js');
var Store = require('flux/utils').Store;
var UserAndPostConstants = require('../constants/user_and_post_constants');

 var PostStore = new Store(AppDispatcher);

 var _posts = [];

 var addAllUserPosts = function(userPosts) {
   _posts = userPosts;
 };

 var addNewUserPost = function(post) {
   _posts = _posts.concat(post);
 };

 var UpdateUserPost = function(post) {
   for (var i = 0; i < _posts.length; i++) {
     if (_posts[i].id === post[0].id) {
       _posts[i] = post[0];
     }
   }
 };

 var DeleteUserPost = function(post) {
   _posts.splice(_posts.indexOf(post[0]),1);
 };

 PostStore.all = function() {
   return _posts;
 };

 PostStore.__onDispatch = function(payload) {
   switch(payload.actionType) {
     case UserAndPostConstants.ADD_USER_OR_ALL_HIS_POSTS:
      var userPosts = payload.userAndPosts;
      addAllUserPosts(userPosts);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.ADD_NEW_USER_POST:
      addNewUserPost(payload.userPost);
      PostStore.__emitChange();
      break;
     case UserAndPostConstants.UPDATE_USER_POST:
      UpdateUserPost(payload.userPost);
      PostStore.__emitchange();
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



  // UserStore.__onDispatch = function(payload) {
  //   switch(payload.actionType) {
  //     case UserConstants.USER_RECEIVED:
  //      setShownUser(payload.user);
  //      PostStore.__emitChange();
  //      break;
  //   }
