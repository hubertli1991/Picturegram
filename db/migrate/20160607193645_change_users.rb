class ChangeUsers < ActiveRecord::Migration
  def change
    change_column_null(:users, :username, true)
    change_column_null(:users, :password_digest, true)
    add_column(:users, :facebook_uid, :integer)
  end
end
