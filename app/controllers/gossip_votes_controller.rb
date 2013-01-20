class GossipVotesController < ApplicationController
  # # GET /gossip_votes
  # # GET /gossip_votes.json
  # def index
  #   @gossip_votes = GossipVote.all

  #   respond_to do |format|
  #     format.html # index.html.erb
  #     format.json { render json: @gossip_votes }
  #   end
  # end

  # # GET /gossip_votes/1
  # # GET /gossip_votes/1.json
  # def show
  #   @gossip_vote = GossipVote.find(params[:id])

  #   respond_to do |format|
  #     format.html # show.html.erb
  #     format.json { render json: @gossip_vote }
  #   end
  # end

  # # GET /gossip_votes/new
  # # GET /gossip_votes/new.json
  # def new
  #   @gossip_vote = GossipVote.new

  #   respond_to do |format|
  #     format.html # new.html.erb
  #     format.json { render json: @gossip_vote }
  #   end
  # end

  # # GET /gossip_votes/1/edit
  # def edit
  #   @gossip_vote = GossipVote.find(params[:id])
  # end

  # POST /gossip_votes
  # POST /gossip_votes.json
  def create
    gossip_id = params[:gossip_vote][:gossip_id]
    value = params[:gossip_vote][:value]

    gossip_vote = GossipVote.where(gossip_id: gossip_id, user_id: current_user.id).first_or_initialize

    vote_this = 0
    vote_other = 0
    vote_response = 0

    Rails.logger.debug("My object: #{gossip_vote.to_yaml}, #{value}")
    #code duplicate with js :|
    if gossip_vote.persisted?
      if gossip_vote.value == value.to_bool
        #click on a checked button
        vote_response = -1
        vote_this = -1
        gossip_vote.delete
      else
        #click on other button
        vote_response = 0
        vote_this = 1
        vote_other = -1
        gossip_vote.value = value.to_bool
        gossip_vote.save
      end
    else
      gossip_vote.value = value.to_bool
      if gossip_vote.save
        #first click
        vote_response = 1
        vote_this = 1
      end
    end

    if value.to_bool == true
      Gossip.update_counters(gossip_id, true_count: vote_this)
      Gossip.update_counters(gossip_id, false_count: vote_other)
    else
      Gossip.update_counters(gossip_id, true_count: vote_other)
      Gossip.update_counters(gossip_id, false_count: vote_this)
    end


    respond_to do |format|
      format.json { render json: vote_response, status: :created }
    end
  end

  # # PUT /gossip_votes/1
  # # PUT /gossip_votes/1.json
  # def update
  #   @gossip_vote = GossipVote.find(params[:id])

  #   respond_to do |format|
  #     if @gossip_vote.update_attributes(params[:gossip_vote])
  #       format.html { redirect_to @gossip_vote, notice: 'Gossip vote was successfully updated.' }
  #       format.json { head :no_content }
  #     else
  #       format.html { render action: "edit" }
  #       format.json { render json: @gossip_vote.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /gossip_votes/1
  # # DELETE /gossip_votes/1.json
  # def destroy
  #   @gossip_vote = GossipVote.find(params[:id])
  #   @gossip_vote.destroy

  #   respond_to do |format|
  #     format.html { redirect_to gossip_votes_url }
  #     format.json { head :no_content }
  #   end
  # end
end
