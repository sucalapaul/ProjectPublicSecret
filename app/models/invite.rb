class Invite < ActiveRecord::Base

	belongs_to :sender, :class_name => 'User'


  #attr_accessible :count, :invitation_token, :user_id

  before_create :generate_token


  private
  def generate_token
  	self.token = Digest::SHA1.hexdigest([Time.now, rand].join)
  end
end
