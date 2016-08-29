class Api::PostHashtagRelationshipsController < ApplicationController

  def create
    post_id = post_hashtag_params[:post_id]
    post_hashtag_params[:hashtag_id_array].each do |hashtag_id|
      posthashtagrelationship = PostHashtagRelationship.new(post_id: post_id, hashtag_id: hashtag_id)
      posthashtagrelationship.save
    end
    render json: {}
  end

  private

  def post_hashtag_params
    post_hashtag_params = params.require(:post_hashtag).permit(:post_id)
    post_hashtag_params[:hashtag_id_array] = params[:post_hashtag][:hashtag_id_array]
    post_hashtag_params
  end
end
