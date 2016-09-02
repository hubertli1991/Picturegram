var React = require('react');
var ClientActions = require('../actions/client_actions');
// var PostStore = require('../stores/post_store');

var Helpers = require('../helpers/helpers');

var UpdateCaptionForm = React.createClass({

  getInitialState: function() {
    return { caption: "", postId: this.props.postId, hashtags: this.props.hashtags };
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
      var hashtagsToBeAdded = Helpers.parseHashtags(this.state.caption);
      var hashtagsToBeDestroyed = this.state.hashtags;
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
