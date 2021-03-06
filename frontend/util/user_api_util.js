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
        var errors = xhr.responseJSON.errors;
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
  },

  updateUserProfile: function(currentUserId, profileFormData, closeModal) {
    $.ajax({
      url: '/api/users/' + currentUserId,
      method: 'PATCH',
      dataType: 'json',
      contentType: false,
      processData: false,
      data: profileFormData,
      success: function(userAndPosts) {
        closeModal();
        // not going to allow for null's
        if ( userAndPosts.bio === "null" ) {
          userAndPosts.bio = "";
        }
        ServerActions.receiveUserAndAllPosts(userAndPosts);
      },
      error: function(xhr) {
        var errors = { "profileError": "Please upload a profile image"};
        ErrorActions.setErrors("profile", errors);
      }
    });
  },

  fetchUsersThatMatchSearch: function(searchValue) {
    if (searchValue === "") {
      // skip backend if the search value is ""
      ServerActions.fetchUsersAndHashtagsThatMatchSearch([]);
    } else {
      $.ajax({
        url: '/api/users/search',
        method: 'GET',
        dataType: 'json',
        data: {user: {username: searchValue}},
        success: function(matchedUsers) {
          this.fetchHashtagsThatMatchSearch(searchValue, matchedUsers);
          // ServerActions.fetchUsersThatMatchSearch(matchedUsers);
        }.bind(this)
      });
    }
  },

  fetchHashtagsThatMatchSearch: function(searchValue, matchedUsers) {
    $.ajax({
      url: '/api/hashtags/search',
      method: 'GET',
      dataType: 'json',
      data: {hashtag: {search_value: searchValue}},
      success: function(matchedHashtags) {
        var matchedResults = matchedUsers.concat(matchedHashtags);
        ServerActions.fetchUsersAndHashtagsThatMatchSearch(matchedResults);
      }
    });
  }
};

// window.api = UserApiUtil;

module.exports = UserApiUtil;
