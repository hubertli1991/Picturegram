class Following < ActiveRecord::Base
  validates :user_id, :following_id, presence: true

  belongs_to(
    :user,
    primary_key: :id,
    foreign_key: :user_id,
    class_name: "User"
  )

  belongs_to(
    :followee,
    primary_key: :id,
    foreign_key: :following_id,
    class_name: "User"
  )
end
