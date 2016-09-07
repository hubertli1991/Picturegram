var Store = require('flux/utils').Store;
var FollowConstants = require('../constants/follow_constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');

var FollowStore = new Store(AppDispatcher);

var _follows = {};

var _allFollowers = {};

var _allFollowing = {};

var updateFollows = function(followObject, deleteId) {
  // console.log(followObject);
  // console.log(deleteId);
  if ( followObject ) {
    _allFollowers[followObject.id] = followObject;
  }
  if ( deleteId ) {
    delete _allFollowers[deleteId];
  }
};

var updatePile = function( set ) {
  var followers = {};
  var following = {};
  var types = ["followers", "followees"];
  var objects = [ followers, following ];
  for (var i = 0; i < Math.max( set.followers.length, set.followees.length ); i++) {
    for (var j = 0; j < types.length; j++) {
      if ( set[types[j]][i] ) {
        objects[j][set[types[j]][i].id] = set[types[j]][i];
      }
    }
  }
  _allFollowers = followers;
  _allFollowing = following;
};

FollowStore.fetchFollowStatus = function(followingId) {
  return _allFollowers[followingId];
};

FollowStore.fetchCount = function() {
  return { followersCount: Object.keys(_allFollowers).length, followingCount: Object.keys(_allFollowing).length };
};

FollowStore.__onDispatch = function(payload) {
  switch( payload.actionType ) {
    case FollowConstants.FETCH_FOLLOW_OBJECT:
      updateFollows(payload.followObject);
      FollowStore.__emitChange();
    break;
    case FollowConstants.TOGGLE_FOLLOW:
      updateFollows(payload.followObject, payload.deleteId);
      FollowStore.__emitChange();
    break;
    case FollowConstants.ALL_FOLLOWERS_AND_FOLLOWEES:
      updatePile( payload.set );
      FollowStore.__emitChange();
    break;
  }
};

module.exports = FollowStore;
