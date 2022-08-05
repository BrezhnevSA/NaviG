class CreateHeartbeats < ActiveRecord::Migration[6.0]
  def change
    create_table :heartbeats do |t|
      t.string  :hb_type
      t.string  :administrator
      t.string  :employee
      t.string  :coord
      t.string  :login
      t.integer :bc_type

      t.references :city
      t.references :office
      t.references :building
      t.references :floor
      t.references :object_item

      t.timestamps
    end
  end
end
