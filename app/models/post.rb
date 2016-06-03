class Post < ActiveRecord::Base

  validates :user_id, :caption, presence: true

  has_attached_file :image, default_url: "shar_pei.jpg"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :user
  has_many :comments
  has_many :likes


  def picture_url
    "http://g-ecx.images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg"
  end

end
