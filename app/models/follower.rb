class Follower < ActiveRecord::Base
  attr_accessible :follower_id, :user_id

  belongs_to :user 
end
