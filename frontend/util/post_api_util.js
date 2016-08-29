var ServerActions = require('../actions/server_actions');
var ErrorActions = require('./../actions/error_actions');

var PostApiUtil = {

  fetchAllPosts: function() {
    $.ajax({
      method: 'GET',
      url: 'api/posts',
      success: function(allPosts) {
        ServerActions.fetchAllPosts(allPosts);
      }
    });
  },

  fetchFive: function(postId, replaceStore) {
    var id = postId;
    if ( postId === null ) {
      id = "first";
    }

    $.ajax({
      method: 'GET',
      url: 'api/posts/fetch_five/' + id,
      dataType: 'json',
      success: function(fivePosts) {
        ServerActions.fetchFive(fivePosts, replaceStore);
      }
    });
  },

  createOnePost: function(formData, backToUserPage, closeModal, hashtagsArray) {

    // if ( formData ) {
    //   console.log(hashtags);
    //   return;
    // }

    $.ajax({
      method: 'POST',
      url: 'api/posts',
      dataType: "json",
      contentType: false,
      processData: false,
      data: formData,
      success: function(userPost) {
        this.createHashtags( backToUserPage, closeModal, hashtagsArray, userPost.id );
        // closeModal();
        // ServerActions.receiveNewPostFromUser(userPost);
        // send client to the user homepage
        // backToUserPage();
      }.bind(this),
      error: function(xhr) {
        var errors = xhr.responseJSON.errors;
        ErrorActions.setErrors("post", errors);
      }
    });
  },

  createHashtags: function( backToUserPage, closeModal, hashtagsArray, postId ) {
    // in case there are no hashtags
    if (hashtagsArray.length === 0) {
      closeModal();
      backToUserPage();
      return;
    }

    $.ajax({
      method: 'POST',
      url: 'api/hashtags',
      dataType: 'json',
      data: {hashtags: {post_id: postId, hashtags_array: hashtagsArray}},
      success: function(relationships) {
        this.createPostHashtagRelationship(backToUserPage, closeModal, relationships);
      }.bind(this)
    });
  },

  createPostHashtagRelationship: function(backToUserPage, closeModal, relationships) {
    $.ajax({
      method: 'POST',
      url: 'api/posthashtagrelationships',
      dataType: 'json',
      data: {post_hashtag: {post_id: relationships.post_id, hashtag_id_array: relationships.hashtag_id_array}},
      success: function() {
        closeModal();
        backToUserPage();
      }
    });
  },

  updateOnePost: function(caption) {
    $.ajax({
      method: 'PATCH',
      url: 'api/posts/' + post.id,
      data: {post: {caption: caption}},
      success: function(userPost) {
        ServerActions.updatePostFromUser(userPost);
      }
    });
  },

  deleteOnePost: function(id) {
    $.ajax({
      method: 'DELETE',
      url: '/api/posts/' + id,
      success: function(userPost) {
        ServerActions.deletePostFromUser(userPost);
      }
    });
  }
};

module.exports = PostApiUtil;
