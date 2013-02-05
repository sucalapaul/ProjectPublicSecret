class UserMailer < ActionMailer::Base

  def signup_confirmation(user)
  	@user = user

  	mail to: user.email, subject: "Welcome to The Gossip", from: "no-reply@letsgossip.it"
  end

  def request_invite(email)
		mail to: email, subject: "Welcome to The Gossip", from: "hi@letsgossip.it"
  end
end
