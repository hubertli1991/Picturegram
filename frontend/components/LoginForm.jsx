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

	changeUsernameValue: function(e) {
		var newUsername = e.target.value;
		this.setState({username: newUsername});
	},

	changePasswordValue: function(e) {
		var newPassword = e.target.value;
		this.setState({password: newPassword});
	},

  componentDidMount: function () {
    this.errorListener = ErrorStore.addListener(this.forceUpdate.bind(this));
    // this.sessionListener = SessionStore.addListener(this.redirectIfLoggedIn);
  },

  componentWillUnmount: function () {
    this.errorListener.remove();
    // this.sessionListener.remove();
  },

  // redirectIfLoggedIn: function () {
  //   if (SessionStore.isUserLoggedIn()) {
  //     this.context.router.push("/");
  //   }
  // },

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
      navButton = <p>Don't have an account? <button onClick={this.toggleForm} className="signin-signup-toggle" >Sign up</button></p>;
			this.formType = 'Log in';
    } else {
      navButton = <p>Have an account? <button onClick={this.toggleForm} className="signin-signup-toggle" >Log in</button></p>;
			this.formType = 'Sign up';
    }

		return (
			<div>
				<div className="login_box">

					<h1 className="title">Picturegram</h1>

					<a href="/auth/facebook" className="login-through-facebook-box"><button className="login-through-facebook" type="button">Log in with Facebook</button></a>

					<h1 className="or">OR</h1>

					<form onSubmit={this.handleSubmit}>

		        { this.fieldErrors("base") }

						<div className="form-input">

							<label className="username-box">
			          { this.fieldErrors("username") }
								<input type="text" placeholder="Username" className="username-login" value={this.state.username} onChange={this.changeUsernameValue}/>
							</label>

							<label className="password-box">
			          { this.fieldErrors("password") }
								<input type="password" placeholder="Password" className="password-login" value={this.state.password} onChange={this.changePasswordValue} />
							</label>

							<span>
								<input type="submit" className="submit-button" value={ this.formType } />
							</span>

							<button className="guest-login" onClick={this.guestLogin}> Guest Log in </button>
						</div>

					</form>
				</div>

				<div className="signup-or-signin-box">
					<div className="signup-or-signin">
						{navButton}
					</div>
				</div>

			</div>
		);
	}
});

module.exports = LoginForm;
