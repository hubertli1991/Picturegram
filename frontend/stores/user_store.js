var AppDispatcher = require('../dispatcher/dispatcher.js');
var Store = require('flux/utils').Store;
var UserAndPostConstants = require('../constants/user_and_post_constants');

var UserStore = new Store(AppDispatcher);

var _users = [];

var replaceWithMatchedUsers = function(matchedResults) {
  _users = matchedResults;
};

UserStore.all = function() {
  return _users;
};

UserStore.topSeven = function() {
  // sort by length
  var matches = [];
  for (var i = 0; i < _users.length; i++) {
    var name = _users[i].username || _users[i].hashtag;
    var length = name.length;
    if ( matches[length] ) {
      matches[length].push(_users[i]);
    } else {
      matches[length] = [ _users[i] ];
    }
  }
  //take top sever
  var topSeven = [];
  var counter = 0;
  for (var j = 0; j < matches.length; j++) {
    if ( matches[j] ) {
      for (var k = 0; k < matches[j].length; k++) {
        topSeven.push(matches[j][k]);
        counter++;
        if (counter >= 7) { return topSeven; }
      }
    }
  }
  return topSeven;
};

UserStore.__onDispatch = function(payload) {
  switch(payload.actionType) {
    case UserAndPostConstants.BRING_DOWN_MATCHED_USERS_AND_HASHTAGS:
      var matchedResults = payload.matchedResults;
      replaceWithMatchedUsers(matchedResults);
      UserStore.__emitChange();
      break;
  }
};

module.exports = UserStore;
