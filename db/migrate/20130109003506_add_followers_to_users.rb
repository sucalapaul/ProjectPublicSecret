class AddFollowersToUsers < ActiveRecord::Migration
  def change
    add_column :users, :follower_count, :integer
    add_column :users, :following_count, :integer
    add_column :users, :gossip_count, :integer
    add_column :users, :circle_count, :integer
  end
end
