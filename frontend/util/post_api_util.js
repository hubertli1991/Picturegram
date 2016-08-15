var ServerActions = require('../actions/server_actions');
var ErrorActions = require('./../actions/error_actions');

var PostApiUtil = {

  fetchAllPosts: function() {
    $.ajax({
      method: 'GET',
      url: 'api/posts',
      success: function(allPosts) {
        ServerActions.fetchAllPosts(allPosts);
      }
    });
  },

  createOnePost: function(formData, backToUserPage, closeModal) {
    $.ajax({
      method: 'POST',
      url: 'api/posts',
      dataType: "json",
      contentType: false,
      processData: false,
      data: formData,
      success: function(userPost) {
        closeModal();
        // ServerActions.receiveNewPostFromUser(userPost);
        // send client to the user homepage
        backToUserPage();
      },
      error: function(xhr) {
        var errors = xhr.responseJSON.errors;
        ErrorActions.setErrors("post", errors);
      }
    });
  },

  updateOnePost: function(caption) {
    $.ajax({
      method: 'PATCH',
      url: 'api/posts/' + post.id,
      data: {post: {caption: caption}},
      success: function(userPost) {
        ServerActions.updatePostFromUser(userPost);
      }
    });
  },

  deleteOnePost: function(id) {
    $.ajax({
      method: 'DELETE',
      url: '/api/posts/' + id,
      success: function(userPost) {
        ServerActions.deletePostFromUser(userPost);
      }
    });
  }
};

module.exports = PostApiUtil;
