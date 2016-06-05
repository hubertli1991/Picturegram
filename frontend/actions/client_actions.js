var PostApiUtil = require('../util/post_api_util');
var UserApiUtil = require('../util/user_api_util');

module.exports = {

  fetchUserAndPosts: function(id) {
    UserApiUtil.fetchUserAndPosts(id);
  },

  createOnePost: function(formData, backToUserPage) {
    PostApiUtil.createOnePost(formData, backToUserPage);
  },

  updateOnePost: function(caption) {
    PostApiUtil.updateOnePost(caption);
  },

  deleteOnePost: function(id) {
    PostApiUtil.deleteOnePost(id);
  }
};
