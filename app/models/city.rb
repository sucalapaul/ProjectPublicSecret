class City < ActiveRecord::Base
  attr_accessible :circle_count, :latitude, :longitude, :name

  has_many :circles

  validates :name, :length => { :minimum => 2 }
  
end
