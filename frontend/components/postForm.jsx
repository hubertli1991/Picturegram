var React = require('react');
var PostStore = require('../stores/post_store');
var ClientActions = require('../actions/client_actions');


var PostForm = React.createClass({

  contextTypes: {
  router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      // works when you replace this.props.id with a number
      // move the postForm into the proper place
      user_id: parseInt(this.props.user_id),
      caption: "",
      imageFile: null,
      imageUrl: null
    };
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

  handleSubmit: function(e) {
    e.preventDefault();
    // var newPost = {
    //   image_url: this.state.imageFile,
    //   caption: this.state.caption
    // };

    var formData = new FormData();
    formData.append("post[user_id]", this.state.user_id);
    formData.append("post[caption]", this.state.caption);
    formData.append("post[image]", this.state.imageFile);
    ClientActions.createOnePost(formData, this.backToUserPage);
    this.setState({caption: "", imageFile: "", imageUrl: ""});
  },

  backToUserPage: function() {
    this.context.router.push("/users/" + this.state.user_id);
  },

  render: function() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="file" placeholder="image file" onChange={this.updateFile} />
          <input type="text" placeholder="caption" value={this.state.caption} onChange={this.captionChange}/>
          <input type="submit" value="Add Post"/>
        </form>
        <img src={this.state.imageUrl}/>
      </div>
    );
  }
});

module.exports = PostForm;
