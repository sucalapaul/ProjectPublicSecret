class UsersController < ApplicationController

	require 'koala'
	before_filter :authenticate_user!

	def index
			
	end

	def invites
		#@graph = Koala::Facebook::API.new(current_user.oauth_token)
		@friend_data = current_user.facebook.get_connection("me", "friends?fields=name,picture") #@graph.get_object("me","likes")

	end 
end