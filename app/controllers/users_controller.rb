class UsersController < ApplicationController

	def index
		@user = User.find(3, :include => [:gossips], :include => [:circles], :include => [:followers])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @circle }
    end	
	end

	# GET /circles/1
  # GET /circles/1.json
  def show
    @user = User.find(params[:id], :include => [:gossips], :include => [:circles], :include => [:followers])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @circle }
    end
  end

end
