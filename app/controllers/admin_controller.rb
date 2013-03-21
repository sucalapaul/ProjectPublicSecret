class AdminController < ApplicationController

	before_filter :authenticate_user!
	load_and_authorize_resource

	def index
		@userCount = User.count
		@inviteRequestCount = InviteRequest.count
		
	end


end
