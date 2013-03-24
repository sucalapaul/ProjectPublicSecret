class Comment < ActiveRecord::Base
  attr_accessible :content, :gossip_id, :user_id, :private

  belongs_to :gossip
  belongs_to :user

  validates :content, :length => { :minimum => 2 }
  validates_presence_of :user_id
  
end
