class CreateMetaValues < ActiveRecord::Migration[6.0]
  def change
    create_table :meta_values do |t|
      t.text :value

      t.references :meta_field, index: true
      t.references :metable, polymorphic: true

      t.timestamps
    end
  end
end
