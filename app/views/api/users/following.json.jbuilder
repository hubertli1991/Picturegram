# json.array! @matched_users do |user|
#   json.type :user
#   json.extract! user, :id, :username
#   json.profile_picture_url_thumb_nail asset_path(user.profile_picture.url(:thumb_nail))
# end
#
# @matched_users.each do |type, user_array|
#
# end

json.followers @matched_users[:followers] do |user|
  json.extract! user, :id, :username
  json.profile_picture_url_thumb_nail asset_path(user.profile_picture.url(:thumb_nail))
end

json.followees @matched_users[:followees] do |user|
  json.extract! user, :id, :username
  json.profile_picture_url_thumb_nail asset_path(user.profile_picture.url(:thumb_nail))
end
