class Comment < ActiveRecord::Base
  attr_accessible :content, :gossip_id, :user_id
end
