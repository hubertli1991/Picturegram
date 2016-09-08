json.followers @matched_users[:followers] do |user|
  json.extract! user, :id, :username
  json.profile_picture_url_thumb_nail asset_path(user.profile_picture.url(:thumb_nail))
end

json.followees @matched_users[:followees] do |user|
  json.extract! user, :id, :username
  json.profile_picture_url_thumb_nail asset_path(user.profile_picture.url(:thumb_nail))
end
