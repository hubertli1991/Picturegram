var UserAndPostConstants = require('../constants/user_and_post_constants');
var AppDispatcher = require('../dispatcher/dispatcher');

var ServerActions = {

  fetchAllPosts: function(allPosts) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ALL_POSTS,
      allPosts: allPosts
    });
  },

// fetching a single user and all of his/her posts

  receiveUserAndAllPosts: function(userAndPosts) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ADD_USER_OR_ALL_HIS_POSTS,
      userAndPosts: userAndPosts
    });
  },

// Individual user post

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
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.DELETE_USER_POST,
      userPost: userPost
    });
  },

  fetchUsersThatMatchSearch: function(matchedUsers) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.BRING_DOWN_MATCHED_USERS,
      matchedUsers: matchedUsers
    });
  }
};

module.exports = ServerActions;
