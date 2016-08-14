json.errors do
  if @login_error
    json.loginError @login_error
  end

  if @username_error
    json.usernameError @username_error
  end

  if @password_error
    json.passwordError @password_error
  end
end
