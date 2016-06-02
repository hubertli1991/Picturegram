class Api::PostsController < ApplicationController

  def create
    @post = Post.new(post_params)
    if @post.save
      render json: @post
    else
      render json: @post.errors
    end
  end

  def update
    @post = Post.find(param[:id])
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors
    end
  end

  def destroy
  end

  private

  def post_params
    params.require(:post).permit(:picture, :caption)
  end
end
