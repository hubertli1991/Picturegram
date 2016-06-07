class Api::PostsController < ApplicationController

  def show
    @post = Post.find(param[:id])
    if @post
      render "api/posts/show"
    else
      render json: @post.errors
    end
  end

  def create
    @post = Post.new(post_params)
    @post.user_id = current_user.id
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
    params.require(:post).permit(:image, :caption)
  end
end
