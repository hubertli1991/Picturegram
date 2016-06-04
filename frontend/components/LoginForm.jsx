var React = require('react');
var Link = require('react-router').Link;
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var SessionApiUtil = require('./../util/session_api_util');
var SessionStore = require('./../stores/session_store');
var ErrorStore = require('./../stores/error_store');
var UserApiUtil = require('./../util/user_api_util');

var LoginForm = React.createClass({
	mixins: [LinkedStateMixin],

  getInitialState: function () {
    return {
      username: "",
      password: "",
			login: true
    };
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    this.errorListener = ErrorStore.addListener(this.forceUpdate.bind(this));
    this.sessionListener = SessionStore.addListener(this.redirectIfLoggedIn);
  },

  componentWillUnmount: function () {
    this.errorListener.remove();
    this.sessionListener.remove();
  },

  redirectIfLoggedIn: function () {
    if (SessionStore.isUserLoggedIn()) {
      this.context.router.push("/");
    }
  },

	handleSubmit: function (e) {
		e.preventDefault();

		var formData = {
			username: this.state.username,
			password: this.state.password
		};

    if (this.state.login) {
      SessionApiUtil.login(formData);
    } else {
      UserApiUtil.signup(formData);
    }
	},

  fieldErrors: function (field) {
    var errors = ErrorStore.formErrors(this.formType);
    if (!errors[field]) { return; }

    var messages = errors[field].map(function (errorMsg, i) {
      return <li key={ i }>{ errorMsg }</li>;
    });

    return <ul>{ messages }</ul>;
  },

  toggleForm: function (e) {
		e.preventDefault();
    this.setState({login: !this.state.login});
  },

	render: function () {
    var navButton;
    if (this.state.login) {
      navButton = <button onClick={this.toggleForm}>sign up</button>;
			this.formType = 'login';
    } else {
      navButton = <button onClick={this.toggleForm}>Log in</button>;
			this.formType = 'signup';
    }

		return (
			<form onSubmit={this.handleSubmit}>
        Welcome to Picturegram! Please { this.formType } or { navButton }

        { this.fieldErrors("base") }

        <br />
				<label> Username:
          { this.fieldErrors("username") }
					<input type="text" placeholder="username" valueLink={this.linkState("username")} />
				</label>

        <br />
				<label> Password:
          { this.fieldErrors("password") }
					<input type="password" placeholder="password" valueLink={this.linkState("password")} />
				</label>

        <br />
				<span class="submit_button">
				<input type="submit" value={ this.formType } />
				</span>
			</form>
		);
	}
});

module.exports = LoginForm;
