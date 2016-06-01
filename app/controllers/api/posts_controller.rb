class Api::PostsController < ApplicationController

  def show
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def post_params
    params.require(:post).permit(:picture, :caption)
  end
end
