class OmniauthCallbacksController < Devise::OmniauthCallbacksController

	
	def all
	    user = User.from_omniauth(env["omniauth.auth"])
	    if user.persisted?
	      flash.notice = "Signed in!"
	      sign_in_and_redirect user
	    else
	    	user.invitation_token = session["invite_token"]
	      session["devise.user_attributes"] = user.attributes
	      redirect_to new_user_registration_url
	    end
	end
    alias_method :facebook, :all


  def failure
  	redirect_to root_path
  end

end
