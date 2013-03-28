class AddContentToFacebookRequests < ActiveRecord::Migration
  def change
    add_column :facebook_requests, :type, :integer
    add_column :facebook_requests, :content, :string
    add_column :facebook_requests, :invited_by_name, :string
  end
end
