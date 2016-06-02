var PostAction = require('../actions/post_actions');

var PostApiUtil = {

  createOnePost: function(post) {
    $.ajax({
      method: 'POST',
      url: 'api/posts',
      data: {post: post},
      success: function(userPost) {
        PostActions.receiveNewPostFromUser(userPost);
      }
    });
  },

  updateOnePost: function(caption) {
    $.ajax({
      method: 'PATCH',
      url: 'api/posts/' + post.id,
      data: {post: {caption: caption}},
      success: function(userPost) {
        PostAction.updatePostFromUser(userPost);
      }
    });
  },

  deleteOnePost: function(id) {
    $.ajax({
      method: 'DELETE',
      url: '/api/posts/' + id,
      success: function(userPost) {
        PostActions.deletePostFromUser(userPost);
      }
    });
  }
};

module.exports = PostApiUtil;
