var SessionActions = require('./../actions/session_actions');
var ErrorActions = require('./../actions/error_actions');

var SessionApiUtil = {
	login: function (credentials) {
		$.ajax({
      method: 'POST',
			url: '/api/session',
			data: {user: credentials},
			success: function (currentUser) {
        SessionActions.receiveCurrentUser(currentUser);
      },
			error: function (xhr) {
        var errors = xhr.responseJSON;
	      ErrorActions.setErrors("login", errors);
			}
		});
	},

	logout: function () {
		$.ajax({
      method: 'delete',
			url: '/api/session',
			success: function () {
        SessionActions.removeCurrentUser();
      },
			error: function () {
			}
		});
	},

	fetchCurrentUser: function (complete) {
		$.ajax({
      method: 'GET',
			url: '/api/session',
			success: function (currentUserAndPosts) {
				// Sign user in
				// Not Session Api Util's job to send current user's posts
				var currentUser = {
					id: currentUserAndPosts.id,
					username: currentUserAndPosts.username
				};
				SessionActions.receiveCurrentUser(currentUser);

				// send all current user's posts to post store
				// PostActions.receiveAllPostsFromUser(currentUserAndPosts.posts);
			},
			error: function (xhr) {
			},
      complete: complete
		});
	}
};

module.exports = SessionApiUtil;
