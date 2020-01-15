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
        tasks: @user.tasks,
        tags: @user.tags
      }
    else
      render json: {
        user_created: false,
        errors: @user.errors
      }
    end
  end

  def update
    password_params = params.require(:user).permit(:old_password, :new_password, :new_password_confirmation)
    if (current_user.authenticate(password_params[:old_password]))
      user_params = {
        email: current_user[:email],
        password: password_params[:new_password],
        password_confirmation: password_params[:new_password_confirmation]
      }

      if current_user.update(user_params)
        render json: {
          correct_old_password: true,
          password_updated: true
        }
      else
        render json: {
          correct_old_password: true,
          password_updated: false,
          errors: current_user.errors
        }
      end
    else
      render json: {
        correct_old_password: false,
        password_updated: false
      }
    end
  end

  def destroy
    @user = current_user
    log_out
    @user.destroy

    render json: {
      user_destroyed: true
    }
  end
  
  private
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
end
