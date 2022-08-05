class CreateMetaMaps < ActiveRecord::Migration[6.0]
  def change
    create_table :meta_maps do |t|
      t.string :entity_type
      t.string :entity_subtype_id

      t.references :meta_field, index: true

      t.boolean :active, default: true

      t.boolean :show_in_management, default: false

      t.timestamps
    end
  end
end
