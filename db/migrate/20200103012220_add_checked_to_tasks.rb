class AddCheckedToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :checked, :boolean
  end
end
