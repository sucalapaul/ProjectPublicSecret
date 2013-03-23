class FacebookRequest < ActiveRecord::Base
  attr_accessible :rid, :url, :user_id, :to_user_id
end
