require 'test_helper'

class GossipVotesControllerTest < ActionController::TestCase
  setup do
    @gossip_vote = gossip_votes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:gossip_votes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create gossip_vote" do
    assert_difference('GossipVote.count') do
      post :create, gossip_vote: { gossip_id: @gossip_vote.gossip_id, user_id: @gossip_vote.user_id, value: @gossip_vote.value }
    end

    assert_redirected_to gossip_vote_path(assigns(:gossip_vote))
  end

  test "should show gossip_vote" do
    get :show, id: @gossip_vote
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @gossip_vote
    assert_response :success
  end

  test "should update gossip_vote" do
    put :update, id: @gossip_vote, gossip_vote: { gossip_id: @gossip_vote.gossip_id, user_id: @gossip_vote.user_id, value: @gossip_vote.value }
    assert_redirected_to gossip_vote_path(assigns(:gossip_vote))
  end

  test "should destroy gossip_vote" do
    assert_difference('GossipVote.count', -1) do
      delete :destroy, id: @gossip_vote
    end

    assert_redirected_to gossip_votes_path
  end
end
