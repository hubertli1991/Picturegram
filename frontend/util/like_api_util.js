var LikeActions = require('../actions/like_actions');
var ServerActions = require('../actions/server_actions');

var LikeApiUtil = {

  fetchLikes: function(postId) {
    $.ajax({
      method: 'GET',
      url: 'api/likes/fetch_with_postId/' + postId,
      dataType: 'json',
      success: function(likeObject) {
        // if ( Object.keys(likeObject)[0] === 114) {
        //   console.log( "YES!");
        // }
        // console.log( likeObject );
        ServerActions.fetchLikes(likeObject);
      }
    });
  },

  like: function(postId) {
    $.ajax({
      method: 'POST',
      url: 'api/likes',
      dataType: 'json',
      data: { like: {post_id: postId} },
      success: function(likeObject) {
        // likeObjection: { <postId_number>: {postId: #, count: #, permissionToLike: #}}
        // console.log(likeObject);
        // var key = Object.keys(likeObject)[0];
        // console.log(key);
        // console.log(likeObject[key]);
        ServerActions.like(likeObject);
      }
    });
  },

  unlike: function(postId) {
    $.ajax({
      method: 'DELETE',
      url: 'api/likes/delete_with_postId/' + postId,
      dataType: 'json',
      success: function(likeObject) {
        // debugger;
        ServerActions.unlike(likeObject);
      }
    });
  }
};

module.exports = LikeApiUtil;
