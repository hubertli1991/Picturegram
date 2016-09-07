var ServerActions = require('../actions/server_actions');

var FollowApiUtil = {

  fetchFollow: function(userId) {
    $.ajax({
      method: 'GET',
      url: '/api/followings/' + userId,
      dataType: 'json',
      success: function(set) {
        ServerActions.fetchFollow(set.followers[0]);
      }
    });
  },

  toggleFollow: function(userId, deleteId) {
    $.ajax({
      method: 'POST',
      url: '/api/followings',
      dataType: 'json',
      data: {following: {following_id: userId}},
      success: function( set ) {
        // debugger;
        if ( set.followers[0] ) {
          ServerActions.toggleFollow(set.followers[0]);
        } else {
          // user object associated with userId is to be destroyed
          ServerActions.toggleFollow(set.followers[0], deleteId);
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
        // var set = {};
        // for (var i = 0; i < array.length; i++) {
        //   set[array[i].id] = array[i];
        // }
        // console.log(array);
        // console.log(set);
        // console.log(object);
        ServerActions.fetchFollowersAndFollowees(set);
      }
    });
  }
};

module.exports = FollowApiUtil;
