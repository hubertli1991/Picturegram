class CreateHashtags < ActiveRecord::Migration
  def change
    create_table :hashtags do |t|
      t.integer :post_id, null: false
      t.string :hashtag, null: false
      t.integer :caption_index, null: false
      t.timestamps null: false
    end

    add_index :hashtags, :post_id
  end
end
