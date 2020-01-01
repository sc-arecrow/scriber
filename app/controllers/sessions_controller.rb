class SessionsController < ApplicationController
  def new
  end
  
  def create
    session_params = params.require(:session).permit(:email, :password)
    @user = User.find_by(email: session_params[:email])

    if @user && @user.authenticate(session_params[:password])
      log_in

      render json: {
        logged_in: true,
        user: @user,
        tasks: @user.tasks,
        tags: @user.tags
      }
    else
      render json: {
        logged_in: false
      }
    end
  end

  def destroy
    log_out

    render json: {
      logged_out: true
    }
  end

  def welcome
  end
end
