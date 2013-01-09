class CreateGossips < ActiveRecord::Migration
  def change
    create_table :gossips do |t|
      t.text :content
      t.integer :like_count
      t.integer :comments_count
      t.integer :true_count
      t.integer :false_count
      t.integer :user_id
      t.boolean :private
      t.float :score
      t.integer :circle_id

      t.timestamps
    end
  end
end
