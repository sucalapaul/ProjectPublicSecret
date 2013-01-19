class AddDefaultsToCircles < ActiveRecord::Migration
  def change

  	change_table :circles do |t|
	    t.change  "gossip_count", :integer, { default: 0 }
	    t.change  "people_count", :integer, { default: 0 }
    end
    
  	change_table :cities do |t|
	    t.change  "circle_count", :integer, { default: 0 }
    end

  end
end