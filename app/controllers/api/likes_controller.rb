class Api::LikesController < ApplicationController

  def index
  end

  def show_with_post_id
    # debugger
    @likes = Like.where(post_id: params[:id])
    count = @likes.count
    postId = params[:id].to_sym
    @return_object = {postId => { postId: params[:id], count: count, permissionToLike: true }}
    @likes.each do |like_object|
      if like_object[:user_id] == current_user.id
        @return_object[postId][:permissionToLike] = false
      end
    end
    render json: @return_object
  end

  def create
    @like = Like.new(like_params)
    @like.user_id = current_user.id
    @like.username = current_user.username
    if @like.save
      puts "saved"
      count = Like.where(post_id: @like.post_id).count

      render json: {like_params[:post_id].to_sym => { postId: @like.post_id, count: count, permissionToLike: false }}
    end
  end

  def destroy_with_post_id
    @like = Like.find_by(post_id: params[:id], user_id: current_user.id)
    if @like
      @like.destroy
      count = Like.where(post_id: @like.post_id).count
      postId = params[:id].to_sym
      @return_object = { postId => { postId: params[:id], count: count, permissionToLike: true } }
      render json: @return_object
    end
  end

  private

  def like_params
    params.require(:like).permit(:post_id)
  end
end
