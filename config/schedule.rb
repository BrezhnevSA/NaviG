set :output, "log/cron.log"

every 4.hours do
  rake "employees_from_centra:run"
end

every :monday, at: '8:00 am' do
  rake "send_bookings_report:run"
end

every :tuesday, at: '8:00 am' do
  rake "send_bookings_report:run"
end

every :wednesday, at: '8:00 am' do
  rake "send_bookings_report:run"
end

every :thursday, at: '8:00 am' do
  rake "send_bookings_report:run"
end

every :friday, at: '8:00 am' do
  rake "send_bookings_report:run"
end