
json.posts @posts do |post|
  json.partial! 'posts/posts', post: post
end
