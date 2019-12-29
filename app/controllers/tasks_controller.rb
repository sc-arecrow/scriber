class TasksController < ApplicationController
  def create
    @task = current_user.tasks.new(task_params)

    if @task.save
      render json: {
        task_created: true,
        tasks: current_user.tasks
      }
    else
      render json: {
        task_created: false
      }
    end
  end

  def update
    @task = current_user.tasks.find(params[:id])

    if @task.update(task_params)
      render json: {
        task_updated: true,
        tasks: current_user.tasks
      }
    else
      render json: {
        task_updated: false
      }
    end
  end
  
  def destroy
    @task = current_user.tasks.find(params[:id])
    @task.destroy

    render json: {
      tasks: current_user.tasks
    }
  end
  
  private
    def task_params
      params.require(:task).permit(:title)
    end
end