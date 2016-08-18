class Post < ActiveRecord::Base

  validates :user_id, :caption, presence: true

  # has_attached_file :image, default_url: "shar_pei.jpg"
  has_attached_file :image, styles: { :small => "300x300#", :large => "600x600#" }
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :user
  has_many :comments
  has_many :likes

end
