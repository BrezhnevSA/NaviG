class CreateEmployeesLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :employees_locations do |t|
      t.bigint :employee_id, null: false
      t.references :location, null: false
    end
  end
end
