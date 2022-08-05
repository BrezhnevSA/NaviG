class CreateCities < ActiveRecord::Migration[6.0]
  def change
    create_table :cities do |t|
      t.string :name
      t.string :short_name, null: true
      t.float :ord
      t.boolean :active, default: true

      # t.references :contracts, index: true
      
      t.timestamps
    end
  end
end
