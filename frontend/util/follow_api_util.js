var ServerActions = require('../actions/server_actions');

var FollowApiUtil = {

  fetchFollow: function(userId) {
    $.ajax({
      method: 'GET',
      url: '/api/followings/' + userId,
      dataType: 'json',
      success: function(set) {
        var followObject;
        if ( set.followers[0] ) {
          followObject = set.followers[0];
        } else {
          followObject = {};
        }
        ServerActions.fetchFollow(followObject, userId, null);
      }
    });
  },

  toggleFollow: function(userId, deleteId, onYourOwnPage) {
    $.ajax({
      method: 'POST',
      url: '/api/followings',
      dataType: 'json',
      data: {following: {following_id: userId}},
      success: function( set ) {
        if ( set.followers[0] ) {
          ServerActions.toggleFollow(set.followers[0], userId, null, onYourOwnPage);
        } else {
          // user object associated with userId is to be destroyed
          ServerActions.toggleFollow({}, userId, deleteId, onYourOwnPage);
        }
      }
    });
  },

  fetchFollowersAndFollowees: function(userId) {
    $.ajax({
      method: 'GET',
      url: '/api/followings',
      dataType: 'json',
      data: {user_id: userId},
      success: function(set) {
        ServerActions.fetchFollowersAndFollowees(set, userId);
      }
    });
  }
};

module.exports = FollowApiUtil;
