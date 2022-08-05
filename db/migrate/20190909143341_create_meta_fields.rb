class CreateMetaFields < ActiveRecord::Migration[6.0]
  def change
    create_table :meta_fields do |t|
      t.string :name

      t.references :meta_type, index: true

      t.timestamps
    end
  end
end
