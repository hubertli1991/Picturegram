var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var ErrorConstants = require('../constants/error_constants');
var ErrorStore = new Store(AppDispatcher);

var _errors = {};
var _form = "";

// ErrorStore.formErrors = function (form) {
//   if (form !== _form) {
//     return {};
//   }
//
//   var result = {};
//
//   var errors;
//   Object.keys(_errors).forEach(function (field) {
//     errors = _errors[field];
//     result[field] = errors.slice();
//   });
//
//   return result;
// };
//
// ErrorStore.form = function () {
//   return _form.slice();
// };

ErrorStore.extractErrorMessage = function(errorType) {
  if (_errors && _errors[errorType]) {
    return _errors[errorType];
  } else {
    return "";
  }
};

ErrorStore.clearErrors = function() {
    _errors = {};
    _form = "";
};

ErrorStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case ErrorConstants.SET_ERRORS:
      _errors = payload.errors;
      _form = payload.form;
      ErrorStore.__emitChange();
      break;
  }
};

module.exports = ErrorStore;
