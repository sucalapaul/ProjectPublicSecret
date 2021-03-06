class LikesController < ApplicationController
  # # GET /likes
  # # GET /likes.json
  def index
    
    params[:q] = params[:q].downcase

    @tags = ActsAsTaggableOn::Tag.where("name like ?", "%#{params[:q]}%")
    if @tags.empty?
      @tags = [{id: "#{params[:q]}", name: "New: \"#{params[:q]}\""}]
    else
      @tags_hack = []

      @tags.each do |tag|
        tag_hack = { id: tag.name, name: tag.name }
        @tags_hack << tag_hack
      end

      @tags = @tags_hack
    end
    respond_to do |format|
      format.html
      format.json { render :json => @tags }
    end
  end

  # # GET /likes/1
  # # GET /likes/1.json
  # def show
  #   @like = Like.find(params[:id])

  #   respond_to do |format|
  #     format.html # show.html.erb
  #     format.json { render json: @like }
  #   end
  # end

  # # GET /likes/new
  # # GET /likes/new.json
  # def new
  #   @like = Like.new

  #   respond_to do |format|
  #     format.html # new.html.erb
  #     format.json { render json: @like }
  #   end
  # end

  # # GET /likes/1/edit
  # def edit
  #   @like = Like.find(params[:id])
  # end

  # POST /likes
  # POST /likes.json
  def create
    like = Like.where(gossip_id: params[:like][:gossip_id], user_id: current_user.id).first_or_initialize
    # if not like.persisted?
    #   if like.save
    #   #count = Like.where(gossip_id: params[:like][:gossip_id]).count
    #   mod = Gossip.update_counters(params[:like][:gossip_id], like_count: 1)
    #   render json: mod
    # else
    #   render json: @like.errors, status: :unprocessable_entity 
    # end

    respond_to do |format|
      if not like.persisted?
        like.save
        Gossip.update_counters(params[:like][:gossip_id], like_count: 1)
        mod = 1
      else
        like.delete
        Gossip.update_counters(params[:like][:gossip_id], like_count: -1)
        mod = -1
      end
      format.json { render json: mod, status: :created }
    end
  end

  # # PUT /likes/1
  # # PUT /likes/1.json
  # def update
  #   @like = Like.find(params[:id])

  #   respond_to do |format|
  #     if @like.update_attributes(params[:like])
  #       format.html { redirect_to @like, notice: 'Like was successfully updated.' }
  #       format.json { head :no_content }
  #     else
  #       format.html { render action: "edit" }
  #       format.json { render json: @like.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /likes/1
  # # DELETE /likes/1.json
  # def destroy
  #   @like = Like.find(params[:id])
  #   @like.destroy

  #   respond_to do |format|
  #     format.html { redirect_to likes_url }
  #     format.json { render json: "sdf":"sdf" } #head :no_content }
  #   end
  # end
end
