json.extract! @post, :id, :caption, :created_at, :user_id
# json.username User.find(@post.user_id).username
json.comments @post.comments do |comment|
  json.extract! comment, :user_id, :post_id, :body, :created_at
  json.userName User.find(comment.user_id).username
end
json.image_url_small asset_path(@post.image.url(:small))
json.image_url_large asset_path(@post.image.url(:large))
