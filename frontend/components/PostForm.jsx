var React = require('react');
var PostStore = require('../stores/post_store');
var ErrorStore = require('./../stores/error_store');
var ClientActions = require('../actions/client_actions');

var Helpers = require('../helpers/helpers');

// Modal Require Start
var Modal = require("react-modal");
var _Post_Modal_Style = require("../modal_styles/post_modal_styles");
// Modal Require End


var PostForm = React.createClass({

  contextTypes: {
  router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      // works when you replace this.props.id with a number
      // move the PostForm into the proper place
      user_id: parseInt(this.props.userId),
      caption: "",
      imageFile: null,
      imageUrl: null,
      modalOpen: false
    };
  },

  componentDidMount: function () {
    this.errorListener = ErrorStore.addListener(this.forceUpdate.bind(this));
  },

  componentWillUnmount: function () {
    this.errorListener.remove();
  },


  closeModal: function(){
    ErrorStore.clearErrors();
    this.setState({ modalOpen: false, caption: "", imageUrl: null, imageFile: null });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },


  captionChange: function(e) {
    var newCaption = e.target.value;
    this.setState({caption: newCaption});
  },

  updateFile: function(e) {
    var file = e.currentTarget.files[0];
    // setup preview
    // FileReader is a constructor built into Javascript
    var fileReader = new FileReader();
    fileReader.onloadend = function() {
      this.setState({ imageFile: file, imageUrl: fileReader.result });
    }.bind(this);

    // to actually run the function
    if (file) {
      fileReader.readAsDataURL(file);
    }
  },

  renderErrors: function(errorType) {
    var errorMessage = ErrorStore.extractErrorMessage(errorType);
    if ( errorMessage ) {
      return (<p className="login-form-error">{errorMessage}</p>);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var hashtagsArray = Helpers.parseHashtags(this.state.caption);

    var formData = new FormData();
    // formData.append("post[user_id]", this.state.user_id);
    formData.append("post[caption]", this.state.caption);
    formData.append("post[image]", this.state.imageFile);
    ClientActions.createOnePost(formData, this.backToUserPage, this.closeModal, hashtagsArray);
  },

  backToUserPage: function() {
    this.context.router.push("/users/" + this.state.user_id);
  },

  render: function() {
    return(
      <div className="post-form">
        <div className="post-form-button">
          <button className="fa fa-camera" onClick={this.openModal} value="Post Photo"/>
        </div>

        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}
          style={_Post_Modal_Style}>

          <div className="modal-body">

            <div className="image-preview-box">
              <img className="image-preview" src={this.state.imageUrl}/>
            </div>

            <div className="post-form-text">
              <p className="post-form-header">Post a Picture</p>
              <form className="post-form-boxes" onSubmit={this.handleSubmit}>
                <input className="choose-file" type="file" placeholder="image file" onChange={this.updateFile} />
                { this.renderErrors("postImageError") }
                <textarea className="upload-image-caption" type="text" placeholder="Add a caption..." value={this.state.caption} onChange={this.captionChange}/>
                { this.renderErrors("postCaptionError") }
                <input className="post-form-submit-button" type="submit" value="Add Post"/>
              </form>
            </div>

          </div>

        </Modal>
      </div>
    );
  }
});

module.exports = PostForm;
