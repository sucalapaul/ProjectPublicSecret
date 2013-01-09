class GossipVote < ActiveRecord::Base
  attr_accessible :gossip_id, :user_id, :value

  belongs_to :gossip
  belongs_to :user 
end
