var ServerActions = require('../actions/server_actions');

var FollowApiUtil = {

  fetchFollow: function(userId, currentUserId) {
    $.ajax({
      method: 'GET',
      url: '/api/followings/' + userId,
      dataType: 'json',
      success: function(set) {
        var yourObject;
        var otherUserObject;
        if ( set.followers[0] ) {
          yourObject = set.followers[0];
          otherUserObject = set.followees[0];
        } else {
          yourObject = "";
          otherUserObject = "";
        }
        ServerActions.fetchFollow(yourObject, otherUserObject, userId, currentUserId);
      }
    });
  },

  toggleFollow: function(userId, currentUserId) {
    $.ajax({
      method: 'POST',
      url: '/api/followings',
      dataType: 'json',
      data: {following: {following_id: userId}},
      success: function( set ) {
        if ( set.followers[0] ) {
          ServerActions.toggleFollow(set.followers[0], set.followees[0], userId, currentUserId);
        } else {
          // user object associated with userId is to be destroyed
          ServerActions.toggleFollow(null, null, userId, currentUserId);
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
