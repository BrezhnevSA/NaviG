class AddTimestampsBookings < ActiveRecord::Migration[6.0]
  def change
    add_timestamps :bookings, null: true

    booknigs = Booking.all
    unless booknigs.blank?
      booknigs.each do |booking|
        booking.update(created_at: booking['book_from'] - 1.days, updated_at: booking['book_from'] - 1.days)
      end
    end
    # ATTENTION for bookings after May 2021, you can calculate the exact creation date

    change_column_null :bookings, :created_at, false
    change_column_null :bookings, :updated_at, false
  end
end