class CreateRights < ActiveRecord::Migration[6.0]
  def change
    create_table :rights do |t|
      t.string :name
      t.string :machine_name
      t.string :description

      t.timestamps
    end
  end
end
