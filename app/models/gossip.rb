class Gossip < ActiveRecord::Base
  attr_accessible :circle_id, :comments_count, :content, :false_count, :like_count, :private, :score, :true_count, :user_id

  belongs_to :user
  belongs_to :circle

  has_many :comments 
  has_many :likes
  has_many :gossip_votes
  has_many :votes, :through => :gossip_votes

  validates :content, :length => { :minimum => 2 }
  
end
