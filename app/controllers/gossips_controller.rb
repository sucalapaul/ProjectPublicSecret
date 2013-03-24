class GossipsController < ApplicationController

  before_filter :authenticate_user!, except: [:index, :show] 
  
  load_and_authorize_resource except: [:index, :show] 
  #skip_authorize_resource  :only => :index # asta-i cam hackish, da cred ca merge
                                          # ok... nu merge, un user nou, logat, pote intra pe index.
                                          # trebe scos redirectul spre weolcome de aci.
  
  # GET /gossips
  # GET /gossips.json  
  def index
    #redirect_to "/gossips/9" and return

    # TODO: move handling facebook requests from here
    Rails.logger.debug("dbg:1 #{params[:request_ids]}, clasa: #{params[:request_ids].class}")
    if params[:request_ids]
      rid = params[:request_ids].split(",").last
      Rails.logger.debug("dbg:1 #{rid}, clasa: #{rid.class}") 
      

      if !user_signed_in?
        facebookRequest = FacebookRequest.where(rid: rid).first        
      else
        facebookRequest = FacebookRequest.where(rid: rid, to_user_id: current_user.uid).first
        facebookRequest.click_date = Time.now
        facebookRequest.app_request_type = params[:app_request_type]
        facebookRequest.ref = params[:ref]
        facebookRequest.save
      end

      path = File.join(SITE_URL, facebookRequest.url)
      # URI.join(SITE_URL, facebookRequest.url)
      redirect_to path and return
    end

    if !user_signed_in? 
      redirect_to "/welcome" and return
    end

    @gossips = current_user.gossips_feed.order("created_at desc") .page(params[:page]).per_page(10)
    @gossips.each do |g|
      g.last_comments = Comment.where("gossip_id = ?", g.id).order("created_at desc").limit(COMMENTS_PER_GOSSIP).reverse

    end

    # respond_to do |format|
    #   format.html # index.html.erb
    #   format.json { render json: @gossips }
    # end
  end

  # GET /gossips/1
  # GET /gossips/1.json
  def show
    @gossip = Gossip.find(params[:id], :include => :comments)
    #@gossip.comments = Comment.where("gossip_id = ?", params[:id]).order("created_at desc").limit(3).reverse

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @gossip }
    end
  end

  # GET /gossips/new
  # GET /gossips/new.json
  def new
    @gossip = Gossip.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @gossip }
    end
  end

  # GET /gossips/1/edit
  def edit
    @gossip = Gossip.find(params[:id])
  end

  # POST /gossips
  # POST /gossips.json
  def create
    @gossip = Gossip.new(params[:gossip])
    @gossip.user = current_user

    User.update_counters(current_user.id, gossip_count: 1) # cresc numarul de gossips la persoana
    Circle.update_counters(@gossip.circle_id, gossip_count: 1) # cresc numarul de gossips la cerc

    respond_to do |format|
      if @gossip.save
        format.html { redirect_to @gossip, notice: 'Gossip was successfully created.' }
        format.json { render json: {
              'html' => render_to_string( partial: "gossip", locals: { gossip: @gossip, hidden: true, no_comments: true }, formats: [:html])
          }, status: :created, location: @gossip }
      else
        format.html { render action: "new" }
        format.json { render json: @gossip.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /gossips/1
  # PUT /gossips/1.json
  def update
    @gossip = Gossip.find(params[:id])

    respond_to do |format|
      if @gossip.update_attributes(params[:gossip])
        format.html { redirect_to @gossip, notice: 'Gossip was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @gossip.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gossips/1
  # DELETE /gossips/1.json
  def destroy
    @gossip = Gossip.find(params[:id])
    @gossip.destroy

    respond_to do |format|
      format.html { redirect_to gossips_url }
      format.json { head :no_content }
    end
  end
end
