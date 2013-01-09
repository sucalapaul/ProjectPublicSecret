class Gossip < ActiveRecord::Base
  attr_accessible :circle_id, :comments_count, :content, :false_count, :like_count, :private, :score, :true_count, :user_id
end
