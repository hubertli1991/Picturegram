
json.extract! @user, :id, :username
json.posts @user.posts do |post|
  json.extract! post, :id, :caption, :created_at, :user_id
end
