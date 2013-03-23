class AddInfoToFacebookRequests < ActiveRecord::Migration
  def change
  	add_column :facebook_requests, :to_user_id, :string
    add_column :facebook_requests, :ref, :string
    add_column :facebook_requests, :app_request_type, :string
    add_column :facebook_requests, :click_date, :datetime
  end
end
