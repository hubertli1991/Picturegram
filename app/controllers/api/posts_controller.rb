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
    if @post.update(post_params)
      render "api/posts/show"
    else
      render json: @post.errors
    end
  end

  def destroy
    @post = Post.find(param[:id])
  end

  private

  def post_params
    params.require(:post).permit(:picture, :caption)
  end
end
