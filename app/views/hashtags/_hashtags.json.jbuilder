json.array! hashtags do |hashtag|
  json.extract! hashtag, :hashtag, :id
  # json.set! hashtag
end
