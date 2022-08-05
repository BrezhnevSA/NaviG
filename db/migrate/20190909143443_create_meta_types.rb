class CreateMetaTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :meta_types do |t|
      t.string :name
      t.string :metatype

      t.timestamps
    end
  end
end
