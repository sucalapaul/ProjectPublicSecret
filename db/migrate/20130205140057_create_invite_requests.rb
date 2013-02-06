class CreateInviteRequests < ActiveRecord::Migration
  def change
    create_table :invite_requests do |t|
      t.string :email
      t.integer :invited, { default: 0 }
      t.integer :registered, { default: 0 }

      t.timestamps
    end

    add_index :invite_requests, :email
  end
end
