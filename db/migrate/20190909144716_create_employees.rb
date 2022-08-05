class CreateEmployees < ActiveRecord::Migration[6.0]
  def change
    create_table :employees do |t|
      t.string  :name
      t.string  :surname
      t.string  :patronymic
      t.string  :grade
      t.string  :login, null: false
      t.string  :email, null: false
      t.string  :birthday
      t.integer :costcenter_num
      t.string  :costcenter_name
      t.string  :status
      t.string  :gender, null: false
      t.string  :unit
      t.boolean :active, default: true

      t.references :city
      t.references :office
      t.references :position
      
      t.timestamps
    end
  end
end
