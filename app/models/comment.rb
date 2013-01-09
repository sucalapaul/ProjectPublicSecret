class Comment < ActiveRecord::Base
  attr_accessible :content, :gossip_id, :user_id

  belongs_to :gossip
  belongs_to :user
end
