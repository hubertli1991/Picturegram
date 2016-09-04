var React = require('react');
var ClientActions = require('../actions/client_actions');
var ErrorStore = require('../stores/error_store');
// var PostStore = require('../stores/post_store');

var Helpers = require('../helpers/helpers');

var UpdateCaptionForm = React.createClass({

  getInitialState: function() {
    return { caption: this.props.caption, postId: this.props.postId, hashtags: this.props.hashtags, location: this.props.location };
  },

  className: function() {
    var className = {
      postEditForm: "post-edit-form",
      closePostEditForm: "close-post-edit-form",
      postEditFormText: "post-edit-form-text",
      postEditFormError: "post-edit-form-error"
    };

    if ( this.state.location === "home" ) {
      className = {
        postEditForm: "post-edit-form-home",
        closePostEditForm: "close-post-edit-form-home",
        postEditFormText: "post-edit-form-text-home",
        postEditFormError: "post-edit-form-error-home"
      };
    }

    return className;
  },

  componentDidMount: function() {
    this.errorStoreListener = ErrorStore.addListener(this.forceUpdate.bind(this));
  },

  componentWillUnmount: function() {
    this.errorStoreListener.remove();
  },

  captionChange: function(e) {
    var newCaption = e.target.value;
    this.setState({caption: newCaption});
  },

  handleKeyDown: function(e) {
    if ( e.keyCode === 13 ) {
      e.preventDefault();
      var newHashtags = Helpers.parseHashtags(this.state.caption);
      var oldHashtags = this.state.hashtags;

      var hashtagsToStay = { new: {}, old: {} };

      for (var i = 0; i < newHashtags.length; i++) {
        for (var j = 0; j < oldHashtags.length; j++) {
          if ( newHashtags[i][0].toLowerCase() === oldHashtags[j].hashtag.toLowerCase() ) {
            hashtagsToStay.new[newHashtags[i]] = false;
            hashtagsToStay.old[oldHashtags[j].hashtag] = false;
            break;
          }
        }
        j = 0;
      }

      var hashtagsToBeAdded = [];
      var hashtagsToBeDestroyed = [];

      for (var k = 0; k < Math.max(newHashtags.length, oldHashtags.length); k++) {
        if ( newHashtags[k] && hashtagsToStay.new[newHashtags[k]] === undefined ) {
          hashtagsToBeAdded.push(newHashtags[k]);
        }
        if ( oldHashtags[k] && hashtagsToStay.old[oldHashtags[k].hashtag] === undefined ) {
          hashtagsToBeDestroyed.push(oldHashtags[k]);
        }
      }

      ClientActions.updateOnePost(this.state.caption, this.state.postId, hashtagsToBeAdded, hashtagsToBeDestroyed);
    }
  },

  renderErrors: function(errorType) {
    var errorMessage = ErrorStore.extractErrorMessage(errorType);
    if ( errorMessage ) {
      return (<p className={ this.className().postEditFormError }>{errorMessage}</p>);
    }
  },

  render: function() {

    // var className = []

    return (
      <div className={ this.className().postEditForm }>
        <div className={ this.className().closePostEditForm }/>
        <textarea className={ this.className().postEditFormText }type="text" placeholder="Write a new caption..." value={this.state.caption} onChange={this.captionChange} onKeyDown={this.handleKeyDown}/>
        {this.renderErrors("postCaptionError")}
      </div>
    );
  }
});

module.exports = UpdateCaptionForm;
