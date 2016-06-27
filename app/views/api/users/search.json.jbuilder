json.array! @matched_users do |user|
  json.extract! user, :id, :username
  json.profile_picture_url_thumb_nail asset_path(user.profile_picture.url(:thumb_nail))
end
