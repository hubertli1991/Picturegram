var ServerActions = require('../actions/server_actions');

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

  createOnePost: function(formData, backToUserPage) {
    $.ajax({
      method: 'POST',
      url: 'api/posts',
      dataType: "json",
      contentType: false,
      processData: false,
      data: formData,
      success: function(userPost) {
        // ServerActions.receiveNewPostFromUser(userPost);
        // send client to the user homepage
        backToUserPage();
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
