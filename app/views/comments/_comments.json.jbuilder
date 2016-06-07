json.array! comments do |comment|
  json.extract! comment, :user_id, :post_id, :body, :created_at
  json.userName User.find(comment.user_id).username
end
