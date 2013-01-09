class City < ActiveRecord::Base
  attr_accessible :circle_count, :latitude, :longitude, :name

  has_many :circles
end
