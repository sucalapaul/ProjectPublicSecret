class ApplicationController < ActionController::Base
  protect_from_forgery

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
