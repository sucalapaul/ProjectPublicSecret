class CirclesController < ApplicationController

 before_filter :authenticate_user!, except: [:index]

  # GET /circles
  # GET /circles.json
  def index
    #@client_ip = request.remote_ip

    @c = GeoIP.new('data/GeoLiteCity.dat').city('188.24.108.194') #iau orasul

    #iau id-urile oraselor care corespund coordonatelor
    @city_id = City.find(:all, :select => 'id', :conditions => ["abs(latitude - ?) < 0.1 AND abs(longitude - ?) < 0.1", @c.latitude, @c.longitude] )

    @circles = Circle.where(:city_id => @city_id)
    #@circles = Circle.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @circles }
    end
  end

  # POST /circles
  # POST /circles.json
  def search
    #iau id-urile oraselor care corespund coordonatelor
    @city_id = City.find(:all, :select => 'id', :conditions => ["abs(latitude - ?) < 0.1 AND abs(longitude - ?) < 0.1", params[:city][:latitude], params[:city][:longitude]] )

    @circles = Circle.where(:city_id => @city_id).includes(:city)
    
    @circles.each do |circle|
      circle.joined = current_user.already_joined?(circle.id)
    end
    #@circles = Circle.find(:all, :conditions => [:city_id => @city_id], :include => [:city])
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @circles, :include => :city }
    end
  end

  # GET /circles/1
  # GET /circles/1.json
  def show
    @circle = Circle.find(params[:id], :include => [:gossips])

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

    City.update_counters(city.id, circle_count: 1)   # cresc numarul de cercuri la oras
    User.update_counters(current_user.id, circle_count: 1) # cresc numarul de cercuri la persoana
    @circle.city = city #pun orasul la cerc
    @circle.people_count = 1 # adaug omu care o creat cercul in numaratoare

    respond_to do |format|
      if @circle.save
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
