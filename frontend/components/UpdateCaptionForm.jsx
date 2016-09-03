var React = require('react');
var ClientActions = require('../actions/client_actions');
// var PostStore = require('../stores/post_store');

var Helpers = require('../helpers/helpers');

var UpdateCaptionForm = React.createClass({

  getInitialState: function() {
    return { caption: this.props.caption, postId: this.props.postId, hashtags: this.props.hashtags };
  },

  // componentWillRecieveProps: function(newProp) {
  //   this.setState({ caption: "", postId: newProp.postId, hashtag: newProp.hashtags });
  // },

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
            hashtagsToStay.old[oldHashtags[j]] = false;
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
        if ( oldHashtags[k] && hashtagsToStay.old[oldHashtags[k]] === undefined ) {
          hashtagsToBeDestroyed.push(oldHashtags[k]);
        }
      }

      ClientActions.updateOnePost(this.state.caption, this.state.postId, hashtagsToBeAdded, hashtagsToBeDestroyed);
    }
  },

  render: function() {
    return (
      <textarea className="post-edit-form-text" type="text" placeholder="Write a new caption..." value={this.state.caption} onChange={this.captionChange} onKeyDown={this.handleKeyDown}/>
    );
  }
});

module.exports = UpdateCaptionForm;
