class AddIndexToFbRequests < ActiveRecord::Migration
  def change

  	add_index :facebook_requests, :to_user_id

  end
end
