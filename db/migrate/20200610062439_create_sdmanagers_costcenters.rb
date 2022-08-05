class CreateSdmanagersCostcenters < ActiveRecord::Migration[6.0]
  def change
    create_table :sdmanagers_costcenters do |t|
      t.bigint :costcenter_num, null: false
      t.references :employee
    end
  end
end