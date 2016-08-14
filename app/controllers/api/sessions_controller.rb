class Api::SessionsController < ApplicationController

	def create
		@user = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )

    if @user
			login(@user)
			render "api/users/show"
		else
			@login_error = "Invalid username/password combination"
			render "api/shared/error", status: 401
		end
	end

	def create_with_facebook
		@user = User.find_or_create_with_auth_hash(auth_hash)
		login(@user)
		redirect_to root_url
	end

	def destroy
		@user = current_user
		if @user
			logout
			render "api/users/show"
		else
			render(
        json: {
          base: ["Nobody signed in"]
        },
        status: 404
      )
		end
	end

	def show
		if current_user
			@user = current_user
			render "api/users/show"
		else
			render json: {}
		end
	end

	def auth_hash
		request.env['omniauth.auth']
	end
end
