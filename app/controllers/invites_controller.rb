class InvitesController < ApplicationController

	before_filter :authenticate_user!, except: [:signup]

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

	def signup
		if params[:invite_token]
			session["invite_token"] = params[:invite_token]
		end
	end

	# the object for "Using" activity
	def fb_using_action
		# render the view
	end
end
