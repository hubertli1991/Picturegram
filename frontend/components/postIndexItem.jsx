var React = require('react');
var Router = require('react-router').Router;
// Modal Require Start
var Modal = require("react-modal");
var _Style = require("../modal_styles/modal_styles");
// Modal Require End


var PostIndexItem = React.createClass({

  getInitialState: function(){
    return({ modalOpen: false });
  },
  closeModal: function(){
    this.setState({ modalOpen: false });
  },
  openModal: function(){
    this.setState({ modalOpen: true });
  },

  // <img src={this.props.post.image_url}/>
  render: function() {
    return (
      <div>
        <li onClick={this.openModal}>
          <img src={this.props.post.image_url}/>
        </li>

        <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}
            style={_Style}>

            <img src={this.props.post.image_url}/>
            <p> {this.props.post.caption} </p>

          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = PostIndexItem;
