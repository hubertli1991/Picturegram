var ServerActions = require('../actions/server_actions');

module.exports = {

  fetchHashtagAndPosts: function(hashtagId) {
    $.ajax({
      method: 'GET',
      url: '/api/hashtags/' + hashtagId,
      dataType: 'json',
      success: function(hashtagAndPosts) {
        ServerActions.fetchHashtagAndPosts(hashtagAndPosts);
      }
    });
  }

};
