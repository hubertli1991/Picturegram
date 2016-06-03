
json.extract! @user, :id, :username
json.posts @user.posts do |post|
  json.extract! post, :id, :caption, :created_at, :user_id
  json.image_url asset_path(post.image.url)
end
