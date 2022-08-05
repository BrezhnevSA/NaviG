class CreateLocationTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :location_types do |t|
      t.string :name
      t.string :bg

      t.boolean :active, default: true

      t.timestamps
    end
  end
end
