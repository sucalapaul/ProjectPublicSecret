class Circle < ActiveRecord::Base

	def city_name
	end
  
	def city_lat
	end

	def city_long
	end

  attr_accessible :city_id, :description, :gossip_count, :name, :people_count, :city_name, :city_lat, :city_long

  belongs_to :city

  has_many :circle_users
  has_many :gossips, :order => 'id DESC'
  has_many :users, :through => :circle_users
end
