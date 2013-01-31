class Comment < ActiveRecord::Base
  attr_accessible :content, :gossip_id, :user_id, :private

  belongs_to :gossip
  belongs_to :user

  validates :content, :length => { :minimum => 2 }
  
end
