class CreateFloorBlock < ActiveRecord::Migration[6.0]
  def change
    create_table :floor_blocks do |t|
      t.references :floor
      t.references :employee
      t.timestamps
    end
  end
end
