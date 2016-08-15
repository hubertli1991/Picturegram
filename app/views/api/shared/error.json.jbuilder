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

  if @post_image_error
    json.postImageError @post_image_error
  end

  if @post_caption_error
    json.postCaptionError @post_caption_error
  end
end
