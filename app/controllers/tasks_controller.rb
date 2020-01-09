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

    if (task_params[:tag_id] == "editing title") || (task_params[:tag_id] == "checking task")
      if @task.update(task_params.except(:tag_id, :tagged))
        render json: {
          task_updated: true,
          tasks: current_user.tasks
        }
      else
        render json: {
          task_updated: false
        }
      end
    else
      @tag = current_user.tags.find(task_params[:tag_id])

      if task_params[:tagged]
        @task.tags.destroy(@tag)
      else
        @task.tags << @tag
      end

      render json: {
        tasks: @tag.tasks
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
      params.require(:task).permit(:title, :checked, :deadline, :tag_id, :tagged)
    end
end