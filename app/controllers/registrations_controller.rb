class RegistrationsController < Devise::RegistrationsController
	def after_sign_up_path_for(resource)
    #welcome_path
    #Rails.logger.debug("SIGNED UP")
    #redirect_to 
    "/invites"
  end

  # #send confirmation email after saving the user
  # def create
  # 	Rails.logger.debug("User: #{@user}")
  # #   build_resource

  # #   if resource.save
  # #     if resource.active_for_authentication?
  # #       set_flash_message :notice, :signed_up if is_navigational_format?
  # #       sign_up(resource_name, resource)
  # #       UserMailer.signup_confirmation.deliver
  # #       respond_with resource, :location => after_sign_up_path_for(resource)
  # #     else
  # #       set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
  # #       expire_session_data_after_sign_in!
  # #       respond_with resource, :location => after_inactive_sign_up_path_for(resource)
  # #     end
  # #   else
  # #     clean_up_passwords resource
  # #     respond_with resource
  # #   end
  # end

end
