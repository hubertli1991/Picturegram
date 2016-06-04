class Api::PostsController < ApplicationController

  def create
    @post = Post.new(post_params)
    if @post.save
      render "api/posts/show"
    else
      render json: @post.errors
    end
  end

  def update
    @post = Post.find(param[:id])
    if @post.update(update_params)
      render "api/posts/show"
    else
      render json: @post.errors
    end
  end

  def destroy
    @post = Post.find(param[:id])
    if @post.destroy
      render "api/posts/show"
    else
      render json: @post.errors
    end
  end

  private

  def update_params
    params.require(:post).permit(:caption)
  end

  def post_params
    params.require(:post).permit(:image, :caption, :user_id)
  end
end
