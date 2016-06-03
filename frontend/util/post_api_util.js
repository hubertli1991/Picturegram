var ServerActions = require('../actions/server_actions');

var PostApiUtil = {

  createOnePost: function(post) {
    $.ajax({
      method: 'POST',
      url: 'api/posts',
      data: {post: post},
      success: function(userPost) {
        ServerActions.receiveNewPostFromUser(userPost);
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
