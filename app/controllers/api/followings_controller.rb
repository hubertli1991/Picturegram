class Api::FollowingsController < ApplicationController

  def index
    followers = User.find(params[:user_id]).followers
    followees = User.find(params[:user_id]).followees
    @matched_users = { followers: followers, followees: followees }
    render "/api/users/following"
  end

  def show
    following = Following.find_by( find_following_params )
    # return_value = { followingId: params[:id] }
    if following
      # return_value[:currentlyFollowing] = true
      you = User.find(params[:id]).followers.find(current_user.id)
      @matched_users = { followers: [you] }
    else
      @matched_users = {}
    end
    render "/api/users/following"
  end

  def create
    # create or destroy
    existing = Following.find_by( following_id: create_destroy_following_params[:following_id], user_id: current_user.id )
    # return_value = { followingId: create_destroy_following_params[:following_id] }
    if existing
      # @matched_users = [ current_user.followees.find(create_destroy_following_params[:following_id]) ]
      existing.destroy
      # return_value[:currentlyFollowing] = false
      # render json: return_value
      # render "/api/users/search"
      @matched_users = {}
    else
      new_following = Following.new( following_id: create_destroy_following_params[:following_id], user_id: current_user.id )
      if new_following.save
        # return_value[:currentlyFollowing] = true
        # render json: return_value
        you = User.find(create_destroy_following_params[:following_id]).followers.find(current_user.id)
        @matched_users = { followers: [you] }
      end
    end
    render "/api/users/following"
  end

  private

  def find_following_params
    { following_id: params[:id], user_id: current_user.id }
  end

  def create_destroy_following_params
    params.require(:following).permit(:following_id)
  end

end
