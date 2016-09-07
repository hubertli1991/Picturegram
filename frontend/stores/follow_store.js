var Store = require('flux/utils').Store;
var FollowConstants = require('../constants/follow_constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');

var FollowStore = new Store(AppDispatcher);

var _follows = {};

var updateFollows = function(followObject) {
  console.log(followObject);
  _follows[followObject.followingId] = followObject;
};

FollowStore.fetchFollowStatus = function(followingId) {
  // debugger;
  return _follows[followingId].currentlyFollowing;
};

FollowStore.__onDispatch = function(payload) {
  switch( payload.actionType ) {
    case FollowConstants.FETCH_FOLLOW_OBJECT:
      updateFollows(payload.followObject);
      FollowStore.__emitChange();
    break;
    case FollowConstants.TOGGLE_FOLLOW:
      updateFollows(payload.followObject);
      FollowStore.__emitChange();
    break;
  }
};

module.exports = FollowStore;
