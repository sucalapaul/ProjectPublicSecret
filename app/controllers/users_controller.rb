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

  def valid_nickname
    valid = true
    if User.find_by_nickname( params[:nickname] )
      valid = false
    end

    respond_to do |format|
      format.json { render json: { valid: valid } }
    end
  end

  # POST /users
  # POST /users.json
  def follow
    followed_id = params[:user][:followed_id]
    if followed_id.empty? && ! params[:user][:followed_fb_id].empty?
      follower = User.where(uid: params[:user][:followed_fb_id], provider: "facebook").first
      if ! follower.nil? 
        followed_id = follower.id
      else
        followed_id = ""
      end
    end

    #followed = Follower.where(follower_id: follower_id, user_id: current_user.id).first_or_initialize
    relationship = Relationship.where( follower_id: current_user.id, followed_id: followed_id ).first_or_initialize

    respond_to do |format|
      if followed_id.to_s.empty?
        format.json { render json: "0", status: :created }
      end

      if not relationship.persisted?
        relationship.save
        User.update_counters( current_user.id, following_count: 1 )
        User.update_counters( followed_id, follower_count: 1 )
        mod = 1
      else
        relationship.delete
        User.update_counters( current_user.id, following_count: -1 )
        User.update_counters( followed_id, follower_count: -1 )
        mod = -1
      end
      format.json { render json: mod, status: :created }
    end
  end

end
