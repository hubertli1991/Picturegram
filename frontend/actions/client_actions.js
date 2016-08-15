var PostApiUtil = require('../util/post_api_util');
var UserApiUtil = require('../util/user_api_util');
var CommentApiUtil = require('../util/comment_api_util');

module.exports = {

  fetchUserAndPosts: function(id) {
    UserApiUtil.fetchUserAndPosts(id);
  },

  fetchAllPosts: function() {
    PostApiUtil.fetchAllPosts();
  },

  createOnePost: function(formData, backToUserPage, closeModal) {
    PostApiUtil.createOnePost(formData, backToUserPage, closeModal);
  },

  updateOnePost: function(caption) {
    PostApiUtil.updateOnePost(caption);
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
  }
};
