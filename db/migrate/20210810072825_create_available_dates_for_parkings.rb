class CreateAvailableDatesForParkings < ActiveRecord::Migration[6.0]
  def change
    create_table :available_dates_for_parkings do |t|
      t.datetime :date_start, null: false
      t.datetime :date_end, null: false

      t.references :object_item
    end
  end
end