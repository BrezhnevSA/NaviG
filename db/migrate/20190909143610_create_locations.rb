class CreateLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :locations do |t|
      t.string :name
      t.string :description
      t.string :costcenter
      t.string :dots
      t.integer :top
      t.integer :left
      t.integer :costcenter_num
      t.string :is_real, default: true, null: false

      t.references :floor, null: true
      t.references :location_type, null: true

      t.timestamps
    end
  end
end
