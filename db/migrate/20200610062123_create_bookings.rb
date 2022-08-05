class CreateBookings < ActiveRecord::Migration[6.0]
  def change
    create_table :bookings do |t|
      t.datetime :book_from, null: false
      t.datetime :book_to, null: false
      t.string :comment

      t.references :employee
      t.references :object_item
    end
  end
end