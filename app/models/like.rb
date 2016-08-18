class Like < ActiveRecord::Base
  validates :user_id, :username, :post_id, presence: true

  belongs_to :post
end
