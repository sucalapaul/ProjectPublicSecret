class RegistrationsController < Devise::RegistrationsController
	  def after_sign_up_path_for(resource)
    #welcome_path
    #Rails.logger.debug("SIGNED UP")
    #redirect_to 
    "/invites"
  end
end
