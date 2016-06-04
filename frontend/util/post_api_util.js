var ServerActions = require('../actions/server_actions');

var PostApiUtil = {

  createOnePost: function(formData) {
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
