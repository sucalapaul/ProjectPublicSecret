class InvitesController < ApplicationController

	def index
		
		@friend_data = current_user.facebook.get_connection("me", "friends?fields=name,picture") #@graph.get_object("me","likes")
	end
end
