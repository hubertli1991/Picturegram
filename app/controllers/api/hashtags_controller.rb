class Api::HashtagsController < ApplicationController

  def show
    @hashtag = Hashtag.find(params[:id])
    if @hashtag
      render "api/hashtags/show"
    end
  end

  def create
    # debugger
    post_id = hashtags_params[:post_id]
    @relationships = {post_id: post_id, hashtag_id_array: []}
    hashtags_params[:hashtags_array].each do |pair|
      # hashtags_params[:hashtags_array] looks like { 0 => [#newyork, 2], 1 => [#summer, 9] }
      if existing_hashtag = Hashtag.find_by(hashtag: pair[1][0])
        existing_hashtag.update(count: existing_hashtag.count += 1)
        @relationships[:hashtag_id_array].push(existing_hashtag.id)
      else
        hashtag = Hashtag.new(hashtag: pair[1][0], count: 1)
        if hashtag.save
          @relationships[:hashtag_id_array].push(hashtag.id)
        end
      end
    end
    render json: @relationships
  end

  def search
    @matched_hashtags = Hashtag.where( "lower(hashtag) LIKE ?", '%' + hashtag_search_params["search_value"].downcase + '%' ).limit(5)
    if @matched_hashtags.length > 0;
      render "api/hashtags/search"
    end
  end

  def destroy_many_hashtags
    delete_many_params.each do |hashtag_id|
      hashtag = Hashtag.find(hashtag_id)
      if hashtag.count == 1
        # debugger
        hashtag.destroy
      else
        new_count = hashtag.count - 1
        hashtag.update(count: new_count)
      end
    end

    render json: {}
  end

  private

  def delete_many_params
    params[:hashtags][:hashtag_id_array]
  end

  def hashtag_search_params
    params.require(:hashtag).permit(:search_value)
  end

  def hashtags_params
    # hashtags_params = params.require(:hashtags).permit(:post_id).permit(:hashtags_array)
    hashtags_params = params.require(:hashtags).permit(:post_id)
    hashtags_params[:hashtags_array] = params[:hashtags][:hashtags_array]
    hashtags_params
  end
end
