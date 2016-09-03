class Api::PostHashtagRelationshipsController < ApplicationController

  def create
    post_id = post_hashtag_params[:post_id]
    post_hashtag_params[:hashtag_id_array].each do |hashtag_id|
      posthashtagrelationship = PostHashtagRelationship.new(post_id: post_id, hashtag_id: hashtag_id)
      posthashtagrelationship.save
    end
    render json: {}
  end

  def destroy
    deleted_relations = []
    destroy_hashtag_params.each do |hashtag_id|
      search_values = {hashtag_id: hashtag_id, post_id: params[:post_id]}
      relation = PostHashtagRelationship.where(search_values)[0]
      if relation.destroy
        deleted_relations.push(relation)
      end
    end
    render json: deleted_relations
  end

  private

  def destroy_hashtag_params
    params[:post_hashtags][:hashtag_id_array]
  end

  def post_hashtag_params
    post_hashtag_params = params.require(:post_hashtags).permit(:post_id)
    post_hashtag_params[:hashtag_id_array] = params[:post_hashtags][:hashtag_id_array]
    post_hashtag_params
  end
end
