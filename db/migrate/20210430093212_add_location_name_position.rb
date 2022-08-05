class AddLocationNamePosition < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :name_position, :string
  end
end
