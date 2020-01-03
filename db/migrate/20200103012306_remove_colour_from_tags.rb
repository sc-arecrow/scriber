class RemoveColourFromTags < ActiveRecord::Migration[6.0]
  def change

    remove_column :tags, :colour, :string
  end
end
