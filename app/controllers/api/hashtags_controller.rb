class Api::HashtagsController < ApplicationController

  def show
    @hashtag = Hashtag.find(params[:id])
    if @hashtag
      render "api/hashtags/show"
    end
  end

  def create
    post_id = hashtags_params[:post_id]
    @relationships = {post_id: post_id, hashtag_id_array: []}
    hashtags_params[:hashtags_array].uniq.each do |hashtag|
      # hashtags_params[:hashtags_array] looks like { 0 => [#newyork, 2], 1 => [#summer, 9] }
      if existing_hashtag = Hashtag.find_by(hashtag: hashtag )
        existing_hashtag.update(count: existing_hashtag.count += 1)
        @relationships[:hashtag_id_array].push(existing_hashtag.id)
      else
        new_hashtag = Hashtag.new(hashtag: hashtag, count: 1)
        if new_hashtag.save
          @relationships[:hashtag_id_array].push(new_hashtag.id)
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
      if hashtag && hashtag.count == 1
        hashtag.destroy
      elsif hashtag
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
    hashtags_params[:hashtags_array] = params[:hashtags][:hashtags_array].map do |idx, hashtag|
      hashtag[0].downcase
    end
    hashtags_params
  end
end
