class AddDeadlineToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :deadline, :string
  end
end
