module SessionsHelper
  def log_in
    session[:user_id] = @user.id
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def log_out
    session.clear
  end
end
