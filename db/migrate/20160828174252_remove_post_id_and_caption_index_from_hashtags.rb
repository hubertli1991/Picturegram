class RemovePostIdAndCaptionIndexFromHashtags < ActiveRecord::Migration
  def change
    remove_column :hashtags, :post_id, :integer, null: false, index: true
    remove_column :hashtags, :caption_index, :integer, null: false
  end
end
