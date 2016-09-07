var ServerActions = require('../actions/server_actions');

var FollowApiUtil = {

  fetchFollow: function(userId) {
    $.ajax({
      method: 'GET',
      url: '/api/followings/' + userId,
      dataType: 'json',
      success: function(followObject) {
        ServerActions.fetchFollow(followObject);
      }
    });
  },

  toggleFollow: function(userId) {
    $.ajax({
      method: 'POST',
      url: '/api/followings',
      dataType: 'json',
      data: {following: {following_id: userId}},
      success: function( followObject ) {
        ServerActions.toggleFollow(followObject);
      }
    });
  }

};

module.exports = FollowApiUtil;
