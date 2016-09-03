class Api::PostsController < ApplicationController

  def index
    @posts = Post.all.order( created_at: :desc )
    render "api/posts/index"
  end

  def fetch_five

    @all_posts = Post.all.order( created_at: :desc )
    if params[:id] == 'first'
      start_index = 0
    elsif @last_post = Post.find(params[:id])
      start_index = @all_posts.index(@last_post) + 1
    end

    if start_index && start_index <= @all_posts.length - 1
      @posts = @all_posts[ start_index.. start_index + 4 ]
      render "api/posts/index"
    end
  end

  def show
    @post = Post.find(params[:id])
    if @post
      render "api/posts/show"
    else
      render json: @post.errors
    end
  end

  def create
    if post_params[:image] == "null" || post_params[:caption] == "null" || post_params[:caption] == ""

      if post_params[:image] == "null"
        @post_image_error = "Please upload an image"
      end

      if post_params[:caption] == "null" || post_params[:caption] == ""
        @post_caption_error = "Please write a caption"
      end

      render "api/shared/error", status: 500
    else
      @post = Post.new(post_params)
      @post.user_id = current_user.id
      if @post.save
        render "api/posts/show"
      end
    end

    # @post = Post.new(post_params)
    # @post.user_id = current_user.id
    # if post_params[:image] && @post.save
    #   render "api/posts/show"
    # else
    #   if !post_params[:image]
    #     @post_image_error = "Please upload an image"
    #   end
    #
    #   if post_params[:caption].nil? || post_params[:caption] == ""
    #     @post_caption_error = "Please write a caption"
    #   end
    #
    #   render "api/shared/error", status: 500
    # end
  end

  def update
    @post = Post.find(params[:id])
    if update_params[:caption].length == 0
      @post_caption_error = "Please write a caption"
      render "api/shared/error", status: 500
    # else
    #   render json: {}
    elsif @post.update(update_params)
      render json: {}
    end
  end

  def destroy
    @post = Post.find(params[:id])
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
