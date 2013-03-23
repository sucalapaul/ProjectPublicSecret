class Circle < ActiveRecord::Base

  attr_accessor :joined, :city_name, :city_long, :city_lat
  attr_accessible :city_id, :description, :gossip_count, :name, :people_count, :city, :tag_list, :city_name, :city_lat, :city_long


  acts_as_taggable

  def as_json (options = { })
    h = super (options)
    h[:joined] = joined
    h
  end

  belongs_to :city

  has_many :circle_users
  has_many :gossips, :order => 'id DESC'
  has_many :users, :through => :circle_users

  validates :name, :presence => true
  validates :name, :length => { :minimum => 2, :allow_blank => true }
  validates :city_id, :presence => true
  validates :description, :presence => true
  validates :description, :length => { :minimum => 2, :allow_blank => true }

end
