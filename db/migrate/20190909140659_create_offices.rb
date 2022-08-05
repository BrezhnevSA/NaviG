class CreateOffices < ActiveRecord::Migration[6.0]
  def change
    create_table :offices do |t|
      t.string :name
      t.string :short_name, null: true
      t.string :address, null: true
      t.string :image, null: true
      t.float :ord
      t.boolean :active, default: true

      t.references :city

      t.timestamps
    end
  end
end
