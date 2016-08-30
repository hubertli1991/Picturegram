json.array! @matched_hashtags do |hashtag|
  json.type :hashtag
  json.extract! hashtag, :id, :hashtag, :count
end
