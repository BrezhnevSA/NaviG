class CreateCostcentersLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :costcenters_locations do |t|
      t.bigint :costcenter_num, null: false
      t.references :location, null: false
    end
  end
end
