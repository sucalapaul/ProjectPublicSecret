class ApplicationController < ActionController::Base
  protect_from_forgery


  rescue_from CanCan::AccessDenied do |exception|
    #flash[:error] = "Access denied!"
    #redirect_to "/403.html"
    # redirect_to "/welcome"
    if user_signed_in?
      redirect_to "/profile"
    else
      redirect_to "/welcome"
    end
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    redirect_to "/404.html"
  end

  def refresh_notifications
    if user_signed_in? 

      if current_user.notifications.nil? || current_user.notifications_expired?

        #update notifications for a user
        notifications = FacebookRequest.where(to_user_id: current_user.uid, click_date: nil).select([:rid, :user_id, :url, :type, :content, :invited_by_name])
        
        Rails.logger.debug("dbg:1 #{notifications.to_yaml}\n-----------------------------------------------------------------------------\n\n\n")
        
        notifications.each do |notification|

          Rails.logger.debug("dbg:2 #{notification.to_yaml}\n-----------------------------------------------------------------------------\n\n\n")

          #update properties for notifications generated through facebook
          if notification.type.nil?
            notification.type = 1
          end

          if notification.content.nil?
            url = notification.url.split("/")
            if ! url[2]
              case notification.type
                when 1  #invite to circle
                  notification.content = Circle.select(:name).find(url[2]).name
              end
            end
          end

          if notification.invited_by_name.nil? && !notification.user_id.nil?
            notification.invited_by_name =  User.select(:name).find(notification.user_id).name
          end

          notification.save
          Rails.logger.debug("dbg:2 #{notification.to_yaml}\n-----------------------------------------------------------------------------\n\n\n")
        end #update notifications for a user

        Rails.logger.debug("dbg:1 #{notifications.to_yaml}\n-----------------------------------------------------------------------------\n\n\n")

        current_user.notifications = notifications.to_json
        current_user.notifications_updated_at = Time.now
        current_user.notifications_expired = false
        current_user.save
      end

    end
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
