class AddCountColumnToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :count, :integer, null: false, default: 0
  end
end
