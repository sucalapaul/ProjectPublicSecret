class IndexCircles < ActiveRecord::Migration

    add_index :circles, :user_id
    add_index :circles, :city_id
end
