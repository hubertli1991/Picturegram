json.extract! @hashtag, :hashtag, :id, :count
json.posts @hashtag.posts.order(created_at: :desc) do |post|
  json.partial! 'posts/posts', post: post
end
