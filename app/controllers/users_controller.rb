class UsersController < ApplicationController

	def index
		@user = User.find(3, :include => [:gossips], :include => [:circles], :include => [:followers])

		respond_to do |format|
		  format.html # show.html.erb
		  format.json { render json: @circle }
		end	
	end

	# GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id], :include => [:gossips], :include => [:circles], :include => [:followers])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @circle }
    end
  end

  # POST /users
  # POST /users.json
  def follow
    followed = Follower.where(follower_id: params[:user][:follower_id], user_id: current_user.id).first_or_initialize

    respond_to do |format|
      if not followed.persisted?
        followed.save
        User.update_counters(current_user.id, following_count: 1)
        User.update_counters(params[:user][:follower_id], follower_count: 1)
        mod = 1
      else
        followed.delete
        User.update_counters(current_user.id, following_count: -1)
        User.update_counters(params[:user][:follower_id], follower_count: -1)
        mod = -1
      end
      format.json { render json: mod, status: :created }
    end
  end

end
