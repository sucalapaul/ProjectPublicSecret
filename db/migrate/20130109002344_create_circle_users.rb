class CreateCircleUsers < ActiveRecord::Migration
  def change
    create_table :circle_users do |t|
      t.integer :user_id
      t.integer :circle_id

      t.timestamps
    end
  end
end
