class ChangeTaskChecked < ActiveRecord::Migration[6.0]
  def change
    change_column :tasks, :checked, :string
  end
end
