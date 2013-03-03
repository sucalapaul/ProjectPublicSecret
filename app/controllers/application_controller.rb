class ApplicationController < ActionController::Base
  protect_from_forgery


  rescue_from CanCan::AccessDenied do |exception|
    #flash[:error] = "Access denied!"
    #redirect_to "/403.html"
    redirect_to "/welcome"
  end

  private
  #this gives access in views to the current controller and action, so that you can display partial with conditions
  before_filter :instantiate_controller_and_action_names
 
  def instantiate_controller_and_action_names
      @current_action = action_name
      @current_controller = controller_name
  end

  #private
  # def current_user
  #   @current_user ||= User.find(session[:user_id]) if session[:user_id]
  # end
  # helper_method :current_user

  helper_method :user_circles

  def user_circles
  	if user_signed_in? 
  		return current_user.circles
  	end
  	return nil
  end

end
