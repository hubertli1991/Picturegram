class Post < ActiveRecord::Base

  validates :user_id, :caption, presence: true

  belongs_to :user
  has_many :comments
  has_many :likes

  def picture_url
    "http://g-ecx.images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg"
  end

end
