Rails.application.routes.draw do

  namespace :api, default: {format: :json} do
    resources :posts, only: [:index, :show, :create, :update, :destroy]
    # resource :user, only: [:create, :show]
    resources :users, only: [:create, :show, :update]
    resources :comments, only: [:create, :destroy]
    resource :session, only: [:create, :destroy, :show]
  end

  get '/auth/facebook/callback', to: "api/sessions#create_with_facebook"

  root to: "static_pages#root"

end
