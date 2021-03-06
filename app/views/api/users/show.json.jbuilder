# json.extract! @user, :id, :username
# json.posts @user.posts do |post|
#   json.extract! post, :id, :caption, :created_at, :user_id
#
#   # json.comments post.comments do |comment|
#   #   json.extract! comment, :user_id, :post_id, :body, :created_at
#   #   json.username User.find(comment.user_id).username
#   # end
#
#   json.comments do
#     json.partial! 'comments/comments', comments: post.comments
#   end
#
#   json.image_url_small asset_path(post.image.url(:small))
#   json.image_url_large asset_path(post.image.url(:large))
# end

json.extract! @user, :id, :username, :bio
json.profile_picture_url_regular asset_path(@user.profile_picture.url(:regular))
json.profile_picture_url_thumb_nail asset_path(@user.profile_picture.url(:thumb_nail))
json.posts @user.posts.order(created_at: :desc) do |post|
  json.partial! 'posts/posts', post: post
end
