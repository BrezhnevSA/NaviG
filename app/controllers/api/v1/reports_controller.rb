#encoding utf-8
#
module Api
  module V1
  end
end
class Api::V1::ReportsController < ApplicationController

  before_action :authenticate_request!
  before_action :get_costcenters, :except => [ :send_report ]
  before_action :get_acc_id, :except => [ :send_report ]

  after_action :set_headers

  def get_costcenters
    uri = URI 'https://centra.t-systems.ru/costcenters?attributes=name,number'
    req = Net::HTTP::Get.new uri
    token = 'c57cc9d025edec041b58e93645c91cb9770b2d0b5b0c9ad6c65a787247c53126'
    version = '1'
    req['Authorization'] = "Token token=\"#{token}\""
    req['Accept'] = "application/vnd.api+json; version=#{version}"
    res = Net::HTTP.start(uri.host,
                          uri.port,
                          use_ssl: uri.scheme == 'https',
                          verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
      http.request(req)
    end
    @ccs = {}
    JSON.parse(res.body)['data'].each do |cc|
      number = cc['attributes']['number'].to_i
      name = cc['attributes']['name']
      @ccs[number] = name
    end
  end

  def send_report
    user_email = params[:anonymous].to_s == 'true' ? 'NAVI MOBILE' : @current_user.email
    user_fio = !params[:fio].to_s.blank? ? params[:fio] : "#{@current_user.surname} #{@current_user.name} #{@current_user.patronymic}"
    ActionMailer::Base.mail(
      from: "#{user_email}",
      to: "RU_navi_support@internal.telekom.com",
      subject: "Обратная связь по new navi от #{user_fio}",
      body: params[:message]
    ).deliver
    render json: nil
  end

  def get_acc_id
    uri = URI 'https://centra.t-systems.ru/employees?attributes=acc_id'
    req = Net::HTTP::Get.new uri
    token = 'c57cc9d025edec041b58e93645c91cb9770b2d0b5b0c9ad6c65a787247c53126'
    version = '1'
    req['Authorization'] = "Token token=\"#{token}\""
    req['Accept'] = "application/vnd.api+json; version=#{version}"
    res = Net::HTTP.start(uri.host,
                          uri.port,
                          use_ssl: uri.scheme == 'https',
                          verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
      http.request(req)
    end
    @accs = {}
    JSON.parse(res.body)['data'].each do |acc|
      centra_id = acc['id'].to_i
      acc_id = acc['attributes']['acc-id']
      @accs[centra_id] = acc_id
    end
  end

  def relocation_report
    if check_right('view_reports')
      date_start = params[:date_start]
      date_end   = params[:date_end]
      as_file    = params[:as_file].to_s.downcase == "true"

      unless (date_start.blank? && date_end.blank? && Date.parse(date_end) < Date.parse(date_start))
        if (as_file)
          filename = "report_relocations_#{date_start}_#{date_end}.xls"
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
          main_sheet = rend.add_worksheet 'report'
          main_sheet.autofilter 'A1:F1'
          widths = [20, 35, 35, 20, 20, 15]
          headers = ['Табельный номер',
                     'ФИО',
                     'Почта',
                     'До переезда',
                     'После переезда',
                     'Дата переезда']
          main_sheet.write_row 0, 0, headers[0..5], format_for_headers
          (0..5).each do |current_row|
            main_sheet.set_column current_row, 0, widths[current_row]
          end
        end
        values = []

        report = ActiveRecord::Base.connection.execute("
SELECT
    e.id                                              AS id,
    CONCAT(e.surname, ' ', e.name, ' ', e.patronymic) AS fio,
    e.email                                           AS email,
    h.office_id                                       AS before_moving,
    CASE
        WHEN h.hb_type = 'moving'
         AND (
           SELECT h2.hb_type
             FROM heartbeats h2
            INNER JOIN employees e2 ON e2.login = h2.login
            WHERE h2.login = h.login
              AND h2.id != h.id
              AND h2.created_at <= h.created_at
              AND h2.office_id != h.office_id
            ORDER BY h2.created_at ASC
            LIMIT 1
        ) IN ('moving','seat')
            THEN (
           SELECT h2.office_id
             FROM heartbeats h2
            INNER JOIN employees e2 ON e2.login = h2.login
            WHERE h2.login = h.login
              AND h2.id != h.id
              AND h2.created_at <= h.created_at
              AND h2.office_id != h.office_id
              AND (h2.hb_type = 'moving'
                OR h2.hb_type = 'seat')
            ORDER BY h2.created_at ASC
            LIMIT 1
        )
        ELSE CASE
                 WHEN h.hb_type = 'seat'
                  AND (
                    SELECT h2.hb_type
                      FROM heartbeats h2
                     INNER JOIN employees e2 ON e2.login = h2.login
                     WHERE h2.login = h.login
                       AND h2.id != h.id
                       AND h2.created_at <= h.created_at
                       AND h2.office_id != h.office_id
                     ORDER BY h2.created_at ASC
                     LIMIT 1
                 ) IN ('removing','seat')
                     THEN (
                    SELECT h2.office_id
                      FROM heartbeats h2
                     INNER JOIN employees e2 ON e2.login = h2.login
                     WHERE h2.login = h.login
                       AND h2.id != h.id
                       AND h2.created_at <= h.created_at
                       AND h2.office_id != h.office_id
                       AND (h2.hb_type = 'removing'
                         OR h2.hb_type = 'seat')
                     ORDER BY h2.created_at ASC
                     LIMIT 1
                 )
                 ELSE -1
            END
        END                                           AS after_moving,
    h.created_at                                      AS date_moving
FROM heartbeats h
         INNER JOIN employees e ON e.login = h.login
WHERE
      h.created_at::timestamp::date >= '#{date_start}'
  AND h.created_at::timestamp::date <= '#{date_end}'
  AND h.login IS NOT NULL
  AND (
        (h.hb_type = 'moving'
            AND (
            SELECT h2.hb_type
              FROM heartbeats h2
             INNER JOIN employees e2 ON e2.login = h2.login
             WHERE h2.login = h.login
               AND h2.id != h.id
               AND h2.created_at <= h.created_at
               AND h2.office_id != h.office_id
             ORDER BY h2.created_at ASC
             LIMIT 1
            ) IN ('moving', 'seat')
        )
        OR
        (h.hb_type = 'seat'
            AND (
            SELECT h2.hb_type
              FROM heartbeats h2
             INNER JOIN employees e2 ON e2.login = h2.login
             WHERE h2.login = h.login
               AND h2.id != h.id
               AND h2.created_at <= h.created_at
               AND h2.office_id != h.office_id
             ORDER BY h2.created_at ASC
             LIMIT 1
            ) IN ('removing', 'seat')
        )
    )
ORDER BY fio, h.created_at ASC
  ")
        business_centers = Office.select('
          offices.name AS name,
          offices.id   AS bc_type
        ')
        report.each do |item|
          before_moving = ''
          after_moving = ''
          business_centers.each do |bc|
            if bc[:bc_type].to_i == item['before_moving'].to_i
              before_moving = bc[:name]
            end
            if bc[:bc_type].to_i == item['after_moving'].to_i
              after_moving = bc[:name]
            end
          end
          if as_file
            entry = []
            entry << item['id']
            entry << item['fio']
            entry << item['email']
            entry << before_moving
            entry << after_moving
            entry << item['date_moving'].strftime("%d.%m.%Y")
            values.push(entry)
          else
            values.push({
              'id'            => item['id'],
              'fio'           => item['fio'],
              'email'         => item['email'],
              'before_moving' => before_moving,
              'after_moving'  => after_moving,
              'date'          => item['date_moving'].strftime("%d.%m.%Y %H:%M:%S")
            })
          end
        end

        if as_file
          row_to_write_to = 1
          values.each do |current_row|
            main_sheet.write(row_to_write_to, 0, current_row[0..5], format_for_everything_else)
            row_to_write_to += 1
          end
          rend.close
        end
      end

      if as_file
        send_file tempfile.path, filename: filename
      else
        render json: values
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end


  def generate_meterage
    if check_right('view_reports')
      as_file  = params[:as_file].to_s.downcase == "true"
      city     = City.find(params[:city]).name
      if as_file
        city_lat = Translit.convert city
        filename = "rent_#{city_lat.downcase}_#{Date.today.strftime '%Y-%m-%d'}.xls"
        tempfile = Tempfile.new filename
        rend     = WriteExcel.new tempfile.path
        format_for_headers = rend.add_format bg_color: 15,
                                             pattern: 1,
                                             align: :justify,
                                             vertical_align: :center,
                                             border: 1,
                                             bold: 1
        format_for_specific_headers = rend.add_format bg_color: 13,
                                                      pattern: 1,
                                                      align: :justify,
                                                      vertical_align: :center,
                                                      border: 1,
                                                      bold: 1
        format_for_specific_columns = rend.add_format bg_color: 13,
                                                      pattern: 1,
                                                      align: :justify,
                                                      vertical_align: :center,
                                                      border: 1
        format_for_everything_else = rend.add_format align: :justify,
                                                     border: 1
        format_for_floats = rend.add_format align: :justify,
                                            border: 1
        format_for_floats.set_num_format '0.00'
        main_sheet = rend.add_worksheet city_lat
        main_sheet.autofilter 'A1:M1'
        headers = ['Город',
                   'Офис',
                   'Корпус',
                   'Этаж',
                   'Номер контракта',
                   'Номер помещения',
                   'Проект/помещение',
                   'Количество мест на МВЗ',
                   'Номер МВЗ',
                   'Название МВЗ',
                   'Количество метров',
                   'Количество мест',
                   'Количество метров на место',
                   'Количество метров на МВЗ',
                   'Стоимость за метр',
                   'Стоимость проекта']
        main_sheet.write_row 0, 0, headers[0..5], format_for_headers
        main_sheet.write_row 0, 6, headers[6..9], format_for_specific_headers
        main_sheet.write_row 0, 10, headers[10..15], format_for_headers
        (0..15).each do |current_row|
          main_sheet.set_column current_row, 0, 16
        end
      end
      values = []
      meterage =
                   ActiveRecord::Base.connection.execute("
SELECT
    City                                                    AS Город,
    Office                                                  AS Офис,
    Building                                                AS Корпус,
    Floor                                                   AS Этаж,
    Contract                                                AS Номер_контракта,
    Location                                                AS Номер_помещения,
    ProjLocName                                             AS Проект_помещение,
    CostSeats                                               AS Мест_на_МВЗ,
    Number                                                  AS Номер_МВЗ,
    Square                                                  AS Количество_метров,
    Seats                                                   AS Количество_мест,
    ROUND((Square / Seats)::numeric, 2)                     AS Количество_метров_на_место,
    CostSeats * ROUND((Square / Seats)::numeric, 2)         AS Количество_метров_на_МВЗ,
    Price                                                   AS Стоимость_за_метр,
    ROUND((Square / Seats * CostSeats * Price)::numeric, 2) AS Стоимость_на_МВЗ
FROM (
         SELECT
             City,
             Office,
             Building,
             Floor,
             Contract,
             Location,
             ' '      AS ProjLocName,
             COUNT(*) AS CostSeats,
             Number,
             Square,
             Seats,
             Price
         FROM (
                  SELECT
                      -- Processing of seated places
                      ct.name                     AS City,
                      o.name                      AS Office,
                      b.name                      AS Building,
                      f.name                      AS Floor,
                      cont.name                   AS Contract,
                      l.name                      AS Location,
                      ''                          AS ProjLocName,
                      e.costcenter_num            AS Number,
                      0                           AS CostSeats,
                      (
                          SELECT CAST(mv.value AS double precision)
                          FROM meta_values mv, meta_values mv_iu,
                               meta_fields mf, meta_types mt
                          WHERE mv.metable_type = 'Location'
                            AND mv.metable_id = l.id
                            AND mv.meta_field_id = mf.id
                            AND mf.meta_type_id = mt.id
                            AND mt.metatype = 'square'
                          LIMIT 1
                      )                             AS Square,
                      (
                          SELECT COUNT(*)
                          FROM object_items
                          WHERE location_id = l.id) AS Seats,
                      cont.price                AS Price
                  FROM
                      cities ct, offices o, buildings b, floors f, object_items oi, employees e,
                      contracts cont, locations l
                  WHERE o.city_id = ct.id
                    AND b.office_id = o.id
                    AND f.building_id = b.id
                    AND oi.floor_id = f.id
                    AND oi.employee_id = e.id
                    AND oi.location_id = l.id
                    AND cont.id IN
                        (
                           SELECT CAST(mv_cont.value AS bigint)
                             FROM meta_values mv_cont, meta_values mv_iu,
                                  meta_fields mf, meta_types mt
                            WHERE mv_cont.metable_type = 'Location'
                              AND mv_cont.metable_id = l.id
                              AND mv_cont.meta_field_id = mf.id
                              AND mf.meta_type_id = mt.id
                              AND mt.metatype = 'reference'
                        )
                    AND 'true' =
                        (
                            SELECT mv.value
                            FROM meta_values mv, meta_values mv_iu,
                                 meta_fields mf, meta_types mt
                            WHERE mv.metable_type = 'Location'
                              AND mv.metable_id = l.id
                              AND mv.meta_field_id = mf.id
                              AND mf.meta_type_id = mt.id
                              AND mt.metatype = 'checkbox'
                            LIMIT 1
                        )
                    AND e.costcenter_num IS NOT NULL
                  UNION ALL
                  SELECT
                      -- Processing of free places
                      ct.name                     AS City,
                      o.name                      AS Office,
                      b.name                      AS Building,
                      f.name                      AS Floor,
                      cont.name                   AS Contract,
                      l.name                      AS Location,
                      ' '                         AS ProjLocName,
                      2580000                     AS Number,
                      0                           AS CostSeats,
                      (
                          SELECT CAST(mv.value AS double precision)
                          FROM meta_values mv, meta_values mv_iu,
                               meta_fields mf, meta_types mt
                          WHERE mv.metable_type = 'Location'
                            AND mv.metable_id = l.id
                            AND mv.meta_field_id = mf.id
                            AND mf.meta_type_id = mt.id
                            AND mt.metatype = 'square'
                          LIMIT 1
                      )                             AS Square,
                      (
                          SELECT COUNT(*)
                          FROM object_items
                          WHERE location_id = l.id) AS Seats,
                      cont.price                  AS Price
                  FROM
                      cities ct, offices o, buildings b, floors f, object_items oi, locations l,
                      contracts cont
                  WHERE o.city_id = ct.id
                    AND b.office_id = o.id
                    AND f.building_id = b.id
                    AND oi.floor_id = f.id
                    AND oi.location_id = l.id
                    AND oi.employee_id IS NULL
                    AND oi.costcenter_num IS NULL
                    AND cont.id IN
                        (
                           SELECT CAST(mv_cont.value AS bigint)
                             FROM meta_values mv_cont, meta_values mv_iu,
                                  meta_fields mf, meta_types mt
                            WHERE mv_cont.metable_type = 'Location'
                              AND mv_cont.metable_id = l.id
                              AND mv_cont.meta_field_id = mf.id
                              AND mf.meta_type_id = mt.id
                              AND mt.metatype = 'reference'
                        )
                    AND 'true' =
                        (
                            SELECT mv.value
                            FROM meta_values mv, meta_values mv_iu,
                                 meta_fields mf, meta_types mt
                            WHERE mv.metable_type = 'Location'
                              AND mv.metable_id = l.id
                              AND mv.meta_field_id = mf.id
                              AND mf.meta_type_id = mt.id
                              AND mt.metatype = 'checkbox'
                            LIMIT 1
                        )
             ) AS Useful
         GROUP BY Number, Location, City, Office, Building, Floor, Contract, Square, Seats, Price
         UNION ALL
         SELECT
             -- Processing of useless locations
             ct.name          AS City,
             o.name           AS Office,
             b.name           AS Building,
             f.name           AS Floor,
             cont.name        AS Contract,
             l.name           AS Location,
             l.name           AS ProjLocName,
             1                AS CostSeats,
             l.costcenter_num AS Number,
             (
                 SELECT CAST(mv.value AS double precision)
                 FROM meta_values mv, meta_values mv_iu,
                      meta_fields mf, meta_types mt
                 WHERE mv.metable_type = 'Location'
                   AND mv.metable_id = l.id
                   AND mv.meta_field_id = mf.id
                   AND mf.meta_type_id = mt.id
                   AND mt.metatype = 'square'
                 LIMIT 1
             )                             AS Square,
             1                AS Seats,
             cont.price       AS Price
         FROM cities ct, offices o, buildings b, floors f, contracts cont, locations l
         WHERE o.city_id = ct.id
           AND b.office_id = o.id
           AND f.building_id = b.id
           AND l.floor_id = f.id
           AND cont.id IN
               (
                  SELECT CAST(mv_cont.value AS bigint)
                    FROM meta_values mv_cont, meta_values mv_iu,
                         meta_fields mf, meta_types mt
                   WHERE mv_cont.metable_type = 'Location'
                     AND mv_cont.metable_id = l.id
                     AND mv_cont.meta_field_id = mf.id
                     AND mf.meta_type_id = mt.id
                     AND mt.metatype = 'reference'
               )
           AND (
              'false' = (
                  SELECT mv.value
                  FROM meta_values mv, meta_values mv_iu,
                       meta_fields mf, meta_types mt
                  WHERE mv.metable_type = 'Location'
                    AND mv.metable_id = l.id
                    AND mv.meta_field_id = mf.id
                    AND mf.meta_type_id = mt.id
                    AND mt.metatype = 'checkbox'
                  LIMIT 1
              ) OR (
                SELECT mv.value
                FROM meta_values mv, meta_values mv_iu,
                     meta_fields mf, meta_types mt
                WHERE mv.metable_type = 'Location'
                  AND mv.metable_id = l.id
                  AND mv.meta_field_id = mf.id
                  AND mf.meta_type_id = mt.id
                  AND mt.metatype = 'checkbox'
                LIMIT 1
              ) IS NULL
          )
         UNION ALL
         SELECT
             -- Processing of reservations
             ct.name                       AS City,
             o.name                        AS Office,
             b.name                        AS Building,
             f.name                        AS Floor,
             cont.name                     AS Contract,
             l.name                        AS Location,
             'резерв'                      AS ProjLocName,
             COUNT(*)                      AS CostSeats,
             oi.costcenter_num             AS Number,
             (
                 SELECT CAST(mv.value AS double precision)
                 FROM meta_values mv, meta_values mv_iu,
                      meta_fields mf, meta_types mt
                 WHERE mv.metable_type = 'Location'
                   AND mv.metable_id = l.id
                   AND mv.meta_field_id = mf.id
                   AND mf.meta_type_id = mt.id
                   AND mt.metatype = 'square'
                 LIMIT 1
             )                             AS Square,
             (
                 SELECT COUNT(*)
                 FROM object_items
                 WHERE location_id = l.id)   AS Seats,
             cont.price                    AS Price
         FROM
             cities ct, offices o, buildings b, floors f, object_items oi, locations l,
             contracts cont
         WHERE o.city_id = ct.id
           AND b.office_id = o.id
           AND f.building_id = b.id
           AND oi.floor_id = f.id
           AND oi.location_id = l.id
           AND oi.employee_id IS NULL
           AND cont.id IN
               (
                  SELECT CAST(mv_cont.value AS bigint)
                    FROM meta_values mv_cont, meta_values mv_iu,
                         meta_fields mf, meta_types mt
                   WHERE mv_cont.metable_type = 'Location'
                     AND mv_cont.metable_id = l.id
                     AND mv_cont.meta_field_id = mf.id
                     AND mf.meta_type_id = mt.id
                     AND mt.metatype = 'reference'
               )
           AND 'true' =
               (
                   SELECT mv.value
                   FROM meta_values mv, meta_values mv_iu,
                        meta_fields mf, meta_types mt
                   WHERE mv.metable_type = 'Location'
                     AND mv.metable_id = l.id
                     AND mv.meta_field_id = mf.id
                     AND mf.meta_type_id = mt.id
                     AND mt.metatype = 'checkbox'
                   LIMIT 1
               )
           AND oi.costcenter_num IS NOT NULL
           AND status = 'RESERVED'
         GROUP BY Number, Location, City, Office, Building, Floor, Contract, Square, Seats, Price, l.id
         UNION ALL
         SELECT
             -- Processing of reserved guest places
             ct.name                       AS City,
             o.name                        AS Office,
             b.name                        AS Building,
             f.name                        AS Floor,
             cont.name                     AS Contract,
             l.name                        AS Location,
             'гостевое'                    AS ProjLocName,
             COUNT(*)                      AS CostSeats,
             oi.costcenter_num             AS Number,
             (
                 SELECT CAST(mv.value AS double precision)
                 FROM meta_values mv, meta_values mv_iu,
                      meta_fields mf, meta_types mt
                 WHERE mv.metable_type = 'Location'
                   AND mv.metable_id = l.id
                   AND mv.meta_field_id = mf.id
                   AND mf.meta_type_id = mt.id
                   AND mt.metatype = 'square'
                 LIMIT 1
             )                             AS Square,
             (
                 SELECT COUNT(*)
                 FROM object_items
                 WHERE location_id = l.id) AS Seats,
             cont.price                    AS Price
         FROM
             cities ct, offices o, buildings b, floors f, object_items oi, locations l,
             contracts cont
         WHERE o.city_id = ct.id
           AND b.office_id = o.id
           AND f.building_id = b.id
           AND oi.floor_id = f.id
           AND oi.location_id = l.id
           AND oi.employee_id IS NULL
           AND cont.id IN
               (
                 SELECT CAST(mv_cont.value AS bigint)
                   FROM meta_values mv_cont, meta_values mv_iu,
                        meta_fields mf, meta_types mt
                  WHERE mv_cont.metable_type = 'Location'
                    AND mv_cont.metable_id = l.id
                    AND mv_cont.meta_field_id = mf.id
                    AND mf.meta_type_id = mt.id
                    AND mt.metatype = 'reference'
               )
           AND 'true' =
               (
                   SELECT mv.value
                   FROM meta_values mv, meta_values mv_iu,
                        meta_fields mf, meta_types mt
                   WHERE mv.metable_type = 'Location'
                     AND mv.metable_id = l.id
                     AND mv.meta_field_id = mf.id
                     AND mf.meta_type_id = mt.id
                     AND mt.metatype = 'checkbox'
                   LIMIT 1
               )
           AND oi.costcenter_num IS NOT NULL
           AND status = 'GUEST'
         GROUP BY Number, Location, City, Office, Building, Floor, Contract, Square, Seats, Price, l.id
         UNION ALL
         SELECT
             -- Processing of shared desk places
             ct.name                       AS City,
             o.name                        AS Office,
             b.name                        AS Building,
             f.name                        AS Floor,
             cont.name                     AS Contract,
             l.name                        AS Location,
             'desk sharing'                AS ProjLocName,
             COUNT(*)                      AS CostSeats,
             oi.costcenter_num             AS Number,
             (
                 SELECT CAST(mv.value AS double precision)
                 FROM meta_values mv, meta_values mv_iu,
                      meta_fields mf, meta_types mt
                 WHERE mv.metable_type = 'Location'
                   AND mv.metable_id = l.id
                   AND mv.meta_field_id = mf.id
                   AND mf.meta_type_id = mt.id
                   AND mt.metatype = 'square'
                 LIMIT 1
             )                             AS Square,
             (
                 SELECT COUNT(*)
                 FROM object_items
                 WHERE object_items.location_id = l.id) AS Seats,
             cont.price                    AS Price
         FROM
             cities ct, offices o, buildings b, floors f, object_items oi, locations l,
             contracts cont
         WHERE o.city_id = ct.id
           AND b.office_id = o.id
           AND f.building_id = b.id
           AND oi.floor_id = f.id
           AND oi.location_id = l.id
           AND oi.employee_id IS NULL
           AND cont.id IN
               (
                   SELECT CAST(mv_cont.value AS bigint)
                     FROM meta_values mv_cont, meta_values mv_iu,
                          meta_fields mf, meta_types mt
                    WHERE mv_cont.metable_type = 'Location'
                      AND mv_cont.metable_id = l.id
                      AND mv_cont.meta_field_id = mf.id
                      AND mf.meta_type_id = mt.id
                      AND mt.metatype = 'reference'
               )
           AND 'true' =
               (
                   SELECT mv.value
                   FROM meta_values mv, meta_values mv_iu,
                        meta_fields mf, meta_types mt
                   WHERE mv.metable_type = 'Location'
                     AND mv.metable_id = l.id
                     AND mv.meta_field_id = mf.id
                     AND mf.meta_type_id = mt.id
                     AND mt.metatype = 'checkbox'
                   LIMIT 1
               )
           AND oi.costcenter_num IS NOT NULL
           AND oi.status = 'SHARING'
         GROUP BY Number, Location, City, Office, Building, Floor, Contract, Square, Seats, Price, l.id
     ) AS Meterage
  WHERE City = '#{city}'
  ORDER BY Офис, Корпус, Этаж, Номер_помещения, Мест_на_МВЗ DESC;
  ")

      meterage.each do |loc|
        if as_file
          entry = []
          entry << loc['Город']
          entry << loc['Офис']
          entry << loc['Корпус']
          entry << loc['Этаж']
          entry << loc['Номер_контракта']
          entry << loc['Номер_помещения']
          entry << loc['Проект_помещение']
          entry << loc['Мест_на_МВЗ']
          costcenter = loc['Номер_МВЗ']
          entry << costcenter
          entry << @ccs[costcenter.to_i]
          entry << loc['Количество_метров']
          entry << loc['Количество_мест']
          entry << loc['Количество_метров_на_место']
          entry << loc['Количество_метров_на_МВЗ']
          entry << loc['Стоимость_за_метр']
          entry << loc['Стоимость_на_МВЗ']
          values.push(entry)
        else
          costcenter = loc['Номер_МВЗ']
          values.push({
            'city'                           => loc['Город'],
            'office'                         => loc['Офис'],
            'building'                       => loc['Корпус'],
            'floor'                          => loc['Этаж'],
            'contract_num'                   => loc['Номер_контракта'],
            'location_num'                   => loc['Номер_помещения'],
            'project_location'               => loc['Проект_помещение'],
            'places_on_costcenter'           => loc['Мест_на_МВЗ'],
            'costcenter'                     => costcenter,
            'costcenter_name'                => @ccs[costcenter.to_i],
            'number_of_meters'               => loc['Количество_метров'],
            'number_of_places'               => loc['Количество_мест'],
            'numver_of_meters_on_place'      => loc['Количество_метров_на_место'],
            'number_of_meters_om_costcenter' => loc['Количество_метров_на_МВЗ'],
            'cost_for_meter'                 => loc['Стоимость_за_метр'],
            'cost_for_costcenter'            => loc['Стоимость_на_МВЗ'],
          })
        end
      end

      if as_file
        row_to_write_to = 1
        values.each do |current_row|
          main_sheet.write(row_to_write_to, 0, current_row[0..5], format_for_everything_else)
          main_sheet.write(row_to_write_to, 6, current_row[6..7], format_for_specific_columns)
          main_sheet.write(row_to_write_to, 8, current_row[8].to_i, format_for_specific_columns)
          main_sheet.write(row_to_write_to, 9, current_row[9], format_for_specific_columns)
          main_sheet.write(row_to_write_to, 10, current_row[10..15], format_for_everything_else)
          row_to_write_to += 1
        end
        rend.close
      end

      if as_file
        send_file tempfile.path, filename: filename
      else
        render json: values
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def generate_costcenter_places
    if check_right('view_reports')
      as_file = params[:as_file].to_s.downcase == "true"
      if as_file
        filename    = "navi_places_#{Time.now.strftime '%Y-%m-%d_%H-%M'}.xls"
        tempfile    = Tempfile.open filename
        place_xls   = WriteExcel.new tempfile.path, font: 'Calibri', size: 12
        place_sheet = place_xls.add_worksheet 'Места и МВЗ'
        headers     = %w(Город Офис Корпус Этаж Помещение Место Сотрудник E-Mail Табельник Номер МВЗ)
        widths      = [15, 20, 20, 20, 15, 10, 25, 30, 10, 10, 20]
        (0..10).each do |current_row|
          place_sheet.set_column current_row, 0, widths[current_row]
        end
        format_for_headers = place_xls.add_format bg_color: 15,
                                                  pattern: 1,
                                                  align: :justify,
                                                  vertical_align: :center,
                                                  border: 1,
                                                  bold: 1
        place_sheet.write_row 0, 0, headers, format_for_headers
      end
      values      = []
      place_query = ActiveRecord::Base.connection.execute("
  SELECT ct_name    AS City,
         o_name     AS Office,
         b_name     AS Building,
         f_name     AS Floor,
         l_name     AS Location,
         c_addr     AS Place,
         Employee   AS Employee,
         Email      AS Email,
         EmployeeID AS EmployeeID,
         Costcenter AS Costcenter
  FROM (
           SELECT ct.name                        AS ct_name,
                  ct.ord                         AS ct_ord,
                  b.name                         AS b_name,
                  o.name                         AS o_name,
                  o.ord                          AS o_ord,
                  f.name                         AS f_name,
                  f.ord                          AS f_ord,
                  l.name                         AS l_name,
                  c.name                         AS c_addr,
                  CONCAT(e.surname, ' ', e.name) AS Employee,
                  e.email                        AS Email,
                  e.id                           AS EmployeeID,
                  e.costcenter_num               AS Costcenter
           FROM cities ct,
                offices o,
                buildings b,
                floors f,
                locations l,
                object_items c,
                employees e
           WHERE ct.id = o.city_id
             AND o.id = b.office_id
             AND b.id = f.building_id
             AND f.id = c.floor_id
             AND l.id = c.location_id
             AND e.id = c.employee_id
             AND c.employee_id > 0
           UNION ALL
           SELECT ct.name,
                  ct.ord,
                  b.name,
                  o.name,
                  o.ord,
                  f.name,
                  f.ord,
                  l.name,
                  c.name,
                  c.status,
                  NULL,
                  0,
                  c.costcenter_num
           FROM cities ct,
                offices o,
                buildings b,
                floors f,
                locations l,
                object_items c
           WHERE ct.id = o.city_id
             AND o.id = b.office_id
             AND b.id = f.building_id
             AND f.id = c.floor_id
             AND l.id = c.location_id
             AND c.employee_id IS NULL
             AND c.costcenter_num IS NOT NULL) l_select
  ORDER BY ct_ord DESC,
           o_ord DESC,
           f_ord,
           l_name,
           c_addr;
  ")
      if as_file
        place_query.each do |res|
          entry = []
          entry << res['city']
          entry << res['office']
          entry << res['building']
          entry << res['floor']
          entry << res['location']
          entry << res['place']
          entry << res['employee']
          entry << res['email']
          employee_id = res['employeeid']
          entry << @accs[employee_id]
          costcenter = res['costcenter']
          entry << costcenter
          entry << @ccs[costcenter.to_i]
          values.push(entry)
          # p entry
        end
        # p @accs[156]
        row_to_write_to = 1
        values.each do |current_row|
          place_sheet.write row_to_write_to, 0, current_row[0..7]
          place_sheet.write row_to_write_to, 8, current_row[8].to_i
          place_sheet.write row_to_write_to, 9, current_row[9].to_i
          place_sheet.write row_to_write_to, 10, current_row[10]
          row_to_write_to += 1
        end
        place_xls.close
        send_file tempfile.path, filename: filename
      else
        place_query.each do |res|
          employee_id = res['employeeid']
          costcenter  = res['costcenter']
          values.push({
            'city'            => res['city'],
            'office'          => res['office'],
            'building'        => res['building'],
            'floor'           => res['floor'],
            'location'        => res['location'],
            'place'           => res['place'],
            'employee'        => res['employee'],
            'email'           => res['email'],
            'employee_num'    => @accs[employee_id],
            'costcenter_num' => costcenter,
            'costcenter_name'  => @ccs[costcenter.to_i],
          })
        end
        render json: values
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def generate_reservations
    if check_right('view_reports')
      as_file = params[:as_file].to_s.downcase == "true"
      filename = "navi_reservations_#{Date.today.strftime '%Y-%m-%d'}.xls"
      tempfile = Tempfile.new filename
      reservation = WriteExcel.new tempfile.path, font: 'Calibri', size: 12
      tso_sheet = reservation.add_worksheet 'TSO reservations'
      cso_sheet = reservation.add_worksheet 'CSO reservations'
      tso_sheet.autofilter 'A1:H1'
      cso_sheet.autofilter 'A1:H1'
      headers = %w(Город Офис Корпус Этаж Номер МВЗ Кол-во Места)
      widths = [15, 20, 20, 20, 10, 15, 10, 50]
      (0..7).each do |current_row|
        tso_sheet.set_column current_row, 0, widths[current_row]
        cso_sheet.set_column current_row, 0, widths[current_row]
      end
      format_for_headers = reservation.add_format bg_color: 15,
                                                  pattern: 1,
                                                  align: :justify,
                                                  vertical_align: :center,
                                                  border: 1,
                                                  bold: 1
      tso_sheet.write_row 0, 0, headers, format_for_headers
      cso_sheet.write_row 0, 0, headers, format_for_headers
      result = []
      [tso_sheet, cso_sheet].each_with_index do |sheet, index|
        values = []
        reservation_query = ActiveRecord::Base.connection.execute("
  SELECT
         ct.id,
         ct.name                  AS City,
         o.name                   AS Office,
         b.name                   AS Building,
         f.name                   AS Floor,
         oi.costcenter_num        AS Costcenter,
         COUNT(oi.name)           AS Count,
         string_agg(oi.name, ',') AS Reservations
    FROM object_items oi, floors f, buildings b, offices o, cities ct
   WHERE oi.floor_id = f.id
     AND f.building_id = b.id
     AND b.office_id = o.id
     AND o.city_id = ct.id
     AND oi.employee_id IS NULL
     AND costcenter_num IS NOT NULL
     AND CAST (costcenter_num AS varchar) LIKE '2583#{index + 1}%'
   GROUP BY o.name, b.name, f.name, oi.costcenter_num, ct.id
   ORDER BY ct.id, o.name, b.name, f.name, oi.costcenter_num;
  ")
        reservation_query.each do |res|
          costcenter = res['costcenter']
          if as_file
            entry = []
            entry << res['city']
            entry << res['office']
            entry << res['building']
            entry << res['floor']
            entry << costcenter
            entry << @ccs[costcenter.to_i]
            entry << res['count']
            entry << res['reservations']
            values.push(entry)
          else
            result.push({
              'sheet'           => index == 0 ? 'TSO' : 'CSO',
              'city'            => res['city'],
              'office'          => res['office'],
              'building'        => res['building'],
              'floor'           => res['floor'],
              'costcenter_num'  => costcenter,
              'costcenter_name' => @ccs[costcenter.to_i],
              'count'           => res['count'],
              'reservations'    => res['reservations']
            })
          end
        end
        if as_file
          row_to_write_to = 1
          values.each do |current_row|
            sheet.write row_to_write_to, 0, current_row[0..2]
            sheet.write row_to_write_to, 3, current_row[3]
            sheet.write row_to_write_to, 4, current_row[4..7]
            row_to_write_to += 1
          end
        end
      end
      reservation.close
      if as_file
        send_file tempfile.path, filename: filename
      else
        render json: result
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def generate_non_seated_employees
    if check_right('view_reports')
      as_file = params[:as_file].to_s.downcase == "true"
      if as_file
        filename = "non_seated_employees_#{Date.today.strftime '%Y-%m-%d'}.xls"
        tempfile = Tempfile.new filename
        reservation = WriteExcel.new tempfile.path, font: 'Calibri', size: 12
        tso_sheet = reservation.add_worksheet 'Non seated employees'
        headers = %w(Город Офис Корпус Этаж Номер МВЗ Место Комментарий)
        widths = [15, 20, 20, 10, 15, 10, 60]
        tso_sheet.autofilter 'A1:H1'
        (0..7).each do |current_row|
          tso_sheet.set_column current_row, 0, widths[current_row]
        end
        format_for_headers = reservation.add_format bg_color: 15,
                                                    pattern: 1,
                                                    align: :justify,
                                                    vertical_align: :center,
                                                    border: 1,
                                                    bold: 1
        tso_sheet.write_row 0, 0, headers, format_for_headers
      end
      values = []
      reservation_query = ActiveRecord::Base.connection.execute("
  SELECT
         ct.name           AS City,
         o.name            AS Office,
         b.name            AS Building,
         f.name            AS Floor,
         oi.costcenter_num AS Costcenter,
         oi.name           AS Addr,
         oi.comment        AS Comment
    FROM object_items oi, floors f, buildings b, offices o, cities ct
   WHERE oi.floor_id = f.id
     AND f.building_id = b.id
     AND b.office_id = o.id
     AND o.city_id = ct.id
     AND oi.employee_id IS NULL
     AND costcenter_num IS NOT NULL
     AND comment IS NOT NULL
     AND comment != ''
   ORDER BY ct.id, o.name, f.name, oi.costcenter_num;
  ")
      reservation_query.each do |res|
        costcenter = res['costcenter']
        if as_file
          entry = []
          entry << res['city']
          entry << res['office']
          entry << res['building']
          entry << res['floor']
          entry << costcenter
          entry << @ccs[costcenter.to_i]
          entry << res['addr']
          entry << res['comment']
          values.push(entry)
        else
          values.push({
            'city'            => res['city'],
            'office'          => res['office'],
            'building'        => res['building'],
            'floor'           => res['floor'],
            'costcenter_name' => costcenter,
            'costcenter'      => @ccs[costcenter.to_i],
            'addr'            => res['addr'],
            'comment'         => res['comment']
          })
        end
      end
      if as_file
        row_to_write_to = 1
        values.each do |current_row|
          tso_sheet.write row_to_write_to, 0, current_row[0..3]
          tso_sheet.write row_to_write_to, 4, current_row[4]
          tso_sheet.write row_to_write_to, 5, current_row[5..7]
          row_to_write_to += 1
        end
        reservation.close
        send_file tempfile.path, filename: filename
      else
        render json: values
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  protected

  def set_headers
    response.set_header('Access-Control-Allow-Origin','*')
  end

end