class AddNotificationsToUser < ActiveRecord::Migration
  def change
  	add_column :users, :notifications, :text
  	add_column :users, :notifications_expired, :boolean
  	add_column :users, :notifications_updated_at, :datetime
  end
end
