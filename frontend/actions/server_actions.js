var UserAndPostConstants = require('../constants/user_and_post_constants');
var LikeConstants = require('../constants/like_constants');
var HashtagAndPostConstants = require('../constants/hashtag_and_post_constants');
var FollowConstants = require('../constants/follow_constants');
var AppDispatcher = require('../dispatcher/dispatcher');

var ServerActions = {

  fetchAllPosts: function(allPosts) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ALL_POSTS,
      allPosts: allPosts
    });
  },

  fetchFive: function(fivePosts, replaceStore) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.FIVE_POSTS,
      fivePosts: fivePosts,
      replaceStore: replaceStore
    });
  },

// fetching a single user and all of his/her posts

  receiveUserAndAllPosts: function(userAndPosts) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ADD_USER_OR_ALL_HIS_POSTS,
      userAndPosts: userAndPosts
    });
  },

fetchHashtagAndPosts: function(hashtagAndPosts) {
  AppDispatcher.dispatch({
    actionType: HashtagAndPostConstants.ADD_HASHTAG_AND_POSTS,
    hashtagAndPosts: hashtagAndPosts
  });
},

// Individual user post

  receiveNewPostFromUser: function(userPost) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.ADD_NEW_USER_POST,
      userPost: userPost
    });
  },

  updateOnePost: function(userPost) {
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

  fetchUsersAndHashtagsThatMatchSearch: function(matchedResults) {
    AppDispatcher.dispatch({
      actionType: UserAndPostConstants.BRING_DOWN_MATCHED_USERS_AND_HASHTAGS,
      matchedResults: matchedResults
    });
  },

// Like or Unlike

  fetchLikes: function(likeObject) {
    AppDispatcher.dispatch({
      actionType: LikeConstants.FETCH_LIKE_OBJECT,
      likeObject: likeObject
    });
  },

  like: function(likeObject) {
    AppDispatcher.dispatch({
      actionType: LikeConstants.LIKE,
      likeObject: likeObject
    });
  },

  unlike: function(likeObject) {
    AppDispatcher.dispatch({
      actionType: LikeConstants.UNLIKE,
      likeObject: likeObject
    });
  },

// Follow or Unfollow

  fetchFollow: function(followObject) {
    AppDispatcher.dispatch({
      actionType: FollowConstants.FETCH_FOLLOW_OBJECT,
      followObject: followObject
    });
  },

  toggleFollow: function(followObject) {
    AppDispatcher.dispatch({
      actionType: FollowConstants.TOGGLE_FOLLOW,
      followObject: followObject
    });
  }
};

module.exports = ServerActions;
