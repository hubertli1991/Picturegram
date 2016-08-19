var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher.js');
var LikeConstants = require('../constants/like_constants');

var LikeStore = new Store(AppDispatcher);

var _likes = {};

var updatePostLikes = function(likeObject) {
  var postId = Object.keys(likeObject)[0];
  _likes[postId] = likeObject[postId];
  // debugger;
};

LikeStore.fetchLikeObject = function(postId) {
  // console.log(postId);
  // console.log(_likes[postId]);
  return _likes[postId];
};

LikeStore.__onDispatch = function(payload) {
  switch(payload.actionType) {
    case LikeConstants.FETCH_LIKE_OBJECT:
      updatePostLikes(payload.likeObject);
      LikeStore.__emitChange();
      break;
    case LikeConstants.LIKE:
      updatePostLikes(payload.likeObject);
      LikeStore.__emitChange();
      break;
    case LikeConstants.UNLIKE:
      updatePostLikes(payload.likeObject);
      LikeStore.__emitChange();
      break;
  }
};

module.exports = LikeStore;
