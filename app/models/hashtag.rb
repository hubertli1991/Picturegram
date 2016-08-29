class Hashtag < ActiveRecord::Base
  validates :hashtag, :count, presence: true
  validates :hashtag, uniqueness: true

  has_many(
    :post_hashtag_relationships,
    primary_key: :id,
    foreign_key: :hashtag_id,
    class_name: "PostHashtagRelationship"
  )

  has_many(
    :posts,
    through: :post_hashtag_relationships,
    source: :post
  )

  # has_many :post_hashtag_relationships
  # has_many :posts, through: :post_hashtag_relationships
end
