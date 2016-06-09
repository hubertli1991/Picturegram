var SessionActions = require('./../actions/session_actions');
var ServerActions = require('../actions/server_actions');

var ErrorActions = require('./../actions/error_actions');

var UserApiUtil = {
  signup: function (formData) {
    $.ajax({
      url: '/api/users',
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

  fetchUserAndPosts: function(id) {
    $.ajax({
      method: 'GET',
      url: '/api/users/' + id,
      success: function(userAndPosts) {

        // var user = {
        //   id: userAndPosts.id,
        //   username: userAndPosts.username
        // };
        //
        // var userPosts = userAndPosts.posts;

        // Add Header stuff later
        // HeaderAction.receiveUser(user);
        
        // We're just going to pass both the user and his or her posts
        // this way we can split up the data at a later point
        ServerActions.receiveUserAndAllPosts(userAndPosts);
      }
    });
  }
};

module.exports = UserApiUtil;
