class Comment < ActiveRecord::Base

  validates :user_id, :post_id, :body, presence: true
  # validates :created_at, allow_nil: true
  # validates :updated_at, allow_nil: true

  belongs_to :post

end
