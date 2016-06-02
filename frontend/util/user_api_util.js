var SessionActions = require('./../actions/session_actions');
var PostActions = require('../actions/post_actions');

var ErrorActions = require('./../actions/error_actions');

var UserApiUtil = {
  signup: function (formData) {
    $.ajax({
      url: '/api/user',
      type: 'POST',
      dataType: 'json',
      data: {user: formData},
      success: function (currentUser) {
        SessionActions.receiveCurrentUser(currentUser);
      },
      error: function (xhr) {
        var errors = xhr.responseJSON;
        ErrorActions.setErrors("signup", errors);
      }
    });
  },

  fetchUser: function(user) {
    $.ajax({
      method: 'GET',
      url: '/api/user/' + user.id,
      success: function(currentUserAndPosts) {

        var user = {
          id: currentUserAndPosts.id,
          username: currentUserAndPosts.username
        };

        var userPosts = currentUserAndPosts.posts;

        // Add Header stuff later
        // HeaderAction.receiveUser(user);
        PostActions.receiveAllPostsFromUser(userPosts);
      }
    });
  }
};

module.exports = UserApiUtil;
