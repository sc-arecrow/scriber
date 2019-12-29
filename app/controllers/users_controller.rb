class UsersController < ApplicationController
  def new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      log_in

      render json: {
        user_created: true,
        user: @user,
        tasks: @user.tasks
      }
    else
      render json: {
        user_created: false
      }
    end
  end
  
  private
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
end
