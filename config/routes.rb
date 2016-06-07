Rails.application.routes.draw do

  namespace :api, default: {format: :json} do
    resources :posts, only: [:show, :create, :update, :destroy]
    # resource :user, only: [:create, :show]
    resources :users, only: [:create, :show]
    resources :comments, only: [:create, :destroy]
    resource :session, only: [:create, :destroy, :show]
  end

  root to: "static_pages#root"

end
