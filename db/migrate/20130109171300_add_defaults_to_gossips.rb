class AddDefaultsToGossips < ActiveRecord::Migration
  def change
    change_table :gossips do |t|
	    t.change     "content", :text, 				{ default: "" }
	    t.change  "like_count", :integer, 		{ default: 0 }
	    t.change  "comments_count", :integer, { default: 0 }
	    t.change  "true_count", :integer, 		{ default: 0 }
	    t.change  "false_count", :integer, 		{ default: 0 }
    end

  end
end
