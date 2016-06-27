var AppDispatcher = require('../dispatcher/dispatcher.js');
var Store = require('flux/utils').Store;
var UserAndPostConstants = require('../constants/user_and_post_constants');

var UserStore = new Store(AppDispatcher);

var _users = [];

var replaceWithMatchedUsers = function(matchedUsers) {
  _users = matchedUsers;
};

UserStore.all = function() {
  return _users;
};

UserStore.__onDispatch = function(payload) {
  switch(payload.actionType) {
    case UserAndPostConstants.BRING_DOWN_MATCHED_USERS:
      var matchedUsers = payload.matchedUsers;
      replaceWithMatchedUsers(matchedUsers);
      UserStore.__emitChange();
      break;
  }
};

module.exports = UserStore;
