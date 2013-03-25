class CirclesController < ApplicationController

 before_filter :authenticate_user!
 load_and_authorize_resource :except => [:search, :mycircles, :join]

  # GET /circles
  # GET /circles.json
  def index

    min_tolerance = 0.1
    max_tolerance = 2 # ~200km
    tolerance = min_tolerance
    
    if params[:tag]
      # search by tags
      @circles = Circle.tagged_with(params[:tag]).paginate(:page => params[:circle_page], :per_page => 10)

    else
      # search by location
      client_ip = request.remote_ip
      @c = GeoIP.new('data/GeoLiteCity.dat').city(client_ip) #iau orasul
      if @c != nil
        # daca am gasit localitatea dupa IP
        # caut cercuri in orase tot mai indepartate, pana gasesc vreun cerc sau pana depasesc o limita de distanta
        while true do
          @city_id = City.find(:all, :select => 'id', :conditions => ["abs(latitude - ?) < ? AND abs(longitude - ?) < ?", @c.latitude, tolerance, @c.longitude, tolerance] )
          @circles = Circle.where(:city_id => @city_id).paginate(:page => params[:circle_page], :per_page => 10)

          if @circles.count > 0 || tolerance > max_tolerance
            break
          end

          tolerance = tolerance * 2
        end
      else
        # altfel, ii dau orasului id=0, adica nu am gasit orasului
        @city_id = 0 
        @circles = Circle.where(:city_id => @city_id).paginate(:page => params[:circle_page], :per_page => 10)
        @location_unknown = true
      end
    end

    if (@location_unknown.nil? || !@location_unknown) && @circles.count == 0  
      # known location, but no results
      @no_circles = true
    end

    @hide_invite_button = true

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

    @circles = Circle.where(:city_id => @city_id).includes(:city).paginate(:page => params[:circle_search], :per_page => 100)
    
    @circles.each do |circle|
      circle.joined = current_user.already_joined?(circle.id)

    end

    @hide_invite_button = true
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

    @hide_invite_button = true
    
    respond_to do |format|
      format.html # index.html.erb
      #format.json { render json: @circles, :include => :city }
      format.json { render json: {
              'html' => render_to_string( partial: "circle_header", :as => :circle, :collection => @circles, formats: [:html])
          }, status: :created, location: @gossip }
    end
  end

  def preview
    # not used

    # preview of the circle header 
    # and ask for login with facebook
  end


  # GET /circles/1
  # GET /circles/1.json
  def show

    # render action: "preview" and return
    @circle = Circle.find(params[:id], :include => [:gossips])

    @circle.gossips.each do |g|
      g.last_comments = Comment.where("gossip_id = ?", g.id).order("created_at desc").limit(COMMENTS_PER_GOSSIP).reverse
    end

    @og_type = "thegossip:circle"
    @og_title = "a circle"
    @og_url = File.join(SITE_URL, "circles/#{@circle.id}")
    @og_description = "#{@circle.name} \n #{@circle.description}"

    @post_created_circle = params[:post_created]

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
        @post_created_circle = false
        City.update_counters(city.id, circle_count: 1)   # cresc numarul de cercuri la oras
        User.update_counters(current_user.id, circle_count: 1) # cresc numarul de cercuri la persoana
        format.html { redirect_to circle_path(@circle, post_created: "true") }
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
    circle_id = params[:circle][:circle_id]
    circle_url = File.join(SITE_URL, "circles/#{circle_id}")

    joined = CircleUser.where(circle_id: circle_id, user_id: current_user.id).first_or_initialize

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
      format.json { render json: {'status' => mod, 'circle_url' => circle_url}, status: :created }
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
