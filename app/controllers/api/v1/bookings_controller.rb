# implements rights: view_all_bookings, set_booking_on_the_same_time, delete_all_bookings

module Api
  module V1
  end
end
class Api::V1::BookingsController < ApplicationController

  before_action :authenticate_request!

  after_action :set_headers

  def index
    results      = []
    as_file      = params[:as_file].to_s.downcase == "true"
    sort_field   = params[:sorting].blank? ? '' : params[:sorting][:field]
    sort_order   = params[:sorting].blank? ? '' : params[:sorting][:order]
    filters      = params[:filters].blank? ? [] : params[:filters]
    page         = params[:page].to_i
    ppp          = params[:per_page].to_i
    query_filter = ""
    query_sort   = ""
    floor_id     = nil
    place_id     = nil
    user_id      = params[:user_id].to_i
    all_bookings = true
    date_from    = ""
    date_to      = ""
    current_bookings = false
    archive_bookings = false
    no_current_date = params[:no_current_date].blank? ? false : params[:no_current_date]

    if !sort_order.blank? && !sort_field.blank?
      query_sort = case sort_field
        when "employee_label"
          "employees.surname #{sort_order}, employees.name #{sort_order}"
        when "object_item.buildings_name"
          "buildings.name #{sort_order}"
        when 'object_item.location_name'
          "locations.name #{sort_order}"
        when 'place_path'
          "object_items.name #{sort_order}"
        when 'object_item.costcenter_num'
          "object_items.costcenter_num #{sort_order}"
        when 'status'
          "bookings.book_from #{sort_order}"
        else
          "#{sort_field} #{sort_order}"
        end
    end

    filters = filters.collect { |filter|
      case filter["field"]
      when "dateFrom"
        date_from = filter["value"].blank? ? "" : filter["value"]
        nil
      when "archive_bookings"
        archive_bookings = filter["value"].to_s.downcase == 'true'
        nil
      when "current_booking"
        current_bookings = filter["value"].to_s.downcase == 'true'
        nil
      when "dateTo"
        date_to = filter["value"].blank? ? "" : filter["value"]
        nil
      else
        filter
      end
    }.select {|filter| !filter.blank? }
    filters.each_with_index do |filter, index|
      column = case filter["field"]
         when "employee_label"
           employee_label = filter["value"]
           " ( LOWER(employees.surname) LIKE '%#{employee_label}%' OR
               LOWER(employees.name) LIKE '%#{employee_label}%' OR
               LOWER(employees.patronymic) LIKE '%#{employee_label}%' OR
               CONCAT(REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE '%#{employee_label}%' OR
               CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE '%#{employee_label}%' OR
               CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', '')) LIKE '%#{employee_label}%' ) "
         when "object_item.buildings_name"
           " buildings.name LIKE '%#{filter["value"]}%' "
         when "object_item.location_name"
           " locations.name LIKE '%#{filter["value"]}%' "
         when "place_path"
           " object_items.name LIKE '%#{filter["value"]}%' "
         when 'employee_id'
           all_bookings = false
           "employees.id = #{filter["value"]} "
         when 'floor_id'
           floor_id = filter["value"].to_i
           "floors.id = #{filter["value"]} "
         when 'place_id'
           place_id = filter["value"].to_i
           "object_items.id = #{filter["value"]} "
         when "costcenter_selected"
           filter["value"] != '' ? " object_items.costcenter_num IN (#{filter["value"].split(',').map { |i| "'" + i.to_s + "'" }.join(",")}) " : " object_items.costcenter_num = '' "
         when "buildings"
           f_values = filter["value"].to_s.split(',')
           if f_values.length > 1
             str = "("
             f_values.each_with_index do |f_value, i|
               query = f_value == '-' ? " buildings.id IS NULL" : "buildings.id = #{f_value} "
               str += (i.to_i < (f_values.length - 1)) ? " #{query} OR " : " #{query} "
             end
             str + ")"
           else
             filter["value"] == '-' ? " buildings.id IS NULL " : "buildings.id = #{filter["value"]} "
           end
         else
           " #{filter["field"]} LIKE '%#{filter["value"]}%' "
         end
      if index < (filters.length - 1) && filters.length > 1 && !column.blank?
        query_filter += column + " AND "
      elsif index == filters.length - 1 && !column.blank?
        query_filter += column
      end
    end

    if current_bookings && !archive_bookings
      if filters.length > 0
        query_filter += " AND " + " ( bookings.book_from >= CURRENT_DATE OR bookings.book_to >= CURRENT_DATE ) "
      else
        query_filter += " ( bookings.book_from >= CURRENT_DATE OR bookings.book_to >= CURRENT_DATE ) "
      end
    elsif !current_bookings && archive_bookings
      if filters.length > 0
        query_filter += " AND " + " ( bookings.book_from < CURRENT_DATE OR bookings.book_to < CURRENT_DATE ) "
      else
        query_filter += " ( bookings.book_from < CURRENT_DATE OR bookings.book_to < CURRENT_DATE ) "
      end
    end

    if !date_from.blank? && !date_to.blank?
      if filters.length > 0
        query_filter += " AND " + " ( bookings.created_at >= '#{date_from}' AND bookings.created_at <= '#{date_to}' ) "
      else
        query_filter += " ( bookings.created_at >= '#{date_from}' AND bookings.created_at <= '#{date_to}' ) "
      end
    elsif !date_from.blank? && date_to.blank?
      if filters.length > 0
        query_filter += " AND " + " ( bookings.created_at >= '#{date_from}' ) "
      else
        query_filter += " ( bookings.created_at >= '#{date_from}' ) "
      end
    elsif date_from.blank? && !date_to.blank?
      if filters.length > 0
        query_filter += " AND " + " ( bookings.created_at <= '#{date_to}' ) "
      else
        query_filter += " ( bookings.created_at <= '#{date_to}' ) "
      end
    end

    select_booking_sql = '
      bookings.id                 AS id,
      bookings.book_from          AS book_from,
      bookings.book_to            AS book_to,
      bookings.object_item_id     AS object_item_id,
      bookings.comment            AS comment,
      bookings.created_at         AS created_at,
      employees.id                AS employee_id,
      employees.name              AS employee_name,
      employees.surname           AS employee_surname,
      object_items.id             AS o_id,
      object_items.name           AS o_name,
      object_items.comment        AS o_comment,
      object_items.floor_id       AS o_floor_id,
      object_items.object_type_id AS o_object_type_id,
      object_items.costcenter_num AS o_costcenter_num,
      cities.id                   AS o_city_id,
      cities.name                 AS o_city_name,
      offices.id                  AS o_offices_id,
      offices.name                AS o_offices_name,
      buildings.id                AS o_buildings_id,
      buildings.name              AS o_buildings_name,
      floors.name                 AS o_floor_name,
      locations.name              AS o_location_name,
      bookings.parking            AS parking
    '

    bookings = Booking.select(select_booking_sql)
      .joins("LEFT OUTER JOIN object_items ON object_items.id = bookings.object_item_id")
      .joins("LEFT OUTER JOIN employees    ON employees.id = bookings.employee_id")
      .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id")
      .joins("LEFT OUTER JOIN floors    ON object_items.floor_id    = floors.id")
      .joins("LEFT OUTER JOIN buildings ON floors.building_id       = buildings.id")
      .joins("LEFT OUTER JOIN offices   ON buildings.office_id      = offices.id")
      .joins("LEFT OUTER JOIN cities    ON offices.city_id          = cities.id")
      .where(query_filter)
      .order(query_sort)
    count = bookings.to_a.count

    if page.to_i > 0 && ppp.to_i > 0
      if sort_field && sort_order
        bookings = Booking.select(select_booking_sql)
          .joins("LEFT OUTER JOIN object_items ON object_items.id = bookings.object_item_id")
          .joins("LEFT OUTER JOIN employees    ON employees.id = bookings.employee_id")
          .joins("LEFT OUTER JOIN locations    ON object_items.location_id = locations.id")
          .joins("LEFT OUTER JOIN locations    ON object_items.location_id = locations.id")
          .joins("LEFT OUTER JOIN floors       ON object_items.floor_id    = floors.id")
          .joins("LEFT OUTER JOIN buildings    ON floors.building_id       = buildings.id")
          .joins("LEFT OUTER JOIN offices      ON buildings.office_id      = offices.id")
          .joins("LEFT OUTER JOIN cities       ON offices.city_id          = cities.id")
          .where(query_filter).order(query_sort).limit(ppp).offset(ppp * (page - 1))
      else
        bookings = Booking.select(select_booking_sql)
          .joins("LEFT OUTER JOIN object_items ON object_items.id = bookings.object_item_id")
          .joins("LEFT OUTER JOIN employees    ON employees.id = bookings.employee_id")
          .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id")
          .joins("LEFT OUTER JOIN floors    ON object_items.floor_id    = floors.id")
          .joins("LEFT OUTER JOIN buildings ON floors.building_id       = buildings.id")
          .joins("LEFT OUTER JOIN offices   ON buildings.office_id      = offices.id")
          .joins("LEFT OUTER JOIN cities    ON offices.city_id          = cities.id")
          .where(query_filter).limit(ppp).offset(ppp * (page - 1))
      end
    end

    bookings.each do |booking|
      results.push({
        id:             booking[:id],
        created_at:     booking[:created_at],
        book_from:      booking[:book_from],
        book_to:        booking[:book_to],
        employee_id:    booking[:employee_id],
        employee_label: "#{booking[:employee_surname]} #{booking[:employee_name]}",
        comment:        booking[:comment],
        object_item:    {
          id:             booking[:o_id],
          name:           booking[:o_name],
          comment:        booking[:o_comment],
          floor_id:       booking[:o_floor_id],
          object_type_id: booking[:o_object_type_id],
          costcenter_num: booking[:o_costcenter_num],
          city_id:        booking[:o_city_id],
          city_name:      booking[:o_city_name],
          offices_id:     booking[:o_offices_id],
          offices_name:   booking[:o_offices_name],
          buildings_id:   booking[:o_buildings_id],
          buildings_name: booking[:o_buildings_name],
          floor_name:     booking[:o_floor_name],
          location_name:  booking[:o_location_name]
        },
        floor_id:       booking['o_floor_id'],
        place_name:     booking['o_name'],
        place_id:       booking['o_id'],
        place_path:     "#{booking['o_name']}",
        parking:        booking['parking']
      })
    end

    if user_id > 0 && !floor_id.blank? && !place_id.blank?
      ps = available_ds_places_at_floor(Employee.find_by_id(user_id), floor_id, no_current_date)
      p = ps.detect {|e| e.place_id.to_i == place_id.to_i }
      can_book = !p.blank? && p[:ready] == 'on'
      if !p.blank? && p[:parking] == 'on' && can_book == 't'
        available_dates_for_parking = AvailableDatesForParking.where("
          available_dates_for_parkings.object_item_id = #{p[:id].to_i} AND
          available_dates_for_parkings.date_start <= CURRENT_DATE      AND
          available_dates_for_parkings.date_end >= CURRENT_DATE ")
        if available_dates_for_parking.empty? && !p[:emp_sd_id].blank?
          can_book = false
        end
      end
    else
      can_book = false
    end

    if as_file
      filename = "bookings_#{!all_bookings ? 'all' : 'my'}.xls"
      tempfile = Tempfile.open(filename)
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
      main_sheet.autofilter 'A1:H1'
      widths = [35, 20, 20, 20, 20, 15, 20, 15, 20]
      headers = ['Фамилия и Имя',
                  'Дата создания',
                  'Дата начала',
                  'Дата конца',
                  'Бизнес-центр',
                  'Номер помещения',
                  'Место',
                  'Статус',
                  'МВЗ']
      main_sheet.write_row 0, 0, headers[0..8], format_for_headers
      (0..8).each do |current_row|
        main_sheet.set_column current_row, 0, widths[current_row]
      end

      rows = []
      results.each do |item|
        entry = []
        entry << item[:employee_label]
        entry << item[:created_at].strftime("%d.%m.%Y")
        entry << item[:book_from].strftime("%d.%m.%Y")
        entry << item[:book_to].strftime("%d.%m.%Y")
        entry << item[:object_item][:buildings_name]
        entry << item[:object_item][:location_name]
        entry << item[:place_name]
        entry << (item[:book_from].to_date >= Date.today || item[:book_to].to_date >= Date.today ? 'Текущее' : 'Архив')
        entry << item[:object_item][:costcenter_num]
        rows.push(entry)
      end

      row_to_write_to = 1
      rows.each do |current_row|
        main_sheet.write(row_to_write_to, 0, current_row[0..8], format_for_everything_else)
        row_to_write_to += 1
      end
      rend.close
    end

    if as_file
      send_file tempfile.path, filename: filename
    else
      render json: {
        bookings: results,
        can_book: can_book,
        count: count
      }
    end
  end

  def get_place_info(booking, employee, booking_id_prev = nil)
    place = ObjectItem.joins(:location, :floor => {:building => {:office => :city}})
    .where('object_items.id = ?', booking[:object_item_id])
    .select('
      object_items.id             AS id,
      object_items.name           AS name,
      object_items.comment        AS comment,
      object_items.floor_id       AS floor_id,
      object_items.object_type_id AS object_type_id,
      object_items.costcenter_num AS costcenter_num,
      cities.id                   AS city_id,
      cities.name                 AS city_name,
      offices.id                  AS offices_id,
      offices.name                AS offices_name,
      buildings.id                AS buildings_id,
      buildings.name              AS buildings_name,
      floors.id                   AS floor_id,
      floors.name                 AS floor_name,
      locations.name              AS location_name
    ').first
    id_in_comment = booking[:comment].to_i
    {
      id:              booking[:id],
      booking_id_prev: booking_id_prev,
      book_from:       booking[:book_from],
      book_to:         booking[:book_to],
      created_at:      booking[:created_at],
      employee_id:     booking[:employee_id],
      employee_email:  Employee.find(id_in_comment > 0 ? id_in_comment : @current_user.id)[:email],
      employee_label:  "#{employee[:surname]} #{employee[:name]}",
      comment:         booking[:comment],
      object_item:     place,
      floor_id:        place['floor_id'],
      place_name:      place['name'],
      place_id:        place['id'],
      place_path:      "#{place['name']}",
      location_name:   place['location_name']
    } 
  end

  def create
    object_item         = params[:object_item]
    book_from           = params[:book_from].to_s
    book_to             = params[:book_to].to_s
    comment             = params[:comment]
    employee_i          = params[:employee]
    switchState         = params[:switchState].to_s.downcase == "true"
    is_reception        = params[:is_reception]
    user                = @current_user
    book_from_day_month = Date.parse(book_from).strftime('%d.%m.%Y')
    book_to_day_month   = Date.parse(book_to).strftime('%d.%m.%Y')
    error_code          = nil
    if !employee_i.blank? && employee_i != "null" && check_right('set_booking_on_the_same_time') && check_right('book_for_others')
      if switchState
        if employee_i.to_i > 0
          employee = Employee.find(employee_i)
        else
          employee = Employee.find_by(email: employee_i)
        end
      else
        employee = Employee.find(@current_user.id)
      end
    elsif !employee_i.blank? && employee_i != "null" && employee_i.to_i != @current_user.id && !check_right('book_for_others')
      error_code = 559
    else
      employee = Employee.find(@current_user.id)
    end

    if error_code.blank?
      employee_main = (employee_i.to_i > 0 && @current_user.id != employee_i.to_i) || (employee_i.to_i == 0 && employee[:email] != @current_user.email) ? employee : @current_user
      if book_from && book_to && ((Date.parse(book_to) - Date.parse(book_from)).to_i <= 15 && (Date.parse(book_to) - Date.parse(book_from)).to_i >= 0 || check_right('book_with_no_date_limits'))
        oi = ObjectItem.select("meta_values.value AS parking")
                       .joins(" LEFT JOIN meta_values on (meta_values.metable_id = object_items.id AND
                                meta_values.metable_type = 'ObjectItem' AND
                                meta_values.meta_field_id = #{Rails.configuration.parking_place_id})")
                       .where("object_items.id = #{object_item[:id]}").first
        if check_right('set_booking_on_the_same_time') ||
           not_exists_bookings_on_same_time_for_curuser(book_from, book_to, nil,  employee_main.id, !oi[:parking].blank? && oi[:parking] == 'on').empty?
          places = available_places(
              book_from,
              book_to,
              @current_user.id,
              employee.id,
              employee.costcenter_num,
              nil
          )
          unless places.blank?
            place = places.detect{|w| w[:name].downcase == object_item[:name].downcase}
          end
          if !place.blank?
            if comment.blank? && employee[:id] && !switchState && !employee_i.blank?
              comment_ = employee_i
            else
              comment_ = comment.blank? && employee[:id] ? employee[:id] : comment
            end
            create_booking = true
            booking = nil
            if oi[:parking] == 'on'
              available_dates_for_parking = AvailableDatesForParking.where("
                available_dates_for_parkings.object_item_id = #{object_item[:id].to_i} AND
                available_dates_for_parkings.date_start <= '#{Date.parse(book_from)}'  AND
                available_dates_for_parkings.date_start <= '#{Date.parse(book_to)}'    AND
                available_dates_for_parkings.date_end >= '#{Date.parse(book_from)}'    AND
                available_dates_for_parkings.date_end >= '#{Date.parse(book_to)}' ")
              occupied = !Booking.where(" bookings.object_item_id = #{object_item[:id].to_i} AND
                                          bookings.book_from <= CURRENT_DATE                 AND
                                          bookings.book_to >= CURRENT_DATE").empty?
              if (available_dates_for_parking.empty? || occupied) && !place[:emp_sd_id].blank?
                create_booking = false
              end
            end
            if create_booking
              booking = Booking.new(
                book_from:      book_from,
                book_to:        book_to,
                object_item_id: place.place_id,
                employee_id:    employee[:id],
                comment:        comment_,
                parking:        place['parking'] == 'on'
              )
            end
            if !booking.blank? && booking.save
              if is_reception.blank?
                costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
                cc_owner_id = nil
                costcenters_json.each do |item|
                  if item["attributes"]["number"] == employee.costcenter_num
                    cc_owner_id = item["relationships"]["owner"]["data"]["id"]
                    break
                  end
                end
              end

              if check_right('set_booking_on_the_same_time')
                Api::V1::HeartbeatsController.new.create('booking_creating', employee.id, place.place_id, @current_user.id)
              else
                Api::V1::HeartbeatsController.new.create('booking_creating', employee.id, place.place_id, 0)
              end

              employees_data = Employee.select("employees.id AS employee_id, employees.email AS email")
                .where('employees.id = (?)', cc_owner_id).first

              if employees_data
                # head_email = employees_data["email"]
                user_email = employee[:email]

                place_addr = place.name
                # ActionMailer::Base.mail(
                #     from: "RU_navi_support@internal.telekom.com",
                #     to: user_email,
                #     subject: 'Ваше бронирование сохранено',
                #     body: "Ваше бронирование на место #{place_addr} (Desk sharing) на период #{book_from_day_month} - #{book_to_day_month} добавлено"
                # ).deliver
              end
            else
              error_code = 550
            end
          else
            error_code = 551
          end
        else
          error_code = 552
        end
      else
        error_code = 553
      end
      if error_code.blank?
        render json: get_place_info(booking, employee)
      else
        render_error(error_code)
      end
    else
      render_error(error_code)
    end
  end

  def update
    object_item_prev    = params[:booking_data][:object_item_prev].has_key?(:id) ? params[:booking_data][:object_item_prev] : ObjectItem.find_by_name(params[:booking_data][:object_item_prev][:name])
    object_item         = params[:booking_data][:object_item_new].has_key?(:id)  ? params[:booking_data][:object_item_new] : ObjectItem.find_by_name(params[:booking_data][:object_item_new][:name])
    book_from           = params[:booking_data][:book_from].to_s
    book_to             = params[:booking_data][:book_to].to_s
    book_id             = params[:booking_data][:id]
    comment             = params[:booking_data][:comment]
    employee_i          = params[:booking_data][:employee]
    is_reception        = params[:booking_data][:is_reception]
    user                = @current_user
    book_from_day_month = Date.parse(book_from).strftime('%d.%m')
    book_to_day_month   = Date.parse(book_to).strftime('%d.%m')
    booking             = Booking.find(book_id)
    book_from_past      = booking.book_from.strftime('%d.%m.%Y')
    book_to_past        = booking.book_to.strftime('%d.%m.%Y')
    place_name_prev     = params[:booking_data][:object_item_prev][:name].upcase
    place_name          = params[:booking_data][:object_item_new][:name].upcase
    result              = 0
    error_code          = nil
    if !employee_i.blank? && employee_i != "null" && check_right('set_booking_on_the_same_time') && check_right('book_for_others')
      if employee_i.to_i > 0
        employee = Employee.find(employee_i)
      else
        employee = Employee.find_by(email: employee_i)
      end
    elsif !employee_i.blank? && employee_i != "null" && employee_i.to_i != @current_user.id && !check_right('book_for_others')
      error_code = 558
    else
      employee = Employee.find(@current_user.id)
    end
    if error_code.blank?
      employee_main = (employee_i.to_i > 0 && @current_user.id != employee_i.to_i) || (employee_i.to_i == 0 && employee[:email] != @current_user.email) ? @current_user : employee
      if book_from && book_to && ((Date.parse(book_to) - Date.parse(book_from)).to_i <= 15 && (Date.parse(book_to) - Date.parse(book_from)).to_i >= 0 || check_right('book_with_no_date_limits'))
        oi = ObjectItem.select("meta_values.value AS parking")
                       .joins(" LEFT JOIN meta_values on (meta_values.metable_id = object_items.id AND
                                meta_values.metable_type = 'ObjectItem' AND
                                meta_values.meta_field_id = #{Rails.configuration.parking_place_id})").first
        if check_right('set_booking_on_the_same_time') ||
           not_exists_bookings_on_same_time_for_curuser(
               book_from,
               book_to,
               book_id.blank? ? nil : book_id,
               employee_main.id,
               !oi[:parking].blank? && oi[:parking] == 'on'
            ).empty?
          places = available_places(
              book_from,
              book_to,
              @current_user.id,
              employee.id,
              employee.costcenter_num,
              book_id.blank? ? nil : booking
          )
          unless places.blank?
            place = places.detect{|w| w[:name].downcase == place_name.downcase}
          end

          unless place.blank?
            update_booking = true
            if oi[:parking] == 'on'
              available_dates_for_parking = AvailableDatesForParking.where("
                available_dates_for_parkings.object_item_id = #{object_item[:id].to_i} AND
                available_dates_for_parkings.date_start <= '#{Date.parse(book_from)}'  AND
                available_dates_for_parkings.date_start <= '#{Date.parse(book_to)}'    AND
                available_dates_for_parkings.date_end >= '#{Date.parse(book_from)}'    AND
                available_dates_for_parkings.date_end >= '#{Date.parse(book_to)}' ")
              occupied = !Booking.where(" bookings.object_item_id = #{object_item[:id].to_i} AND
                                          bookings.book_from <= CURRENT_DATE                 AND
                                          bookings.book_to >= CURRENT_DATE").empty?
              if (available_dates_for_parking.empty? || occupied) && !place[:emp_sd_id].blank?
                update_booking = false
              end
            end
            if update_booking
              if (place_name_prev == place_name) && (Date.parse(book_from) >= Date.today) &&
                 (Date.parse(book_to) >= Date.today) && booking.book_from >= Date.today
                booking.book_from = book_from
                booking.book_to = book_to
                booking.comment = comment
                booking.parking = place['parking'] == 'on'
                booking.save
                result = 1
              elsif (Date.parse(book_from) > Date.today) && (Date.parse(book_to) > Date.today) &&
                    booking.book_from <= Date.today
                booking.book_to = Date.yesterday
                booking.save
                booking_new = Booking.new(
                    book_from:      book_from,
                    book_to:        book_to,
                    object_item_id: object_item[:id],
                    employee_id:    employee[:id],
                    comment:        booking.comment,
                    parking:        place['parking'] == 'on'
                )
                booking_new.save
                result = 2
              elsif (place_name_prev != place_name) && (Date.parse(book_from) >= Date.today) &&
                    (Date.parse(book_to) >= Date.today) && booking.book_from >= Date.today
                booking_id_prev = booking[:id]
                booking.destroy
                booking_new = Booking.new(
                    book_from:      book_from,
                    book_to:        book_to,
                    object_item_id: object_item[:id],
                    employee_id:    employee[:id],
                    comment:        booking.comment,
                    parking:        place['parking'] == 'on'
                )
                booking_new.save
                result = 3
              end
            end
            
            if result >= 1 && result <= 3
              costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
              cc_owner_id      = nil
              costcenters_json.each do |item|
                if item["attributes"]["number"] == employee.costcenter_num
                  cc_owner_id = item["relationships"]["owner"]["data"]["id"]
                  break
                end
              end

              if check_right('set_booking_on_the_same_time')
                Api::V1::HeartbeatsController.new.create('booking_editing', employee.id, object_item[:id], @current_user.id)
              else
                Api::V1::HeartbeatsController.new.create('booking_editing', employee.id, object_item[:id], 0)
              end

              employees_data = Employee.select("employees.id AS employee_id, employees.email AS email")
                .where('employees.id = (?)', cc_owner_id)

              # head_email = employees_data[0]["email"]
              user_email = employee[:email]
              #
              # if head_email != user_email
              #   ActionMailer::Base.mail(
              #       from: "RU_navi_support@internal.telekom.com",
              #       to: head_email,
              #       subject: 'Новое бронирование',
              #       body: "Место #{place_name} (Desk sharing) на период #{book_from_day_month} - #{book_to_day_month} забронировано сотрудником #{user.name} #{user.surname}"
              #   ).deliver
              # end
              # ActionMailer::Base.mail(
              #     from: "RU_navi_support@internal.telekom.com",
              #     to: user_email,
              #     subject: 'Ваше бронирование изменено',
              #     body: "Ваше бронирование на место #{place_name_prev} (Desk sharing) на период #{book_from_past} - #{book_to_past} изменено на место #{place_name} (Desk sharing) на период #{Date.parse(book_from).strftime('%d.%m.%Y')} - #{Date.parse(book_to).strftime('%d.%m.%Y')}"
              # ).deliver

            else
              error_code = 550
            end
          else
            error_code = 551
          end
        else
          error_code = 552
        end
      else
        error_code = 553
      end
      if error_code.blank?
        place = get_place_info(booking, employee)
        render json: booking_new.blank? ? get_place_info(booking, employee) : get_place_info(booking_new, employee, booking_id_prev)
      else
        render_error(error_code)
      end
    else
      render_error(error_code)
    end
  end

  def show
    # if check_right('view_one_building')
      bookings = Booking.find(params[:id])
      render json: bookings
    # else
    #   render json: {
    #       message: "Access denied!"
    #   }, status: :unauthorized
    # end
  end

  def destroy
    booking = Booking.find_by_id(params[:id])
    if !booking.blank? && ((@current_user.id != booking['employee_id'] && check_right('delete_all_bookings')) ||
       (@current_user.id == booking['employee_id']))
      object_item_id = booking['object_item_id']
      book_from = booking['book_from']
      book_to = booking['book_to']
      booking.destroy
      if @current_user.id != booking['employee_id'] && check_right('delete_all_bookings')
        Api::V1::HeartbeatsController.new.create('booking_removing', booking['employee_id'], object_item_id, @current_user.id)
      else
        Api::V1::HeartbeatsController.new.create('booking_removing', booking['employee_id'], object_item_id, 0)
      end

      costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
      cc_owner_id = nil
      costcenters_json.each do |item|
        if item["attributes"]["number"] == @current_user.costcenter_num
          cc_owner_id = item["relationships"]["owner"]["data"]["id"]
          break
        end
      end

      # head_email = employees_data[0]["email"]
      #user_email = Employee.find_by_id(booking['employee_id'].to_i)[:email]

      # ActionMailer::Base.mail(from: "RU_navi_support@internal.telekom.com",
      #                        to: user_email,
      #                        subject: 'Ваше бронирование удалено',
      #                        body: "Ваше бронирование места #{ObjectItem.find(object_item_id).name} (Desk sharing) на период #{book_from.strftime('%d.%m.%Y')} - #{book_to.strftime('%d.%m.%Y')} удалено").deliver
      render json: {
          message: "Booking removed",
          id:      params[:id]
      }, status: :ok
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def validate_place_and_date(place, book_from, book_to, user_id, emp_id)
    result = false

    if !emp_id.blank?
      emlpoyee = Employee.find(emp_id) rescue nil
    elsif emlpoyee.blank?
      emlpoyee = Employee.find(user_id) rescue nil
    end

    unless emlpoyee.blank? && place.blank?
      project_list = get_projects_by_employee_login(emlpoyee.login)
      employee_location    = EmployeesLocation.where(location_id: place.location_id).first
      costcenters_location = CostcentersLocation.where(location_id: place.location_id).first
      project_location     = ProjectsLocation.where(location_id: place.location_id).first
      if (emlpoyee.costcenter_num.to_i == place.costcenter_num.to_i || place.costcenter_num.to_i == 2580000 || (place.costcenter_num.to_s[0..3] == '3581' && emlpoyee.costcenter_num.to_s[0..3] == '2583') || (place.costcenter_num.to_s[0..3] == '3581' && emlpoyee.costcenter_num.to_s[0..3] == '2583')) ||
         (!employee_location.blank? && employee_location.employee_id.to_i == emlpoyee.id.to_i) ||
         (!costcenters_location.blank? && costcenters_location.costcenter_num.to_i == emlpoyee.costcenter_num.to_i) ||
         (!project_location.blank? &&  project_list.include?(project_location.project_id.to_i))
        result = true
      end
    end

    unless book_from.blank? && book_to.blank?
      # TODO check available_places
    end

    result
  end

  def get_projects_by_employee_login(emp_id)
    uri = URI "http://contour.t-systems.ru/extra/projects-of?login=" + emp_id.to_s
    req = Net::HTTP::Get.new uri
    begin
      res = Net::HTTP.start(uri.host) do |http|
        http.request(req)
      end
    rescue
      res = nil
    end
    begin
      projects_list = []
      response = JSON.parse(res.body)
      response.each do |item|
        projects_list.push(item['id'].to_i)
      end
      projects_list
    rescue
      projects_list
    end
  end

  def available_places(book_from, book_to, user_id, emp_id, costcenter, booking, searching = true)
    unless emp_id.blank?
      emp = Employee.find(emp_id)
    else
      emp = Employee.joins(
        'INNER JOIN sdmanagers_costcenters ON sdmanagers_costcenters.employee_id = employees.id'
      ).select("
        employees.costcenter_num              AS costcenter_num,
        employees.id                          AS id,
        employees.login                       AS login,
        sdmanagers_costcenters.costcenter_num AS sd_costcenter_num
      ").where(
        'employees.id = (?)',
        user_id
      ).first
      if !emp.blank? && emp.sd_costcenter_num.to_i == -1
        all_places = true
      else
        all_places = false
      end
    end
    if emp.blank?
      emp = Employee.find(user_id)
    end

    office_ = check_right('book_every_where') ? nil : ObjectItem.joins(:floor => {:building => {:office => :city}})
      .select("offices.id as office_id")
      .where("object_items.employee_id = #{emp.id}")
    office_id = office_.blank? ? nil : office_.first['office_id']

    if !booking.blank?
      bookings = Booking.joins(:employee, :object_item => {:floor => {:building => {:office => :city}}}).select("
        bookings.book_from AS book_from,
        bookings.book_to   AS book_to,
        object_items.id    AS place_id
      ").where(
        "'#{book_from}' <= book_to::timestamp::date AND
         '#{book_to}' >= book_from::timestamp::date AND
         bookings.id != #{booking.id} AND
         #{booking['parking'].blank? || booking['parking'] == 'null' || !!booking['parking'] || !searching ? ' (bookings.parking = false OR bookings.parking IS NULL) ' : ' bookings.parking = true '}",
      ).order('book_from DESC')
    else
      bookings = Booking.joins(:employee, :object_item => {:floor => {:building => {:office => :city}}}).select("
        bookings.book_from AS book_from,
        bookings.book_to   AS book_to,
        object_items.id    AS place_id
      ").where(
        "? <= book_to::timestamp::date AND ? >= book_from::timestamp::date",
        book_from,
        book_to
      ).order('book_from DESC')
    end
    occupied = []
    bookings.each do |item|
      if !occupied.include?(item['place_id'])
        occupied.push(item['place_id'])
      end
    end
    if occupied.empty?
      places = ObjectItem.joins(
          " LEFT JOIN meta_values mv on ((mv.metable_id = object_items.id) AND
            (mv.metable_type = 'ObjectItem') AND
            (mv.meta_field_id = #{Rails.configuration.ds_ready_id}))
            #{searching ? "LEFT JOIN meta_values mv2 ON ((mv2.metable_id = object_items.id) AND
            (mv2.metable_type = 'ObjectItem') AND
            (mv2.meta_field_id = #{Rails.configuration.parking_place_id}))" : ""}",
          :floor => {:building => {:office => :city}})
       .where(
         "status = 'SHARING' AND
          #{!check_right('book_all_places') ? " (costcenter_num = #{emp.costcenter_num.to_i} OR costcenter_num = 2580000 OR
           (LEFT(costcenter_num::varchar(255), 4) = '2583' AND '2583' = #{emp.costcenter_num.to_s[0..3]}) OR
           (LEFT(costcenter_num::varchar(255), 4) = '3581' AND '3581' = #{emp.costcenter_num.to_s[0..3]})
          ) #{office_id.blank? ? '' : 'AND offices.id != ' + office_id.to_s} AND " : " "}
          (mv.value = 'on')")
       .select(SELECT_OBJECT_ITEMS_STATIC + ", #{searching ? "mv2.value" : "false"} AS parking")
    elsif !costcenter.blank?
      places = ObjectItem.joins(
          " LEFT JOIN meta_values mv on ((mv.metable_id = object_items.id) AND
                                     (mv.metable_type = 'ObjectItem') AND
                                     (mv.meta_field_id = #{Rails.configuration.ds_ready_id}))
            #{searching ? "LEFT JOIN meta_values mv2 ON ((mv2.metable_id = object_items.id) AND
            (mv2.metable_type = 'ObjectItem') AND
            (mv2.meta_field_id = #{Rails.configuration.parking_place_id}))" : ""}",
          :floor => {:building => {:office => :city}})
        .where("
          status = 'SHARING' AND
          object_items.id NOT IN (#{occupied.join(',')}) AND
          #{!check_right('book_all_places') ? " (costcenter_num = #{costcenter.to_i} OR costcenter_num = 2580000 OR
           (LEFT(costcenter_num::varchar(255), 4) = '2583' AND '2583' = #{emp.costcenter_num.to_s[0..3]}) OR
           (LEFT(costcenter_num::varchar(255), 4) = '3581' AND '3581' = #{emp.costcenter_num.to_s[0..3]})
          ) #{office_id.blank? ? '' : 'AND offices.id != ' + office_id.to_s} AND " : " "}
          (mv.value = 'on')")
        .select(SELECT_OBJECT_ITEMS_STATIC + ", #{searching ? "mv2.value" : "false"} AS parking")
    else
      places = ObjectItem.joins(
          " LEFT JOIN meta_values mv on ((mv.metable_id = object_items.id) AND
                                      (mv.metable_type = 'ObjectItem') AND
                                      (mv.meta_field_id = #{Rails.configuration.ds_ready_id}))
            #{searching ? "LEFT JOIN meta_values mv2 ON ((mv2.metable_id = object_items.id) AND
            (mv2.metable_type = 'ObjectItem') AND
            (mv2.meta_field_id = #{Rails.configuration.parking_place_id}))" : ""}",
          :floor => {:building => {:office => :city}})
        .where(
          "status = 'SHARING' AND
           object_items.id NOT IN (#{occupied.join(',')}) AND
           #{!check_right('book_all_places') ? " (costcenter_num = #{emp.costcenter_num.to_i} OR costcenter_num = 2580000 OR
            (LEFT(costcenter_num::varchar(255), 4) = '2583' AND '2583' = #{emp.costcenter_num.to_s[0..3]}) OR
            (LEFT(costcenter_num::varchar(255), 4) = '3581' AND '3581' = #{emp.costcenter_num.to_s[0..3]})
           ) #{office_id.blank? ? '' : 'AND offices.id != ' + office_id.to_s} AND " : " "}
           (mv.value = 'on') ")
        .select(SELECT_OBJECT_ITEMS_STATIC + ", #{searching ? "mv2.value" : "false"} AS parking")
    end
    sharing_places = available_sharing_places(emp, nil, nil, occupied.join(','), searching)
    unless booking.blank?
      cur_place = [
        ObjectItem.joins(
          " LEFT JOIN meta_values mv on ((mv.metable_id = object_items.id) AND
            (mv.metable_type = 'ObjectItem') AND
            (mv.meta_field_id = #{Rails.configuration.ds_ready_id}))
            #{searching ? "LEFT JOIN meta_values mv2 ON ((mv2.metable_id = object_items.id) AND
            (mv2.metable_type = 'ObjectItem') AND
            (mv2.meta_field_id = #{Rails.configuration.parking_place_id}))" : ""}",
          :floor => {:building => {:office => :city}})
        .select(SELECT_OBJECT_ITEMS_STATIC + ", #{searching ? "mv2.value" : "false"} AS parking")
        .where("
          object_items.id = #{booking.object_item_id}
          #{office_id.blank? ? '' : 'AND offices.id != ' + office_id.to_s}")
        .first
      ]
    end

    places.each do |place|
      not_free = Booking.joins(:employee, :object_item => {:floor => {:building => {:office => :city}}}).select("
          bookings.book_from AS book_from,
          bookings.book_to   AS book_to,
          object_items.id    AS place_id
        ").where(
        "  (? >= book_from::timestamp::date AND ? <= book_to::timestamp::date AND bookings.object_item_id = ?)
        OR (? >= book_from::timestamp::date AND ? <= book_to::timestamp::date AND bookings.object_item_id = ?)
        OR (? <= book_from::timestamp::date AND ? >= book_to::timestamp::date AND bookings.object_item_id = ?)",
        book_from,
        book_from,
        place[:place_id],
        book_to,
        book_to,
        place[:place_id],
        book_from,
        book_to,
        place[:place_id]
      ).order('book_from DESC')
      not_free.each do |nf|
        places = places.select{|e| e[:place_id] != nf[:place_id]}
      end
    end

    places = (places + (booking.blank? ? [] : cur_place) + sharing_places).index_by { |r| r[:name]}.values
  end

  def available_sharing_places(employee, floor_id = nil, name = nil, occupied = nil, searching = true, no_current_date = false)
    where_statement = "employees_locations.employee_id = #{employee.id} AND status = 'SHARING' AND (mv.value = 'on') #{!searching ? " AND mv2.value != 'on'" : "" } "
    where_statement_for_today = ""
    places_available_today = []
    if check_right('add_available_dates_for_parking', employee) #for parking: when places available today
      places_available_today = ObjectItem.joins(META_ATTRIBUTES_JOIN,
          :floor => {:building => {:office => :city}})
        .where(" #{!floor_id.blank? ? " floors.id = #{floor_id} AND " : "" }
          mv2.value = 'on' 
          #{no_current_date ? '' : ' AND object_items.id NOT IN (
                                                              SELECT bookings.object_item_id
                                                                FROM bookings
                                                               WHERE bookings.book_from <= CURRENT_DATE
                                                                 AND bookings.book_to >= CURRENT_DATE
                                                                 AND bookings.object_item_id = object_items.id
                                                                 AND bookings.parking IS NOT NULL
                                                           )'}
")
        .select(SELECT_OBJECT_ITEMS_STATIC_SHARING)
    end

    # getting places if it shared for employee
    if !floor_id.blank?
      where_statement += " AND floors.id = #{floor_id} "
      where_statement_for_today = " floors.id = #{floor_id} "
    elsif !name.blank?
      where_statement += " AND LOWER(object_items.name) LIKE LOWER('%#{name}%') "
    end
    where_statement += occupied.blank? ? "" : "AND object_items.id NOT IN (#{occupied})"
    places_emp = ObjectItem.joins(
      ' INNER JOIN employees_locations ON employees_locations.location_id = object_items.location_id ',
      META_ATTRIBUTES_JOIN,
      :floor => {:building => {:office => :city}})
      .where(where_statement).select(SELECT_OBJECT_ITEMS_STATIC_SHARING)

    # getting places if it shared for costcenter
    where_statement = "costcenters_locations.costcenter_num = #{employee.costcenter_num.to_i} AND status = 'SHARING' AND (mv.value = 'on') #{!searching ? " AND mv2.value != 'on'" : "" } "
    if floor_id
      where_statement += " AND floors.id = #{floor_id} "
    elsif name
      where_statement += " AND LOWER(object_items.name) LIKE LOWER('%#{name}%') "
    end
    places_costcenter = ObjectItem.joins(
      ' INNER JOIN costcenters_locations ON costcenters_locations.location_id = object_items.location_id ',
      META_ATTRIBUTES_JOIN,
      :floor => {:building => {:office => :city}})
     .where(where_statement).select(SELECT_OBJECT_ITEMS_STATIC_SHARING)

    # getting places if it shared for project
    # TODO: uncomment getting project list
    project_list = [] # get_projects_by_employee_login(employee.login)
    where_statement = "projects_locations.project_id IN (#{project_list.join(',')}) AND status = 'SHARING' AND (mv.value = 'on') #{!searching ? " AND mv2.value != 'on'" : "" } "
    if floor_id
      where_statement += " AND floors.id = #{floor_id} "
    elsif name
      where_statement += " AND LOWER(object_items.name) LIKE LOWER('%#{name}%') "
    end
    places_projects = []
    unless project_list.blank?
      places_projects += ObjectItem.joins(
        ' INNER JOIN projects_locations ON projects_locations.location_id = object_items.location_id ',
        META_ATTRIBUTES_JOIN,
        :floor => {:building => {:office => :city}})
        .where(where_statement).select(SELECT_OBJECT_ITEMS_STATIC_SHARING)
    end

    (places_available_today + places_emp + places_costcenter + places_projects)
  end

  def search_available_places
    book_from   = params[:booking_data][:book_from]
    book_to     = params[:booking_data][:book_to]
    place_addr  = params[:booking_data][:place_addr]
    employee    = params[:booking_data][:employee].blank? ? nil : params[:booking_data][:employee]
    book_id     = params[:booking_data][:book_id]
    office_id   = params[:booking_data][:office_id]
    building_id = params[:booking_data][:building_id]
    location_id = params[:booking_data][:location_id]
    error_code  = nil
    if params[:booking_data][:switchState] === ""
      switchState = true
    else
      switchState = case params[:booking_data][:switchState].to_s.downcase
        when "true"
          true
        when "false"
          false
        else
          true
        end
    end
    if !employee.blank? && employee != "null" && check_right('set_booking_on_the_same_time') && check_right('book_for_others')
      if switchState
        if employee.to_i > 0
          employee = Employee.find(employee)
        else
          employee = Employee.find_by(email: employee)
        end
      else
        employee = Employee.find(@current_user.id)
      end
    elsif !employee.blank? && employee != "null" && employee.to_i != @current_user.id && !check_right('book_for_others')
      error_code = 560
    else
      employee = Employee.find(@current_user.id)
    end
    results = {}
    if error_code.blank?
      if book_from && book_to && (Date.parse(book_to) - Date.parse(book_from)).to_i <= 15
        nebost = not_exists_bookings_on_same_time_for_curuser(book_from, book_to, book_id.blank? ? nil : book_id, employee.id)
        if check_right('set_booking_on_the_same_time') || nebost.empty?
          places = available_places(
              book_from,
              book_to,
              @current_user.id,
              @current_user.id != employee.id ? employee.id : @current_user.id,
              employee.costcenter_num,
              nil,
              true
          )
          unless place_addr.blank?
            place = places.find{|w| w.name == place_addr}
            places = place.blank? ? nil : [ place ]
          end
          unless places.blank?
            places.each do |item|
              if (!office_id.blank? && !building_id.blank? && !location_id.blank? && office_id == item['office_id'] && building_id == item['building_id'] && location_id == item['location_id']) ||
                 (!office_id.blank? && !building_id.blank? && location_id.blank?  && office_id == item['office_id'] && building_id == item['building_id']) ||
                 (!office_id.blank? && building_id.blank?  && !location_id.blank? && office_id == item['office_id'] && location_id == item['location_id']) ||
                 (office_id.blank?  && !building_id.blank? && !location_id.blank? && location_id == item['location_id'] && building_id == item['building_id'])  ||
                 (!office_id.blank? && building_id.blank?  && location_id.blank?  && office_id == item['office_id']) ||
                 (office_id.blank?  && !building_id.blank? && location_id.blank?  && building_id == item['building_id']) ||
                 (office_id.blank?  && building_id.blank?  && !location_id.blank? && location_id == item['location_id']) ||
                 (office_id.blank?  && building_id.blank?  && location_id.blank?)
                place_data = {
                  id:      item['city_id'],
                  name:    item['city_name'],
                  offices: [
                    {
                      id:        item['office_id'],
                      name:      item['office_name'],
                      buildings: [
                        id:     item['building_id'],
                        name:   item['building_name'],
                        floors: [
                          id:     item['floor_id'],
                          name:   item['floor_name'],
                          places: [
                            id:        item['place_id'],
                            name:      item['name'],
                            book_from: book_from,
                            book_to:   book_to,
                            ready:     item['ready'] === 'on',
                            angle:     item['ready'],
                            top:       item['top'],
                            left:      item['left'],
                            width:     item['width'],
                            height:    item['height'],
                            scale:     item['scale']
                          ]
                        ]
                      ]
                    }
                  ]
                }
              end
              if !results.blank? && !place_data.blank?
                founded_city = results.detect{ |city| city[:id].to_i == item['city_id'].to_i}
                unless founded_city.blank?
                  results = results.map { |city|
                    if city[:id].to_i == item['city_id']
                      founded_office = city[:offices].detect{ |office| office[:id].to_i == item['office_id'].to_i}
                      unless founded_office.blank?
                        city[:offices] = city[:offices].map { |office|
                          if office[:id].to_i == item['office_id']
                            founded_building = office[:buildings].detect{ |building| building[:id].to_i == item['building_id'].to_i}
                            unless founded_building.blank?
                              office[:buildings] = office[:buildings].map { |building|
                                if building[:id].to_i == item['building_id']
                                  founded_floor = building[:floors].detect{ |floor| floor[:id].to_i == item['floor_id'].to_i}
                                  unless founded_floor.blank?
                                    building[:floors] = building[:floors].map { |floor|
                                      if floor[:id].to_i == item['floor_id']
                                        floor[:places].push({
                                          id:        item['place_id'],
                                          name:      item['name'],
                                          book_from: book_from,
                                          book_to:   book_to,
                                          ready:     item['ready'] === 'on',
                                          angle:     item['ready'],
                                          top:       item['top'],
                                          left:      item['left'],
                                          width:     item['width'],
                                          height:    item['height'],
                                          scale:     item['scale']
                                        })
                                      end
                                      floor
                                    }
                                  else
                                    building[:floors].push(place_data[:offices][0][:buildings][0][:floors][0])
                                  end
                                end
                                building
                              }
                            else
                              office[:buildings].push(place_data[:offices][0][:buildings][0])
                            end
                          end
                          office
                        }
                      else
                        city[:offices].push(place_data[:offices][0])
                      end
                    end
                    city
                  }
                else
                  results.push(place_data)
                end
              else
                results = place_data.blank? ? results : [ place_data ]
              end
            end
          else
            error_code = 550
          end
        else
          error_code = 552
          meta = nebost
        end
      else
        error_code = 553
      end
      if error_code.blank?
        render json: results
      else
        render_error(error_code, meta)
      end
    else
      render_error(error_code, meta)
    end
  end

  def not_exists_bookings_on_same_time_for_curuser(book_from, book_to, book_id, emp_id, parking=false)
    if !book_id.blank?
      booking = Booking.find(book_id)
      sql_statement =
          "((bookings.book_from::timestamp::date <= ? AND bookings.book_to::timestamp::date >= ?) OR
           (bookings.book_from::timestamp::date <= ? AND bookings.book_to::timestamp::date >= ?)) AND
           bookings.employee_id = ? AND
           bookings.id !=#{book_id} AND
           #{booking['parking'].blank? || booking['parking'] == 'null' || !booking['parking'] ? ' (bookings.parking = false OR bookings.parking IS NULL) ' : ' bookings.parking = true '}"
    else
      sql_statement =
          "((bookings.book_from::timestamp::date <= ? AND bookings.book_to::timestamp::date >= ?) OR
           (bookings.book_from::timestamp::date <= ? AND bookings.book_to::timestamp::date >= ?)) AND
           bookings.employee_id = ?  AND
           #{parking.blank? || parking == 'null' || parking == 'off' ? ' (bookings.parking = false OR bookings.parking IS NULL) ' : ' bookings.parking = true '}"
    end
    Booking.joins(:employee, :object_item => {:floor => {:building => {:office => :city}}}).select("
      bookings.book_from   AS book_from,
      bookings.book_to     AS book_to,
      bookings.employee_id AS id,
      bookings.id          AS book_id,
      object_items.id      AS place_id
    ").where(sql_statement, book_to, book_to, book_from, book_from, emp_id)
      .order('book_from DESC')
  end

  def available_ds_places_at_floor(employee, floor_id, no_current_date = false)
    office_ = ObjectItem.joins(:floor => {:building => {:office => :city}})
                        .select("offices.id as office_id")
                        .where("object_items.employee_id = #{employee.id}")
    office_id = office_.blank? ? nil : check_right('book_every_where', employee) ? nil : office_.first['office_id']

    places = ObjectItem.joins(:floor => {:building => {:office => :city}})
      .joins("LEFT OUTER JOIN meta_values ON meta_values.meta_field_id = #{Rails.configuration.ds_ready_id}
                                          AND meta_values.metable_type = 'ObjectItem'
                                          AND meta_values.metable_id = object_items.id
              LEFT OUTER JOIN meta_values mv2 ON mv2.meta_field_id = #{Rails.configuration.employee_sd_id}
                                          AND mv2.metable_type = 'ObjectItem'
                                          AND mv2.metable_id = object_items.id")
      .where(
        "status = 'SHARING' AND
         #{!check_right('book_all_places', employee) ? " (
          costcenter_num = #{employee.costcenter_num.to_i} OR
          costcenter_num = 2580000 OR
          (LEFT(costcenter_num::varchar(255), 4) = '2583' AND '2583' = #{employee.costcenter_num.to_s[0..3]}) OR
          (LEFT(costcenter_num::varchar(255), 4) = '3581' AND '3581' = #{employee.costcenter_num.to_s[0..3]})
         ) #{office_id.blank? ? '' : ' AND offices.id != ' + office_id.to_s + ' '} AND " : " "}
         floors.id = #{floor_id} AND
         (meta_values.value = 'on')")
      .select("
        offices.name      AS office_name,
        offices.id        AS office_id,
        cities.name       AS city_name,
        cities.id         AS city_id,
        floors.id         AS floor_id,
        floors.name       AS floor_name,
        buildings.id      AS building_id,
        buildings.name    AS building_name,
        object_items.name AS name,
        object_items.id   AS place_id,
        meta_values.value AS ready,
        mv2.value         AS emp_sd_id,
        'off'             AS parking
      ")
    (places + available_sharing_places(employee, floor_id, nil, nil, true, true)).index_by { |r| r[:place_id]}.values
  end

  def search_bookings
    results = []
    select_booking_sql = '
      bookings.id             AS id,
      bookings.book_from      AS book_from,
      bookings.book_to        AS book_to,
      bookings.object_item_id AS object_item_id,
      bookings.comment        AS comment,
      employees.id            AS employee_id,
      employees.name          AS employee_name,
      employees.surname       AS employee_surname,
      employees.email         AS employee_email
    '
    current_bookings = params[:current].to_s.downcase == 'true' ? " AND (bookings.book_from::timestamp::date >= now()::date OR bookings.book_to::timestamp::date >= now()::date)" : ""
    if params[:place_addr].blank? && params[:place_id].blank? && params[:email]
      bookings = Booking.select(select_booking_sql).joins(:employee).where("employees.email = '#{params[:email]}' #{current_bookings}")
    elsif !params[:place_addr].blank? && params[:place_id].blank?
      bookings = Booking.select(select_booking_sql).joins(:employee).joins(:object_item)
        .where("object_items.name = '#{params[:place_addr]}' #{current_bookings}")
    elsif params[:place_addr].blank? && !params[:place_id].blank?
      bookings = Booking.select(select_booking_sql).joins(:employee).where("bookings.object_item_id = #{params[:place_id]} #{current_bookings}")
    else
      bookings = []
    end
    bookings.each do |booking|
      place = ObjectItem.joins(:floor => {:building => {:office => :city}})
        .where('object_items.id = ?', booking.object_item_id)
        .select('
          object_items.id             AS id,
          object_items.name           AS name,
          object_items.comment        AS comment,
          object_items.floor_id       AS floor_id,
          object_items.object_type_id AS object_type_id,
          object_items.costcenter_num AS costcenter_num,
          cities.id                   AS city_id,
          cities.name                 AS city_name,
          offices.id                  AS offices_id,
          offices.name                AS offices_name,
          buildings.id                AS buildings_id,
          buildings.name              AS buildings_name,
          floors.id                   AS floor_id,
          floors.name                 AS floor_name
        ').first
      results.push({
        id:             booking[:id],
        book_from:      booking[:book_from],
        book_to:        booking[:book_to],
        employee_id:    booking[:employee_id],
        employee_label: "#{booking[:employee_surname]} #{booking[:employee_name]}",
        employee_email: booking[:employee_email],
        comment_email:  booking[:comment].to_i > 0 ? Employee.find(booking[:comment]).email : booking[:employee_email],
        comment:        booking[:comment],
        object_item:    place,
        floor_id:       place['floor_id'],
        place_name:     place['name'],
        place_id:       place['id'],
        place_path:     "#{place['name']}"
      })
    end
    render json: results
  end

  def render_error(error_code, meta = nil)
    if error_code == 550
      render json: { status: "error", message: "Нет доступных мест" }, status: 550
    elsif error_code == 551
      render json: { status: "error", message: "Место не свободно для бронирования" }, status: 551
    elsif error_code == 552
      render json: { status: "error", message: "Отсутсвует право на бронирование с пересечением дат или имеется бронирование с пересечением дат", meta: meta }, status: 552
    elsif error_code == 553
      render json: { status: "error", message: "Некорректные даты бронирования" }, status: 553
    elsif error_code == 558
      render json: { status: "error", message: "Ошибка редактирования бронирования" }, status: 558
    elsif error_code == 559
      render json: { status: "error", message: "Ошибка бронирования" }, status: 559
    elsif error_code == 560
      render json: { status: "error", message: "Ошибка поиска" }, status: 560
    end
  end

  protected

  def map_object_item_to_center_name(object_item_id)
    office = ObjectItem.joins(:floor => {:building => {:office => :city}})
     .select('offices.id as id')
     .where("object_items.id = #{object_item_id}")
     .first
    case office[:id]
    when 2
      'elizavetinsky'
    when 3
      'ostrov'
    when 4
      'kirova11'
    when 5
      'romanovsky'
    when 6
      'preo'
    else
      'null'
    end
  end

  def set_headers
    response.set_header('Access-Control-Allow-Origin','*')
  end

  SELECT_OBJECT_ITEMS_STATIC = "
    offices.name                AS office_name,
    offices.id                  AS office_id,
    cities.name                 AS city_name,
    cities.id                   AS city_id,
    floors.id                   AS floor_id,
    floors.name                 AS floor_name,
    buildings.id                AS building_id,
    buildings.name              AS building_name,
    object_items.name           AS name,
    object_items.id             AS place_id,
    object_items.costcenter_num AS costcenter_num,
    object_items.location_id    AS location_id,
    object_items.top            AS top,
    object_items.angle          AS angle,
    object_items.width          AS width,
    object_items.left           AS left,
    object_items.height         AS height,
    object_items.scale          AS scale,
    mv.value                    AS ready
  "

  SELECT_OBJECT_ITEMS_STATIC_SHARING = "
    offices.name             AS office_name,
    offices.id               AS office_id,
    cities.name              AS city_name,
    cities.id                AS city_id,
    floors.id                AS floor_id,
    floors.name              AS floor_name,
    buildings.id             AS building_id,
    buildings.name           AS building_name,
    object_items.name        AS name,
    object_items.id          AS place_id,
    object_items.id          AS id,
    object_items.location_id AS location_id,
    mv.value                 AS ready,
    mv2.value                AS parking,
    mv3.value                AS emp_sd_id,
    object_items.top         AS top,
    object_items.left        AS left,
    object_items.angle       AS angle,
    object_items.width       AS width,
    object_items.height      AS height,
    object_items.scale       AS scale
  "

  META_ATTRIBUTES_JOIN = "
    LEFT JOIN meta_values mv  ON mv.metable_id = object_items.id
                             AND mv.metable_type = 'ObjectItem'
                             AND mv.meta_field_id = #{Rails.configuration.ds_ready_id}
    LEFT JOIN meta_values mv2 ON mv2.metable_id = object_items.id
                             AND mv2.metable_type = 'ObjectItem'
                             AND mv2.meta_field_id = #{Rails.configuration.parking_place_id}
    LEFT JOIN meta_values mv3 ON mv3.meta_field_id = #{Rails.configuration.employee_sd_id}
                             AND mv3.metable_type = 'ObjectItem'
                             AND mv3.metable_id = object_items.id
  "

end
