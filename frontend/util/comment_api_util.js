var ServerActions = require('../actions/server_actions');

var CommentApiUtil = {
  createOneComment: function(commentFormData) {
    $.ajax({
      method: 'POST',
      url: 'api/comments',
      dataType: "json",
      data: { comment: commentFormData },
      success: function(post) {
        // Should maybe write another function like updatePost. UpdatePostFromUser
        // should be reserved for the user himself
        ServerActions.updatePostFromUser(post);
      }
    });
  }
};

module.exports = CommentApiUtil;
