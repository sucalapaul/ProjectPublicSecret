class FacebookRequestsController < ApplicationController

	before_filter :authenticate_user!, except: [:index] 

	def create

		rid = params[:request]
		userIds = params[:to]
		userIds.each do |userid|
			facebookRequest = FacebookRequest.new(rid: rid, user_id: current_user.id, to_user_id: userid, url: params[:url] )
			facebookRequest.save
		end	

		render json: "created"

	end

  def notification_click
    rid = params[:notification][:rid]
    notification = FacebookRequest.find_by_rid(rid)
    notification.click_date = Time.now
    notification.ref = "web_notif"
    notification.save

    current_user.notifications_expired = true
    current_user.save

    render json: { url: notification.url }
  end


  def notifications

  end


end


    # respond_to do |format|
    #   if not like.persisted?
    #     like.save
    #     Gossip.update_counters(params[:like][:gossip_id], like_count: 1)
    #     mod = 1
    #   else
    #     like.delete
    #     Gossip.update_counters(params[:like][:gossip_id], like_count: -1)
    #     mod = -1
    #   end
    #   format.json { render json: mod, status: :created }
    # end