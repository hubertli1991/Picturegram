
json.extract! @user, :id, :username
json.posts @user.posts do |post|
  json.extract! post, :id, :caption, :picture, :created_at, :user_id
end
