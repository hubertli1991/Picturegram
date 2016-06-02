var PostConstants = require('../constants/post_constants');
var AppDispatcher = require('../dispatcher/dispatcher');

var PostActions = {

  receiveAllPostsFromUser: function(userPosts) {
    AppDispatcher.dispatch({
      actionType: PostConstants.ADD_ALL_USER_POSTS,
      userPosts: userPosts
    });
  },

  receiveNewPostFromUser: function(userPost) {
    AppDispatcher.dispatch({
      actionType: PostConstants.ADD_NEW_USER_POST,
      userPost: userPost
    });
  },

  updatePostFromUser: function(userPost) {
    AppDispatcher.dispatch({
      actionType: PostConstants.UPDATE_USER_POST,
      userPost: userPost
    });
  },

  deletePostFromUser: function(userPost) {
    AppDispatcher.dispatcher({
      actionType: PostConstants.DELETE_USER_POST,
      userPost: userPost
    });
  }
};

module.exports = PostActions;
