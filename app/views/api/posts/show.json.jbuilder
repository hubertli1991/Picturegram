# json.extract! @post, :id, :caption, :created_at, :user_id
# # json.username User.find(@post.user_id).username
#
# # json.partial('comments/comments', { comments: @message.comments })
#
# # json.comments @post.comments do |comment|
# #   json.extract! comment, :user_id, :post_id, :body, :created_at
# #   json.username User.find(comment.user_id).username
# # end
#
# json.comments do
#   json.partial! 'comments/comments', comments: @post.comments
# end
#
# json.image_url_small asset_path(@post.image.url(:small))
# json.image_url_large asset_path(@post.image.url(:large))

json.partial! 'posts/posts', post: @post
