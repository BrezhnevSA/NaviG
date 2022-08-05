
desc 'Send bookings report'

namespace :send_bookings_report do
  task run: :environment do
    today_formated = Date.today.strftime("%d_%m_%Y")
    filename = "bookings_#{today_formated}.xls"
    tempfile = File.open(Rails.root.join("public", filename), "w+")
    rend = WriteExcel.new tempfile.path
    format_for_headers = rend.add_format bg_color: 15,
                                         pattern: 1,
                                         align: :justify,
                                         vertical_align: :center,
                                         border: 1,
                                         bold: 1
    format_for_everything_else = rend.add_format align: :justify,
                                                 border: 1
    format_for_floats = rend.add_format align: :justify,
                                        border: 1
    format_for_floats.set_num_format '0.00'
    main_sheet = rend.add_worksheet 'bookings'
    main_sheet.autofilter 'A1:G1'
    widths = [35, 20, 20, 20, 20, 15, 20]
    headers = ['ФИО',
               'Номер МВЗ',
               'Название МВЗ',
               'Почта',
               'Город',
               'БЦ',
               'Номер места'
              ]
    main_sheet.write_row 0, 0, headers[0..6], format_for_headers
    (0..6).each do |current_row|
      main_sheet.set_column current_row, 0, widths[current_row]
    end

    results = Booking.select('
      employees.name              AS name,
      employees.surname           AS surname,
      employees.patronymic        AS patronymic,
      employees.email             AS email,
      object_items.name           AS oi_name,
      object_items.costcenter_num AS costcenter_num,
      cities.name                 AS city_name,
      buildings.name              AS buildings_name')
      .joins("LEFT OUTER JOIN object_items ON object_items.id = bookings.object_item_id")
      .joins("LEFT OUTER JOIN employees    ON employees.id = bookings.employee_id")
      .joins("LEFT OUTER JOIN floors    ON object_items.floor_id    = floors.id")
      .joins("LEFT OUTER JOIN buildings ON floors.building_id       = buildings.id")
      .joins("LEFT OUTER JOIN offices   ON buildings.office_id      = offices.id")
      .joins("LEFT OUTER JOIN cities    ON offices.city_id          = cities.id")
      .where("(bookings.book_from <= CURRENT_DATE AND bookings.book_to >= CURRENT_DATE)")
    rows = []

    costcenters = Api::V1::ReportsController.new.get_costcenters

    results.each do |item|
      entry = []
      entry << "#{item['surname']} #{item['name']} #{item['patronymic']}"
      entry << item['costcenter_num']
      entry << costcenters.select {|cc| cc["attributes"]["number"] == item['costcenter_num'] }.first['attributes']['name']
      entry << item['email']
      entry << item['city_name']
      entry << item['buildings_name']
      entry << item['oi_name']
      rows.push(entry)
    end

    row_to_write_to = 1
    rows.each do |current_row|
      main_sheet.write(row_to_write_to, 0, current_row[0..6], format_for_everything_else)
      row_to_write_to += 1
    end
    rend.close
    tempfile.close
    mailer = ActionMailer::Base.new
    mailer.attachments[filename] = File.open(tempfile.path, 'rb'){|f| f.read}
    mailer.mail(from: 'RU_navi_support@internal.telekom.com', to: 'RU_HRadmRussia@telekom.com', subject: "Отчет по бронированиям на #{today_formated}", body: '').deliver
    mailer2 = ActionMailer::Base.new
    mailer2.attachments[filename] = File.open(tempfile.path, 'rb'){|f| f.read}
    mailer2.mail(from: 'RU_navi_support@internal.telekom.com', to: 'anna.semakova@t-systems.com', subject: "Отчет по бронированиям на #{today_formated}", body: '').deliver
    mailer3 = ActionMailer::Base.new
    mailer3.attachments[filename] = File.open(tempfile.path, 'rb'){|f| f.read}
    mailer3.mail(from: 'RU_navi_support@internal.telekom.com', to: 'irina.kashapova@t-systems.com', subject: "Отчет по бронированиям на #{today_formated}", body: '').deliver
    File.delete(tempfile.path) if File.exist?(tempfile.path)
  end

end