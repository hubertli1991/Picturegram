class Api::FollowingsController < ApplicationController

  def index
    followers = User.find(params[:user_id]).followers
    followees = User.find(params[:user_id]).followees
    @matched_users = { followers: followers, followees: followees }
    render "/api/users/following"
  end

  def show
    following = Following.find_by( find_following_params )
    if following
      other_guy = User.find(params[:id])
      you = other_guy.followers.find(current_user.id)
      @matched_users = { followers: [you], followees: [other_guy] }
    else
      @matched_users = {}
    end
    render "/api/users/following"
  end

  def create
    # create or destroy
    existing = Following.find_by( following_id: create_destroy_following_params[:following_id], user_id: current_user.id )
    if existing
      existing.destroy
      @matched_users = {}
    else
      new_following = Following.new( following_id: create_destroy_following_params[:following_id], user_id: current_user.id )
      if new_following.save
        other_guy = User.find(create_destroy_following_params[:following_id])
        you = other_guy.followers.find(current_user.id)
        @matched_users = { followers: [you], followees: [other_guy] }
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
