class CreateContracts < ActiveRecord::Migration[6.0]
  def change 
    create_table :contracts do |t|
      t.integer :city_id
      t.string :name
      t.float :price

      t.timestamps
    end
  end
end