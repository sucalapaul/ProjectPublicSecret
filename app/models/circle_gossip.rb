class CircleGossip < ActiveRecord::Base
  attr_accessible :circle_id, :gossip_id

  belongs_to :circle
  belongs_to :gossip
end
