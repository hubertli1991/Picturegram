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
        var errors = xhr.responseJSON.errors;
	      ErrorActions.setErrors("login", errors);
			}
		});
	},

	logout: function (backToRootPage) {
		$.ajax({
      method: 'delete',
			url: '/api/session',
			success: function () {
        SessionActions.removeCurrentUser();
				backToRootPage();
      },
			error: function (xhr) {
			}
		});
	},

	fetchCurrentUser: function(redirectIfNotLoggedIn) {

		$.ajax({
      method: 'GET',
			url: '/api/session',
			success: function (currentUserAndPosts) {
				// Sign user in
				// Not Session Api Util's job to send current user's posts
				var currentUser = {
					id: currentUserAndPosts.id,
					username: currentUserAndPosts.username,
					bio: currentUserAndPosts.bio,
					profile_picture_url_regular: currentUserAndPosts.profile_picture_url_regular
				};
				SessionActions.receiveCurrentUser(currentUser);

				// this callback allows us to refresh the page
				if ( redirectIfNotLoggedIn ) {
					redirectIfNotLoggedIn();
				}

				// send all current user's posts to post store
				// PostActions.receiveAllPostsFromUser(currentUserAndPosts.posts);
			},
			error: function (xhr) {
			}
			//
      // complete: function() {
			// 	complete && complete();
			// }
		});
	}
};

module.exports = SessionApiUtil;
