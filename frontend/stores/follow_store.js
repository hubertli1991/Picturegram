var Store = require('flux/utils').Store;
var FollowConstants = require('../constants/follow_constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');


var FollowStore = new Store(AppDispatcher);

var _follows = {};

var _allFollowers = {};

var _allFollowing = {};

var updateFollows = function(yourObject, otherUserObject, userId, currentUserId) {
  if ( _allFollowers[userId] === undefined ) {
    _allFollowers[userId] = {};
    // to pervent fetchCount from erroring out at _allFollowing[userId]
    // also I want user follower following object to be complete
    _allFollowing[userId] = {};
  }

  if ( _allFollowers[currentUserId] === undefined ) {
    _allFollowers[currentUserId] = {};
    _allFollowing[currentUserId] = {};
  }

  if ( yourObject ) {
    _allFollowers[userId][currentUserId] = yourObject;
    _allFollowing[currentUserId][userId] = otherUserObject;
  } else if ( yourObject === null ) {
    // MUST be null to delete
    delete _allFollowers[userId][currentUserId];
    delete _allFollowing[currentUserId][userId];
  }


  // if ( onYourOwnPage ) {
  //   // deleteId is really just YOUR OWN id
  //   // if you click follow button on your own page, you can ONLY affect the set of people you are FOLLOWING
  //   // on other people's page, you can only affect their set of followers
  //   if ( deleteId ) {
  //     delete _allFollowing[deleteId][userId];
  //   } else {
  //     if ( followObject.id ) {
  //       // if followObject === {}, we do nothing
  //       _allFollowing[deleteId][followObject.id] = followObject;
  //     }
  //   }
  // } else {
  //   if ( deleteId ) {
  //     delete _allFollowers[userId][deleteId];
  //     delete _allFollowing[deleteId][userId];
  //   } else {
  //     if ( followObject.id ) {
  //       // if followObject === {}, we do nothing
  //       _allFollowers[userId][followObject.id] = followObject;
  //       _allFollowing[deleteId][followObject.id] = followObject;
  //     }
  //   }
  // }

};

var updatePile = function( set, userId ) {
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
  // looks something like allFollowers = { userId: { followerId: { his/her data }, anotherFollowerId: { his/her data } ... } }
  _allFollowers[userId] = followers;
  _allFollowing[userId] = following;
};

FollowStore.fetchFollowStatus = function( userId, currentUserId ) {
  if ( _allFollowers[userId] && _allFollowers[userId][currentUserId] ) {
    // the first condition accounts of mulitple asyn calls on Index page
    // second condition ensures _allFollowers[userId] !== {}
    return true;
  } else {
    return false;
  }
};

FollowStore.fetchCount = function( userId ) {
  return { followersCount: Object.keys(_allFollowers[userId]).length, followingCount: Object.keys(_allFollowing[userId]).length };
};

FollowStore.fetchAllUsers = function( userId, type ) {
  if ( type === "followers" ) {
    return _allFollowers[userId];
  } else if ( type === "following" ) {
    return _allFollowing[userId];
  }
};

FollowStore.__onDispatch = function(payload) {
  switch( payload.actionType ) {
    case FollowConstants.FETCH_FOLLOW_OBJECT:
      updateFollows(payload.yourObject, payload.otherUserObject, payload.userId, payload.currentUserId);
      FollowStore.__emitChange();
    break;
    case FollowConstants.TOGGLE_FOLLOW:
      updateFollows(payload.yourObject, payload.otherUserObject, payload.userId, payload.currentUserId);
      FollowStore.__emitChange();
    break;
    case FollowConstants.ALL_FOLLOWERS_AND_FOLLOWEES:
      updatePile( payload.set, payload.userId );
      FollowStore.__emitChange();
    break;
  }
};

module.exports = FollowStore;
