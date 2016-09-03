var UserAndPostConstants = require('../constants/user_and_post_constants');
var AppDispatcher = require('../dispatcher/dispatcher');

var PostActions = {

  receiveAllPostsFromUser: function(userPosts) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ADD_ALL_USER_POSTS,
      userPosts: userPosts
    });
  },

  receiveNewPostFromUser: function(userPost) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ADD_NEW_USER_POST,
      userPost: userPost
    });
  },

  updatePostFromUser: function(userPost) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.UPDATE_USER_POST,
      userPost: userPost
    });
  },

  deletePostFromUser: function(userPost) {
    AppDispatcher.dispatcher({
      actionType: UserAndPostConstants.DELETE_USER_POST,
      userPost: userPost
    });
  }
};

module.exports = PostActions;
