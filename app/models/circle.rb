class Circle < ActiveRecord::Base
  attr_accessible :city_id, :description, :gossip_count, :name, :people_count

  belongs_to :city

  has_many :circle_users
  has_many :gossips, :order => 'id DESC'
  has_many :users, :through => :circle_users
end
