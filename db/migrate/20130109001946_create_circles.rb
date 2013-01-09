class CreateCircles < ActiveRecord::Migration
  def change
    create_table :circles do |t|
      t.string :name
      t.integer :city_id
      t.integer :gossip_count
      t.integer :people_count
      t.text :description

      t.timestamps
    end
  end
end
