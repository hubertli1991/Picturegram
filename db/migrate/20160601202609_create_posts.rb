class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.integer :user_id, null: false
      t.string :caption, null: false
      t.timestamps null: false
    end

    add_index :posts, :user_id
  end
end
