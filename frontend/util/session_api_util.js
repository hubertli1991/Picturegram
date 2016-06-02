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
				delete currentUserAndPosts.posts;
				var currentUser = currentUserAndPosts;
				SessionActions.receiveCurrentUser(currentUser);
			},
			error: function (xhr) {
			},
      complete: complete
		});
	}
};

module.exports = SessionApiUtil;
