class CreateBuildings < ActiveRecord::Migration[6.0]
  def change
    create_table :buildings do |t|
      t.string :name
      t.string :short_name, null: true
      t.string :coords
      t.boolean :active, default: true
      t.float :ord
      t.references :office

      t.timestamps
    end
  end
end
