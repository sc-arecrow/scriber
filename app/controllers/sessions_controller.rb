class SessionsController < ApplicationController
  def new
  end
  
  def create
    session_params = params.permit(:email, :password)
    @user = User.find_by(email: session_params[:email])

    if @user && @user.authenticate(session_params[:password])
      log_in

      render json: {
        logged_in: true,
        user: @user
      }
    else
      render json: {
        logged_in: false
      }
    end
  end

  def welcome
  end
end
