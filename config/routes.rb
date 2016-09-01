Rails.application.routes.draw do

  namespace :api, default: {format: :json} do
    resources :posts, only: [:index, :show, :create, :update, :destroy]
    # resource :user, only: [:create, :show]
    resources :users, only: [:create, :show, :update] do
      get 'search', on: :collection
    end

    resources :comments, only: [:create, :destroy]
    resources :likes, only: [:index, :create, :destroy]
    resources :hashtags, only: [:show, :create, :destroy] do
      get 'search', on: :collection
    end

    resource :session, only: [:create, :destroy, :show]
  end

  get '/auth/facebook/callback', to: "api/sessions#create_with_facebook"
  get 'api/likes/fetch_with_postId/:id', to: "api/likes#show_with_post_id"
  get 'api/posts/fetch_five/:id', to: "api/posts#fetch_five"

  post 'api/posthashtagrelationships', to: 'api/post_hashtag_relationships#create'
  delete 'api/posthashtagrelationships/delete_with_postId/:post_id', to: 'api/post_hashtag_relationships#destroy'
  delete 'api/hashtags/delete_many_hashtags/:id', to: 'api/hashtags#destroy_many_hashtags'

  delete 'api/likes/delete_with_postId/:id', to: 'api/likes#destroy_with_post_id'

  root to: "static_pages#root"

end
