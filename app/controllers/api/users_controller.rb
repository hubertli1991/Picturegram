class Api::UsersController < ApplicationController

	def show
		@user = User.find(params[:id])
		if @user
			render "api/users/show"
		else
			render json: @user.errors
		end
	end

	def create
		@user = User.new(user_params)

		if @user.save
			login(@user)
			render "api/users/show"
		else
			render json: @user.errors, status: 422
		end
	end

	def update
		@user = User.find(params[:id])
		if @user.update(user_profile_params)
			render "api/users/show"
		else
			render json: @user.errors
		end
	end

	private

	def user_profile_params
		params.require(:user).permit(:profile_picture, :bio)
	end

	def user_params
		params.require(:user).permit(:username, :password)
	end

end
