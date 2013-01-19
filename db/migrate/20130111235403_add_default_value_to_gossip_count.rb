class AddDefaultValueToGossipCount < ActiveRecord::Migration
  def change
    change_table :users do |t|
	    t.change  "gossip_count", :integer,{ default: 0 }
	    t.change  "follower_count", :integer, { default: 0 }
	    t.change  "following_count", :integer, { default: 0 }
	    t.change  "circle_count", :integer, 		{ default: 0 }
    end
  end
end
