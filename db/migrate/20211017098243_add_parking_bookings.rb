class AddParkingBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :parking, :boolean
  end
end