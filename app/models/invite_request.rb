class InviteRequest < ActiveRecord::Base
  attr_accessible :email, :invited, :registered


  after_save :send_subscribe_mail


  #send request email from homepage
	def send_subscribe_mail
	  UserMailer.request_invite(self.email).deliver
	end


end
