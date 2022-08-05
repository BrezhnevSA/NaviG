class CreateObjectTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :object_types do |t|
      t.string :name
      t.string :icon, null: true

      t.boolean :active, default: true
      t.boolean :rotatable, default: false
      t.boolean :resizable, default: false

      t.timestamps
    end
  end
end
