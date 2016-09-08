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

  fetchFive: function(postId, followingStatus, replaceStore) {
    var id = postId;
    if ( postId === null ) {
      id = "first";
    }

    $.ajax({
      method: 'GET',
      url: 'api/posts/fetch_five/' + id,
      dataType: 'json',
      data: {following_status: followingStatus},
      success: function(fivePosts) {
        // debugger;
        ServerActions.fetchFive(fivePosts, replaceStore);
      }
    });
  },

  createOnePost: function(formData, backToUserPage, closeModal, hashtagsArray) {

    $.ajax({
      method: 'POST',
      url: 'api/posts',
      dataType: "json",
      contentType: false,
      processData: false,
      data: formData,
      success: function(userPost) {
        this.createHashtags( hashtagsArray, userPost.id, backToUserPage, closeModal);
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

  createHashtags: function( hashtagsArray, postId, backToUserPage, closeModal, fetchPost ) {
    // in case there are no hashtags
    if (hashtagsArray.length === 0 && !fetchPost) {
      closeModal();
      backToUserPage();
      return;
    } else if ( hashtagsArray.length === 0 && fetchPost ) {
      this.fetchPost(postId);
      return;
    }

    $.ajax({
      method: 'POST',
      url: 'api/hashtags',
      dataType: 'json',
      data: {hashtags: {post_id: postId, hashtags_array: hashtagsArray}},
      success: function(relationships) {
        this.createPostHashtagRelationship(relationships, backToUserPage, closeModal, postId);
      }.bind(this)
    });
  },

  createPostHashtagRelationship: function(relationships, backToUserPage, closeModal, postId) {
    $.ajax({
      method: 'POST',
      url: 'api/posthashtagrelationships',
      dataType: 'json',
      data: {post_hashtags: {post_id: relationships.post_id, hashtag_id_array: relationships.hashtag_id_array}},
      success: function() {
        closeModal();
        backToUserPage();
        if ( postId ) {
          this.fetchPost(postId);
        }
      }.bind(this)
    });
  },

  fetchPost: function(postId) {
    $.ajax({
      method: 'GET',
      url: '/api/posts/' + postId,
      dataType: 'json',
      success: function(post) {
        // this is correct
        ServerActions.updateOnePost(post);
      }
    });
  },

  updateOnePost: function(caption, postId, hashtagsToBeAdded, hashtagsToBeDestroyed) {
    $.ajax({
      method: 'PATCH',
      url: 'api/posts/' + postId,
      data: {post: {caption: caption}},
      success: function(something) {
        this.deletePostHashtagRelationship(postId, hashtagsToBeAdded, hashtagsToBeDestroyed);
      }.bind(this),
      error: function(xhr) {
        var errors = xhr.responseJSON.errors;
        ErrorActions.setErrors("post", errors);
      }
    });
  },

  deletePostHashtagRelationship: function(postId, hashtagsToBeAdded, hashtagsToBeDestroyed) {
    if ( hashtagsToBeDestroyed.length === 0 ) {
      var fillerFunction = function() {return;};
      var fetchPost = true;
      this.createHashtags(hashtagsToBeAdded, postId, fillerFunction, fillerFunction, fetchPost);
      return;
    }

    var hashtagIdArray = [];
    for (var i = 0; i < hashtagsToBeDestroyed.length; i++) {
      hashtagIdArray.push(hashtagsToBeDestroyed[i].id);
    }

    $.ajax({
      method: 'DELETE',
      url: 'api/posthashtagrelationships/delete_with_postId/' + postId,
      data: {post_hashtags: {hashtag_id_array: hashtagIdArray}},
      success: function(something) {
        // this.createHashtags( hashtagsToBeAdded, postId, fillerFunction, fillerFunction, fetchPost );
        this.deleteHashtag( hashtagsToBeAdded, postId, hashtagIdArray );
      }.bind(this)
    });
  },

  deleteHashtag: function( hashtagsToBeAdded, postId, hashtagIdArray ) {
    // this is just a function that does nothing to replace closeModal and backToUserPage
    var fillerFunction = function() { return; };
    var fetchPost = true;

    $.ajax({
      method: 'DELETE',
      url: 'api/hashtags/delete_many_hashtags/' + postId,
      dataType: 'json',
      data: { hashtags: { hashtag_id_array: hashtagIdArray } },
      success: function() {
        this.createHashtags( hashtagsToBeAdded, postId, fillerFunction, fillerFunction, fetchPost );
      }.bind(this)
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
