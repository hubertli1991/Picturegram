class PostHashtagRelationship < ActiveRecord::Base
  validates :post_id, :hashtag, presence: true

  belongs_to(
    :post,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: "Post"
  )

  belongs_to(
    :hashtag,
    primary_key: :id,
    foreign_key: :hashtag_id,
    class_name: "Hashtag"
  )
end
