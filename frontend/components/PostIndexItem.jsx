var React = require('react');
var Router = require('react-router').Router;
// Modal Require Start
var Modal = require("react-modal");
var _Style = require("../modal_styles/modal_styles");
// Modal Require End
var PostStore = require("../stores/post_store");
var CommentForm = require("./CommentForm");


var PostIndexItem = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  //modal function start
  getInitialState: function(){
    return({ modalOpen: false });
  },
  closeModal: function(){
    this.setState({ modalOpen: false });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },
  //modal function end

  // When PostStore __emitChange, PostIndex will re-render, thus updating this.props.post
  //
  // componentDidMount: function() {
  //   var postStorelistener = PostStore.addListener(this.onChange);
  // },
  //
  // _onChange: function() {
  //   this.setState({ comments: PostStore.fetchSinglePost(this.props.post.id).comments });
  // },

  handleClick: function(id) {
    this.closeModal();
    this.context.router.push( "/users/" + id );
  },

  // <img src={this.props.post.image_url}/>
  render: function() {

    var comments = [];
    if (this.props.post.comments) {
      comments = this.props.post.comments;
    } else {
      comments = [];
    }

    return (
      <div>
        <li onClick={this.openModal}>
          <img className="index-picture" src={this.props.post.image_url_small}/>
        </li>

        <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}
            style={_Style}>

            <img className="picture" src={this.props.post.image_url_large}/>

            <div className="non-picture-stuff" >

              <div className="post-header" onClick={ this.handleClick.bind(null, this.props.post.user_id) }>
                <img className="thumbnail" src={this.props.thumbnail}/> <p className="thumb-username">{this.props.post.username}</p>
              </div>

              <div className="caption-and-comments">
                <div className="caption">
                  <div> <p className="username" onClick={ this.handleClick.bind(null, this.props.post.user_id) }> {this.props.post.username} </p>
                    {this.props.post.caption} </div>
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

              <div className="comment-form">
                <CommentForm postId={this.props.post.id}/>
              </div>

          </div>

          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = PostIndexItem;
