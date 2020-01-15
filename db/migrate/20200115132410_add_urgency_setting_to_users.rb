class AddUrgencySettingToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :urgency_setting, :string
  end
end
