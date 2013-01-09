class Like < ActiveRecord::Base
  attr_accessible :gossip_id, :user_id

  belongs_to :user
  belongs_to :gossip
end
