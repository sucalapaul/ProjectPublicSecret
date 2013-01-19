class AddDefaultValueToCity < ActiveRecord::Migration
  def change
  	change_table :cities do |t|
	    t.change  "circle_count", :integer, { default: 0 }
    end
  end
end
