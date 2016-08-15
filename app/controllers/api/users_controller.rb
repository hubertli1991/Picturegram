class Api::UsersController < ApplicationController

	def show
		@user = User.find(params[:id])
		if @user
			render "api/users/show"
		else
			render json: @user.errors
		end
	end

	def search
		# usernames are unique
		@matched_users = User.where( "lower(username) LIKE ?", '%' + user_search_params["username"].downcase + '%' ).limit(5)
		if @matched_users.length > 0;
			render "api/users/search"
		end
	end

	def create
		@user = User.new(user_params)

		if @user.save
			login(@user)
			render "api/users/show"
		else
			if User.find_by_username(user_params[:username])
				@username_error = "Username has already been taken"
			elsif user_params[:username] == ""
				@username_error = "Username cannot be blank"
			end

			if user_params[:password].length < 6
				@password_error = "Password must have at least 6 characters"
			end
			render "api/shared/error", status: 500
		end
	end

	def update
		@user = User.find(params[:id])
		if @user.update(user_profile_params)
			render "api/users/show"
		end
	end

	private
	def user_search_params
		params.require(:user).permit(:username)
	end

	def user_profile_params
		params.require(:user).permit(:profile_picture, :bio)
	end

	def user_params
		params.require(:user).permit(:username, :password)
	end

end
