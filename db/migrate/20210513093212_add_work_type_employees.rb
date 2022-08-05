class AddWorkTypeEmployees < ActiveRecord::Migration[6.0]
  def change
    add_column :employees, :work_type, :string, limit: 1
  end
end