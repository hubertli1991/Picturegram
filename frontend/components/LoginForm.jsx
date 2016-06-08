var React = require('react');
var Link = require('react-router').Link;
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var SessionApiUtil = require('./../util/session_api_util');
var SessionStore = require('./../stores/session_store');
var ErrorStore = require('./../stores/error_store');
var UserApiUtil = require('./../util/user_api_util');

var LoginForm = React.createClass({
	mixins: [LinkedStateMixin],

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

  getInitialState: function () {
    return {
      username: "",
      password: "",
			login: true
    };
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

	guestLogin: function(e) {
		e.preventDefault();

		var guestData = {
			username: 'guest',
			password: 1234567
		};
		SessionApiUtil.login(guestData);
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
      navButton = <button onClick={this.toggleForm} className="signin-signup-toggle" >sign up</button>;
			this.formType = 'login';
    } else {
      navButton = <button onClick={this.toggleForm} className="signin-signup-toggle" >Log in</button>;
			this.formType = 'signup';
    }

		return (
			<div>
				<div className="login_box">

					<h1 className="title">Picturegram</h1>

					<form onSubmit={this.handleSubmit}>

		        { this.fieldErrors("base") }

						<div className="form-input">

							<label>
			          { this.fieldErrors("username") }
								<input type="text" placeholder="username" className="username" valueLink={this.linkState("username")} />
							</label>

							<label>
			          { this.fieldErrors("password") }
								<input type="password" placeholder="password" className="password" valueLink={this.linkState("password")} />
							</label>

							<span>
								<input type="submit" className="submit-button" value={ this.formType } />
							</span>

							<button onClick={this.guestLogin}> Guest Login </button>
						</div>

					</form>
				</div>

				<div className="signup-or-signin-box">
					<div className="signup-or-signin">
						<p>Don't have an account? {navButton}</p>
					</div>
				</div>

				<a href="/auth/facebook"> Login through Facebook </a>

			</div>
		);
	}
});

module.exports = LoginForm;
