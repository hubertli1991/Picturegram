class CreatePostHashtagRelationships < ActiveRecord::Migration
  def change
    create_table :post_hashtag_relationships do |t|
      t.integer :post_id, null: false
      t.integer :hashtag_id, null: false
      t.timestamps null: false
    end

    add_index :post_hashtag_relationships, :post_id
    add_index :post_hashtag_relationships, :hashtag_id
  end
end
