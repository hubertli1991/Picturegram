class Api::CommentsController < ApplicationController

  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id
    @post = Post.find(comment_params["post_id"].to_i)
    if @comment.save
      # debugger
      render "api/posts/show"
    else
      render json: @comment.errors
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    if @comment.delete
      render "api/posts/show"
    else
      render json: @comment.errors
    end
  end

  def comment_params
    params.require(:comment).permit(:body, :post_id)
  end
end
