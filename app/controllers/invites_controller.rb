class InvitesController < ApplicationController

	before_filter :authenticate_user!, except: [:signup, :fb_using_action]
	load_and_authorize_resource :except => [:index, :signup, :fb_using_action]

	def index
		
		@invite = Invite.where(user_id: current_user.id).first_or_create

		@friend_data = current_user.facebook.get_connection("me", "friends?fields=name,picture,installed") #@graph.get_object("me","likes")
		@friends_follow = []
		@friends_invite = []

		# Create two arrays of friends; one for those who already use the app, and those who doesn't
		@friend_data.each do |friend| 
			if friend["installed"]
				friend["already_following"] = ! current_user.already_follows_fb?(friend["id"]).nil?
				@friends_follow << friend 
			else
				@friends_invite << friend
			end
		end

	end

	def accept
		@inviteRequests = InviteRequest.all

		respond_to do |format|
      format.html # index.html.erb
    end
	end

	def accepted
		#

		invite = InviteRequest.find_by_email(params[:user][:email])

		sts = 0

		if invite
			UserMailer.invite_accepted(invite.email).deliver
			InviteRequest.update_counters(invite.id, invited: 1)
			sts = 1
		end

		respond_to do |format|
      format.json { render json: sts, status: :created }
    end
	end

	def signup
		if params[:invite_token]
			session["invite_token"] = params[:invite_token]
		end
	end

	# the object for "Using" activity
	def fb_using_action
		render layout: false
	end


end
