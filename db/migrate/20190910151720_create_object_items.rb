class CreateObjectItems < ActiveRecord::Migration[6.0]
  def change
    create_table :object_items do |t|
      t.string :name
      t.string :comment
      t.integer :angle
      t.integer :top
      t.integer :left
      t.integer :width
      t.integer :height
      t.integer :scale, default: 100, null: false
      
      t.string :status
      t.integer :costcenter_num, null: true
      
      t.references :employee, null: true
      t.references :floor
      t.references :object_type

      t.references :location, null: true, foreign_key: true
      
      t.timestamps
    end
  end
end
