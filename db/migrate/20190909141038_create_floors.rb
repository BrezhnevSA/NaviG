class CreateFloors < ActiveRecord::Migration[6.0]
  def change
    create_table :floors do |t|
      t.string :name
      t.string :short_name, null: true
      t.integer :ord
      t.boolean :active, default: true

      t.references :building

      t.timestamps
    end
  end
end
