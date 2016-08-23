var React = require('react');
var Router = require('react-router').Router;
// Modal Require Start
var Modal = require("react-modal");
var _Style = require("../modal_styles/modal_styles");
// Modal Require End
var PostStore = require("../stores/post_store");
var CommentForm = require("./CommentForm");
var LikeButton = require('./LikeButton');
var LikeCount = require('./LikeCount');
var Picture = require('./Picture');


var PostIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  //modal function start
  getInitialState: function() {
    return({ modalOpen: false, post: this.props.post, postNumber: this.props.postNumber });
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
  },

  componentWillUnmount: function() {
    this.postStorelistener.remove();
  },

  _onChange: function() {
    // otherwise when comments are added, the PostIndex will recieve the updated Post objects
    // but the PostIndexItem will not
    this.setState( {post: PostStore.fetcherPostByArrayIndex(this.state.postNumber)} );
  },

  closeModal: function() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.setState({ modalOpen: false, post: this.props.post, postNumber: this.props.postNumber });
  },
  openModal: function() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.setState({ modalOpen: true });
  },
  //modal function end

  handleClick: function(id) {
    this.closeModal();
    this.context.router.push( "/users/" + id );
  },

  handleKeyDown: function(e) {
    if ( e.target.className === "comment-form-text" ) { return; }
    // do nothing if the user is editing his/her text using arrow keys
    if ( e.keyCode === 39 && this.state.postNumber < this.props.postCount - 1 ) {
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
    this.setState( { post: nextPost } );
  },

  renderArrows: function() {
    var arrows = { left: { callback: this.renderLeft, status: true }, right: { callback: this.renderRight, status: true } };

    if ( this.state.postNumber >= this.props.postCount - 1 ) {
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

  // <div className="picture-container">
  //   <img className="picture" src={this.state.post.image_url_large}/>
  // </div>

  // <img src={this.state.post.image_url}/>
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

    return (
      <div>
        <li onClick={this.openModal}>
          <div className="index-picture-icons">
            <div className="like-count-with-icon-index group"> <i className="fa fa-heart" aria-hidden="true"></i> <LikeCount postId={this.state.post.id} location={"index-page"}/> </div>
            <div className="comment-count-with-icon-index"> <div className="comment-count-index">{comments.length}</div> <i className="fa fa-comment" aria-hidden="true"></i> </div>
          </div>
          <img className="index-picture" src={this.props.post.image_url_small}/>
        </li>

        <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}
            style={_Style}>

            <Picture imageUrl={this.state.post.image_url_large} postId={this.state.post.id} location="post-index-item"/>

            <div className="non-picture-stuff" >

              <div className="post-header" onClick={ this.handleClick.bind(null, this.state.post.user_id) }>
                <img className="thumbnail" src={this.props.thumbnail}/> <p className="thumb-username">{this.state.post.username}</p>
                <div className="time-since"> {timeSince + timeUnit} </div>
              </div>

              <LikeCount postId={this.state.post.id}/>

              <div className="caption-and-comments">
                <div className="caption">
                  <div> <p className="username" onClick={ this.handleClick.bind(null, this.state.post.user_id) }> {this.state.post.username} </p>
                    {this.state.post.caption} </div>
                </div>

                <ul className="comment-list">
                  {comments.map( function(comment, idx) {
                    return ( <li className="comment" key={idx}>
                              <div> <p className="username" onClick={ this.handleClick.bind(null, comment.user_id) }> {comment.username} </p>
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
