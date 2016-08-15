var React = require('react');
var PostStore = require('../stores/post_store');
var SessionStore = require('../stores/session_store');
var ClientActions = require('../actions/client_actions');
// Modal Require Start
var Modal = require("react-modal");
var _Post_Modal_Style = require("../modal_styles/post_modal_styles");
// Modal Require End

var ProfileForm = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    // this.props.userId is the currentUser's id. It's passed as a PostIndex prop
    // parseInt(this.props.userId)
    return {
      user_id: this.props.user.id,
      bio: this.props.user.bio,
      imageFile: this.props.user.profile_picture_url_regular,
      imageUrl: this.props.user.profile_picture_url_regular,
      modalOpen: false
    };
  },
  

  closeModal: function(){
    this.setState({ modalOpen: false, bio: this.props.user.bio });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },


  bioChange: function(e) {
    var newBio = e.target.value;
    this.setState({bio: newBio});
  },

  updateFile: function(e) {
    var file = e.currentTarget.files[0] || this.state.imageUrl;
    // setup preview
    // FileReader is a constructor built into Javascript
    var fileReader = new FileReader();
    fileReader.onloadend = function() {
      var imageUrlValue = fileReader.result || this.state.imageUrl;
      this.setState({ imageFile: file, imageUrl: imageUrlValue });
    }.bind(this);

    // to actually run the function
    if (file) {
      fileReader.readAsDataURL(file);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    // var newPost = {
    //   image_url: this.state.imageFile,
    //   caption: this.state.caption
    // };
    this.closeModal();
    var profileFormData = new FormData();
    // profileFormData.append("post[user_id]", this.state.user_id);
    profileFormData.append("user[bio]", this.state.bio);
    profileFormData.append("user[profile_picture]", this.state.imageFile );
    ClientActions.updateCurrentUser(this.state.user_id, profileFormData);
  },

  render: function() {
    // Re-use the Post Modal Styles
    // Re-use upload-image-caption css style for bio

    return(
      <div className="profile-form">
        <button className="profile-form-button" onClick={this.openModal} > Edit Profile </button>

        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}
          style={_Post_Modal_Style}>

          <div className="modal-body">

            <div className="image-preview-box">
              <img className="image-preview" src={this.state.imageUrl}/>
            </div>

            <div className="post-form-text">
              <p className="post-form-header">Update Profile</p>
              <form className="post-form-boxes" onSubmit={this.handleSubmit}>
                <input className="choose-file" type="file" placeholder="image file" onChange={this.updateFile} />
                <textarea className="upload-image-caption" type="text" placeholder="Personal Blurb" defaultValue={ this.state.bio } onChange={this.bioChange}/>
                <input className="post-form-submit-button" type="submit" value="Update Profile"/>
              </form>
            </div>

          </div>

        </Modal>
      </div>
    );
  }
});

module.exports = ProfileForm;
