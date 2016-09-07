class Api::FollowingsController < ApplicationController

  def show
    following = Following.find_by( find_following_params )
    return_value = { followingId: params[:id] }
    if following
      return_value[:currentlyFollowing] = true
    else
      return_value[:currentlyFollowing] = false
    end
    render json: return_value
  end

  def create
    # create or destroy
    existing = Following.find_by( following_id: create_destroy_following_params[:following_id], user_id: current_user.id )
    return_value = { followingId: create_destroy_following_params[:following_id] }
    if existing
      existing.destroy
      return_value[:currentlyFollowing] = false
      render json: return_value
    else
      new_following = Following.new( following_id: create_destroy_following_params[:following_id], user_id: current_user.id )
      if new_following.save
        return_value[:currentlyFollowing] = true
        # debugger
        render json: return_value
      end
    end
  end

  private

  def find_following_params
    { following_id: params[:id], user_id: current_user.id }
  end

  def create_destroy_following_params
    params.require(:following).permit(:following_id)
  end
end
