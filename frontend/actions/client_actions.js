var PostApiUtil = require('../util/post_api_util');
var UserApiUtil = require('../util/user_api_util');
var CommentApiUtil = require('../util/comment_api_util');
var LikeApiUtil = require('../util/like_api_util');
var HashtagApiUtil = require('../util/hashtag_api_util');
var FollowApiUtil = require('../util/follow_api_util');

module.exports = {

  fetchUserAndPosts: function(id) {
    UserApiUtil.fetchUserAndPosts(id);
  },

  fetchHashtagAndPosts: function(hashtagId) {
    HashtagApiUtil.fetchHashtagAndPosts(hashtagId);
  },

  fetchAllPosts: function() {
    PostApiUtil.fetchAllPosts();
  },

  fetchFive: function(postId, followingStatus, replaceStore) {
    PostApiUtil.fetchFive(postId, followingStatus, replaceStore);
  },

  createOnePost: function(formData, backToUserPage, closeModal, hashtagsArray) {
    PostApiUtil.createOnePost(formData, backToUserPage, closeModal, hashtagsArray);
  },

  updateOnePost: function(caption, postId, hashtagsToBeAdded, hashtagsToBeDestroyed) {
    PostApiUtil.updateOnePost(caption, postId, hashtagsToBeAdded, hashtagsToBeDestroyed);
  },

  deleteOnePost: function(id) {
    PostApiUtil.deleteOnePost(id);
  },

  createOneComment: function(commentFormData) {
    CommentApiUtil.createOneComment(commentFormData);
  },

  updateCurrentUser: function(currentUserId, profileFormData, closeModal) {
    UserApiUtil.updateUserProfile(currentUserId, profileFormData, closeModal);
  },

  fetchUsersThatMatchSearch: function(searchValue) {
    UserApiUtil.fetchUsersThatMatchSearch(searchValue);
  },

  fetchLikes: function(postId) {
    LikeApiUtil.fetchLikes(postId);
  },

  like: function(postId) {
    LikeApiUtil.like(postId);
  },

  unlike: function(postId) {
    LikeApiUtil.unlike(postId);
  },

  fetchFollow: function(userId) {
    FollowApiUtil.fetchFollow(userId);
  },

  toggleFollow: function(userId, deleteId, onYourOwnPage) {
    FollowApiUtil.toggleFollow(userId, deleteId, onYourOwnPage);
  },

  fetchFollowersAndFollowees: function(userId) {
    FollowApiUtil.fetchFollowersAndFollowees(userId);
  }
};
