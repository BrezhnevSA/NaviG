class CreateFloorsConfigs < ActiveRecord::Migration[6.0]
  def change
    create_table :floors_configs do |t|
      t.string :plan, null: true
      t.string :preview, null: true
      t.string :parameters, null: true

      t.references :floor

      t.timestamps
    end
  end
end
