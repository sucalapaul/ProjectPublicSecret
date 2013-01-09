class CreateGossipVotes < ActiveRecord::Migration
  def change
    create_table :gossip_votes do |t|
      t.integer :gossip_id
      t.integer :user_id
      t.boolean :value

      t.timestamps
    end
  end
end
