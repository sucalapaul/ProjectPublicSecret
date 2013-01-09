class GossipVote < ActiveRecord::Base
  attr_accessible :gossip_id, :user_id, :value
end
