class CirclesController < ApplicationController

 before_filter :authenticate_user!
 load_and_authorize_resource :except => [:search, :mycircles, :join]

  # GET /circles
  # GET /circles.json
  def index
    @client_ip = request.remote_ip
    
    if params[:tag]
      @circles = Circle.tagged_with(params[:tag]).paginate(:page => params[:circle_page], :per_page => 10)
    else
      @c = GeoIP.new('data/GeoLiteCity.dat').city(client_ip) #iau orasul

      if @c != nil
        #iau id-urile oraselor care corespund coordonatelor, doar daca am gasit ceva oras cu ip-ul dat
        @city_id = City.find(:all, :select => 'id', :conditions => ["abs(latitude - ?) < 0.1 AND abs(longitude - ?) < 0.1", @c.latitude, @c.longitude] )
      else
        @city_id = 0 #altfel, ii dau orasului id=0, adica nu am gasit oras
      end

      @circles = Circle.where(:city_id => @city_id).paginate(:page => params[:circle_page], :per_page => 10)
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: {
              'html' => render_to_string( partial: "circle_header", :as => :circle, :collection => @circles, formats: [:html])
          }, status: :created, location: @gossip }
    end
  end


  def search
    #iau id-urile oraselor care corespund coordonatelor
    @city_id = City.find(:all, :select => 'id', :conditions => ["abs(latitude - ?) < 0.1 AND abs(longitude - ?) < 0.1", params[:city][:latitude], params[:city][:longitude]] )

    @circles = Circle.where(:city_id => @city_id).includes(:city).paginate(:page => params[:circle_search], :per_page => 5)
    
    @circles.each do |circle|
      circle.joined = current_user.already_joined?(circle.id)

    end
    #@circles = Circle.find(:all, :conditions => [:city_id => @city_id], :include => [:city])
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: {
              'html' => render_to_string( partial: "circle_header", :as => :circle, :collection => @circles, formats: [:html]),
              'pg' => @circles.total_pages
          }, status: :created, location: @gossip }
    end
  end

  # POST /circles
  # POST /circles.json
  def mycircles
    #iau cercurile userului
    @circles = current_user.circles
    
    #redundant, dar trebuie
    @circles.each do |circle|
      circle.joined = current_user.already_joined?(circle.id)
    end
    
    respond_to do |format|
      format.html # index.html.erb
      #format.json { render json: @circles, :include => :city }
      format.json { render json: {
              'html' => render_to_string( partial: "circle_header", :as => :circle, :collection => @circles, formats: [:html])
          }, status: :created, location: @gossip }
    end
  end


  # GET /circles/1
  # GET /circles/1.json
  def show
    @circle = Circle.find(params[:id], :include => [:gossips])

    @circle.gossips.each do |g|
      g.last_comments = Comment.where("gossip_id = ?", g.id).order("created_at desc").limit(COMMENTS_PER_GOSSIP).reverse
    end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @circle }
    end
  end

  # GET /circles/new
  # GET /circles/new.json
  def new
    @circle = Circle.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @circle }
    end
  end

  # GET /circles/1/edit
  def edit
    @circle = Circle.find(params[:id])
  end

  # POST /circles
  # POST /circles.json
  def create
    @circle = Circle.new(params[:circle].except(:city_name, :city_lat, :city_long))
    @circle.users << current_user

    city = City.where(name: params[:circle][:city_name]).first_or_initialize
    if not city.persisted? 
      city.latitude = params[:circle][:city_lat]
      city.longitude = params[:circle][:city_long]
      city.save
    end


    @circle.city = city #pun orasul la cerc
    @circle.people_count = 1 # adaug omu care o creat cercul in numaratoare

    respond_to do |format|
      if @circle.save
        City.update_counters(city.id, circle_count: 1)   # cresc numarul de cercuri la oras
        User.update_counters(current_user.id, circle_count: 1) # cresc numarul de cercuri la persoana
        format.html { redirect_to @circle, notice: 'Circle was successfully created.' }
        format.json { render json: @circle, status: :created, location: @circle }
      else
        
        format.html { render action: "new" }
        format.json { render json: @circle.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /circles
  # POST /circles.json
  def join
    joined = CircleUser.where(circle_id: params[:circle][:circle_id], user_id: current_user.id).first_or_initialize

    respond_to do |format|
      if not joined.persisted?
        joined.save
        Circle.update_counters(params[:circle][:circle_id], people_count: 1)
        User.update_counters(current_user.id, circle_count: 1)
        mod = 1
      else
        joined.delete
        Circle.update_counters(params[:circle][:circle_id], people_count: -1)
        User.update_counters(current_user.id, circle_count: -1)
        mod = -1
      end
      format.json { render json: mod, status: :created }
    end
  end

  # PUT /circles/1
  # PUT /circles/1.json
  def update
    @circle = Circle.find(params[:id])

    respond_to do |format|
      if @circle.update_attributes(params[:circle])
        format.html { redirect_to @circle, notice: 'Circle was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @circle.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /circles/1
  # DELETE /circles/1.json
  def destroy
    @circle = Circle.find(params[:id])
    @circle.destroy

    respond_to do |format|
      format.html { redirect_to circles_url }
      format.json { head :no_content }
    end
  end
end
