var AppDispatcher = require('../dispatcher/dispatcher.js');
var Store = require('flux/utils').Store;
var PostConstants = require('../constants/post_constants');

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

 PostStore.__onDispatch = function(payload) {
   switch(payload.actionType) {
     case PostConstants.ADD_ALL_USER_POSTS:
      addAllUsersPosts(payload.userPosts);
      PostStore.__emitChange();
      break;
     case PostConstants.ADD_NEW_USER_POST:
      addNewUserPost(payload.userPost);
      PostStore.__emitChange();
      break;
     case PostConstants.UPDATE_USER_POST:
      UpdateUserPost(payload.userPost);
      PostStore.__emitchange();
      break;
     case PostConstants.DELETE_USER_POST:
      DeleteUserPost(payload.userPost);
      PostStore.__emitChange();
      break;
   }
 };
