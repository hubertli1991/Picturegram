class ChangeUserAgain < ActiveRecord::Migration
  def change
    remove_column(:users, :facebook_uid)
    add_column(:users, :facebook_uid, :string)
  end
end
