class TagsController < ApplicationController
  def create
    @tag = current_user.tags.new(tag_params)

    if @tag.save
      render json: {
        tag_created: true,
        tags: current_user.tags
      }
    else
      render json: {
        tag_created: false
      }
    end
  end
  
  def show
    @tag = current_user.tags.find(params[:id])
    @tasks = @tag.tasks

    render json: {
      tasks: @tasks
    }
  end

  def update
    @tag = current_user.tags.find(params[:id])

    if @tag.update(tag_params)
      render json: {
        tag_updated: true,
        tags: current_user.tags
      }
    else
      render json: {
        tag_updated: false
      }
    end
  end

  def destroy
    @tag = current_user.tags.find(params[:id])
    @tag.destroy

    render json: {
      tags: current_user.tags
    }
  end

  private
    def tag_params
      params.require(:tag).permit(:name)
    end
end
