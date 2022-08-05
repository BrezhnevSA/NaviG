class CreateEmployeesAdds < ActiveRecord::Migration[6.0]
  def change
    create_table :employees_adds do |t|
      t.string :phone, null: true
      t.string :mobile, null: true
      t.string :info, null: true
      t.string :education, null: true
      t.references :employee
    end
  end
end
