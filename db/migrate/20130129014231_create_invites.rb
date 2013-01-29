class CreateInvites < ActiveRecord::Migration
  def change
    create_table :invites do |t|
      t.integer :user_id
      t.string :token
      t.integer :count, { default: 0 }

      t.timestamps
    end

    add_index :invites, :user_id
    add_index :invites, :token
  end
end
