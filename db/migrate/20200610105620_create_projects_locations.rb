class CreateProjectsLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :projects_locations do |t|
      t.bigint :project_id, null: false
      t.references :location, null: false
    end
  end
end
