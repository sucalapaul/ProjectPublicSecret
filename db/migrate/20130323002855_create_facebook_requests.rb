class CreateFacebookRequests < ActiveRecord::Migration
  def change
    create_table :facebook_requests do |t|
      t.string :rid
      t.string :user_id
      t.string :url

      t.timestamps
    end

    add_index :facebook_requests, :rid
    add_index :facebook_requests, :user_id
  end
end
