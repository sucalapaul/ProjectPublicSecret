class Gossip < ActiveRecord::Base
  attr_accessible :circle_id, :comments_count, :content, :false_count, :like_count, :private, :score, :true_count, :user_id
  attr_accessor :last_comments

  belongs_to :user
  belongs_to :circle

  has_many :comments 
  has_many :likes
  has_many :gossip_votes
  has_many :votes, :through => :gossip_votes, :source => :user

  validates :content, :length => { :minimum => 2 }

  

end
