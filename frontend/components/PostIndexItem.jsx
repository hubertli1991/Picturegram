var React = require('react');
var Router = require('react-router').Router;
// Modal Require Start
var Modal = require("react-modal");
var _Style = require("../modal_styles/modal_styles");
// Modal Require End
var PostStore = require("../stores/post_store");
var SessionStore = require("../stores/session_store");
var ErrorStore = require('./../stores/error_store');
var CommentForm = require("./CommentForm");
var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');
var Picture = require('./Picture');
var UpdateCaptionForm = require('./UpdateCaptionForm');

var Helpers = require('../helpers/helpers');

var PostIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return({ modalOpen: false, editFormOpen: false, post: this.props.post, postNumber: this.props.postNumber, postCount: this.props.postCount, path: this.props.path});
    // Note this.state.post is the post object the MODAL gets.
    // This.props.post is the the post object PostIndexItem uses to render the squaare image on the PostIndex page.
    // Thus, can't just change the props and invoke componentWillReceiveProps here
    // I could have gotten rid of this.state.post and only used postNumbers and had this component
    // invoke PostStore.fetcherPostByArrayIndex(this.state.postNumber) to get the post object, but I wanted
    // to minimize the interactions with the PostStore.
    // This way, there is a default post object the modal uses and calls on the PostStore
    // ONLY when there are changes made to the store or when the user navigates posts using the left and right arrows.
  },

  componentDidMount: function() {
    this.postStorelistener = PostStore.addListener(this._onChange);
    this.errorStoreListener = ErrorStore.addListener(this.forceUpdate.bind(this));
  },

  componentWillReceiveProps: function(newProp) {
    // need this function when redirecting to new userpage or hashtag page
    if (newProp.postNumber === this.state.postNumber) {
      // only call setState when modal state is the same as props
      // otherwise after every comment, the modal's post (after arrow navigation) will switch back to the original post
      // after redirecting we reset (modal) state to match props so we get into the if statement
      this.setState({post: newProp.post, postNumber: newProp.postNumber, postCount: newProp.postCount, path: this.props.path});
    }
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
    this.errorStoreListener.remove();
  },

  _onChange: function() {
    // otherwise when comments are added, the PostIndex will recieve the updated Post objects
    // but the PostIndexItem will not
    var updatedPost = PostStore.fetcherPostByArrayIndex(this.state.postNumber);

    if ( this.state.editFormOpen ) {
      this.closeEditForm();
    }
    
    this.setState( {post: updatedPost} );
  },


  closeModal: function() {
    document.removeEventListener("keydown", this.handleKeyDown);
    // reset the state to the default after you've changed it with arrow navigation
    this.setState({ modalOpen: false, editFormOpen: false, post: this.props.post, postNumber: this.props.postNumber, postCount: this.props.postCount, path: this.props.path });
  },
  openModal: function() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.setState({ modalOpen: true });
  },


  handleClick: function(id, type) {
    // document.removeEventListener("keydown", this.handleKeyDown);
    // crucial that you invoke closeModal
    // it will remove the freefloating event listener function which drives teh console crazy
    // also, it resets the state to the default after you've changed it with arrow navigation
    // this will prevent problems when navigating to different pages and props get changed
    if ( this.state.editFormOpen ) {
      this.closeEditForm();
    }
    this.closeModal();

    if ( type === "user" ) {
      this.context.router.push( "/users/" + id );
    } else if ( type === "hashtag" ) {
      this.context.router.push( "/hashtags/" + id );
    }
  },

  handleKeyDown: function(e) {
    if ( e.target.className === "comment-form-text" || e.target.className === "post-edit-form-text" || e.target.className === "post-edit-form" ) { return; }
    // do nothing if the user is editing his/her text using arrow keys
    if ( e.keyCode === 39 && this.state.postNumber < this.state.postCount - 1 ) {
      this.switchPost( "right" );
    }
    if ( e.keyCode === 37 && this.state.postNumber > 0 ) {
      this.switchPost( "left" );
    }
  },

  clickLeft: function() {
    this.switchPost( "left" );
  },

  clickRight: function() {
    this.switchPost( "right" );
  },

  switchPost: function( direction ) {
    if ( direction === "left" ) {
      this.state.postNumber--;
      this.renderNextPost( this.state.postNumber );
    }
    if ( direction === "right" ) {
      this.state.postNumber++;
      this.renderNextPost( this.state.postNumber );
    }
  },

  renderNextPost: function(nextPostId) {
    var nextPost = PostStore.fetcherPostByArrayIndex(nextPostId);
    if ( this.state.editFormOpen ) {
      this.closeEditForm();
    }
    this.setState( { post: nextPost } );
  },

  renderArrows: function() {
    var arrows = { left: { callback: this.renderLeft, status: true }, right: { callback: this.renderRight, status: true } };
    if ( this.state.postNumber >= this.state.postCount - 1 ) {
      arrows.right.status = false;
    }
    if ( this.state.postNumber <= 0 ) {
      arrows.left.status = false;
    }

    return (
      <div>
        { Object.keys(arrows).map( function(direction, idx) {
            return ( arrows[direction].callback( arrows[direction].status, idx ) );
          }
        ) }
      </div>
    );
  },

  renderLeft: function(status, idx) {
    if ( status ) {
      return <div className="modal-click-left" key={idx} onClick={ this.clickLeft }/>;
    }
  },

  renderRight: function(status, idx) {
    if ( status ) {
      return <div className="modal-click-right" key={idx} onClick={ this.clickRight }/>;
    }
  },

  renderCaption: function() {
    hashtagsArray = Helpers.parseHashtags(this.state.post.caption, this.state.post.hashtags);

    if ( hashtagsArray.length ) {
      var caption = this.state.post.caption;
      var idx = 0;
      var final = [];
      for (var i = 0; i < hashtagsArray.length; i++) {
        final[idx] = caption.slice(idx, hashtagsArray[i][1]);
        final[hashtagsArray[i][1]] = <div className="hashtag" key={i} onClick={this.handleClick.bind(null, hashtagsArray[i][2], "hashtag")}>{hashtagsArray[i][0]}</div>;
        idx = hashtagsArray[i][1] + hashtagsArray[i][0].length;
      }
      final[idx] = caption.slice(idx, caption.length);
      return <div className="caption-text">{final}</div>;
    } else {
      return <div className="caption-text">{this.state.post.caption}</div>;
    }
  },

  renderEditButton: function() {
    if ( SessionStore.currentUser().id === this.state.post.user_id && this.state.path.slice(1,2) === "u" ) {
      return <div className="edit-caption" onClick={this.openEditForm}> Edit </div>;
    }
  },

  openEditForm: function() {
    document.addEventListener("click", this.closeEditForm);
    this.setState({editFormOpen: true});
  },

  // closeEditFormTwo: function(e) {
  //   if ( e.target.className !== "post-edit-form" && e.target.className !== "post-edit-form-text" ) {
  //     // document.removeEventListener("click", this.closeEditFormTwo);
  //     this.closeEditForm();
  //   }
  // },

  closeEditForm: function(e) {
    //either when user clicks on another hashtag or username
    if ( e === undefined || (e.target.className !== "post-edit-form" && e.target.className !== "post-edit-form-text") ) {
      document.removeEventListener("click", this.closeEditForm);
      ErrorStore.clearErrors();
      this.setState({editFormOpen: false});
    }
  },

  renderEditForm: function() {
    if ( this.state.editFormOpen ) {
      return (
        <div className="post-edit-form">
          <div className="close-post-edit-form"/>
          <UpdateCaptionForm postId={this.state.post.id} hashtags={this.state.post.hashtags}/>
          {this.renderErrors("postCaptionError")}
        </div>
      );
    }
  },

  renderErrors: function(errorType) {
    var errorMessage = ErrorStore.extractErrorMessage(errorType);
    if ( errorMessage ) {
      return (<p className="post-edit-form-error">{errorMessage}</p>);
    }
  },

  render: function() {
    var comments = [];
    if (this.state.post.comments) {
      comments = this.state.post.comments;
    } else {
      comments = [];
    }

    var millisecondDay = 1000*60*60*24;
    var currentDate = new Date();
    var createAtDate = new Date(this.state.post.created_at);
    var daysSince = Math.ceil( (currentDate - createAtDate) / millisecondDay);
    var timeSince = 0;
    var timeUnit = 0;
    if( daysSince/7 < 1 ) {
      timeSince = daysSince;
      timeUnit = "d";
    } else {
      timeSince = Math.floor(daysSince/7);
      timeUnit = "w";
    }

    // for hover effect ONLY
      var hoverPostId = this.props.post.id;
      var hoverCommentCount = this.props.post.comments.length;

      var self = this;

    return (
      <div>
        <li onClick={this.openModal}>
          <div className="index-picture-icons">
            <div className="like-count-with-icon-index group"> <i className="fa fa-heart" aria-hidden="true"></i> <LikeCount postId={hoverPostId} location={"index-page"}/> </div>
            <div className="comment-count-with-icon-index"> <div className="comment-count-index">{hoverCommentCount}</div> <i className="fa fa-comment" aria-hidden="true"></i> </div>
          </div>
          <img className="index-picture" src={this.props.post.image_url_small}/>
        </li>

        <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}
            style={_Style}>

            <Picture imageUrl={this.state.post.image_url_large} postId={this.state.post.id} location="post-index-item"/>

            {this.renderEditForm()}

            <div className="non-picture-stuff" >

              <div className="post-header">
                <img className="thumbnail" src={this.state.post.thumbnail} onClick={ this.handleClick.bind(null, this.state.post.user_id, "user") }/>
                <p className="thumb-username" onClick={ this.handleClick.bind(null, this.state.post.user_id, "user") }>{this.state.post.username}</p>
                <div className="time-since"> {timeSince + timeUnit} </div>
              </div>

              <LikeCount postId={this.state.post.id}/>

              {this.renderEditButton()}

              <div className="caption-and-comments">
                <div className="caption">
                  <div> <p className="username" onClick={ this.handleClick.bind(null, this.state.post.user_id, "user") }> {this.state.post.username} </p>
                    {this.renderCaption()} </div>
                </div>

                <ul className="comment-list">
                  {comments.map( function(comment, idx) {
                    return ( <li className="comment" key={idx}>
                              <div> <p className="username" onClick={ this.handleClick.bind(null, comment.user_id, "user") }> {comment.username} </p>
                              {comment.body} </div>
                            </li> );
                  }.bind(this) )}
                </ul>
              </div>


              <LikeButton postId={this.state.post.id} caption={this.state.post.caption} location={"userPage"}/>
              <div className="comment-form">
                <CommentForm postId={this.state.post.id}/>
              </div>

            </div>

            { this.renderArrows() }

          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = PostIndexItem;
