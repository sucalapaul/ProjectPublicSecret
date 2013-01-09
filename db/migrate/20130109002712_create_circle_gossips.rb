class CreateCircleGossips < ActiveRecord::Migration
  def change
    create_table :circle_gossips do |t|
      t.integer :circle_id
      t.integer :gossip_id

      t.timestamps
    end
  end
end
