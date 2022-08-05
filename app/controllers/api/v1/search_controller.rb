# implements rights:

module Api
    module V1
    end
end
class Api::V1::SearchController < ApplicationController

  before_action :authenticate_request!

  after_action :set_headers

  def employees
    unless check_right('for_test_user_only')
      query = params[:query].to_s.downcase
      page = params[:page].to_i
      ppp = params[:per_page].to_i

      staff = Employee.where("(LOWER(employees.surname) LIKE :empl OR
                              LOWER(employees.name) LIKE :empl OR
                              LOWER(employees.patronymic) LIKE :empl OR
                              CONCAT(REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE :empl OR
                              CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE :empl OR
                              CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', '')) LIKE :empl OR
                              LOWER(login) LIKE LOWER(:empl) OR
                              LOWER(email) LIKE LOWER(:empl)) AND active = TRUE",
                             { empl: '%' + query + '%' }).limit(ppp).offset(ppp * (page - 1))

      render json: staff
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def all_ds_places
    unless check_right('for_test_user_only')
      query       = params[:query].to_s
      page        = params[:page].to_i
      ppp         = params[:per_page].to_i
      employee_id = params[:employee_id].to_i
      employee    = Employee.find(employee_id)
      oi_for_employee = ObjectItem.joins(:floor => {:building => {:office => :city}})
                                  .select("offices.id as office_id")
                                  .where("object_items.employee_id = #{employee.id}")
      office_id = oi_for_employee.blank? ? nil : oi_for_employee.first['office_id']
      places = Api::V1::BookingsController.new.available_sharing_places(employee, nil, query)
      places += ObjectItem.joins(:floor => {:building => {:office => :city}})
                          .joins("LEFT OUTER JOIN meta_values mv ON mv.meta_field_id = #{Rails.configuration.ds_ready_id}
                                                                AND mv.metable_type = 'ObjectItem'
                                                                AND mv.metable_id = object_items.id
                                  LEFT JOIN meta_values mv2 ON ((mv2.metable_id = object_items.id) AND
                                                                (mv2.metable_type = 'ObjectItem') AND
                                                                (mv2.meta_field_id = #{Rails.configuration.parking_place_id}))")
        .where("status = 'SHARING' AND
                (costcenter_num = ? OR
                 costcenter_num = 2580000 OR
                 (LEFT(costcenter_num::varchar(255), 4) = '2583' AND '2583' = ?) OR
                 (LEFT(costcenter_num::varchar(255), 4) = '3581' AND '3581' = ?)
                )
                #{office_id.blank? ? '' : 'AND offices.id != ' + office_id.to_s}",
                employee.costcenter_num.to_i,
                employee.costcenter_num.to_s[0..3],
                employee.costcenter_num.to_s[0..3])
        .select("
            offices.name                AS office_name,
            offices.id                  AS office_id,
            cities.name                 AS city_name,
            cities.id                   AS city_id,
            floors.id                   AS floor_id,
            floors.name                 AS floor_name,
            buildings.id                AS building_id,
            buildings.name              AS building_name,
            object_items.name           AS name,
            object_items.id             AS id,
            object_items.id             AS place_id,
            object_items.costcenter_num AS costcenter_num,
            (CASE
              WHEN mv.value = 'on'
              THEN true
              ELSE false
             END)                       AS ready,
            mv2.value                   AS parking
        ")
      counter = 0
      result = []
      if page != -1
        places.each do |place|
          if (counter * (page - 1) >=  ppp * (page - 1) && counter * (page - 1) < ppp * (page))
            result.push(place)
          end
          counter += 1
        end
      else
        result = places
      end
      render json: result.uniq { |p| p[:id] }
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def projects
    unless check_right('for_test_user_only')
      query         = params[:query].to_s.downcase
      page          = params[:page].to_i
      ppp           = params[:per_page].to_i
      projects_list = []
      limit         = 0
      offset        = 0

      projects = get_project_data()
      unless projects.blank?
        projects.each do |item|
          string = "#{item["name"]} #{item["id"]}".downcase
          if string.include?(query) && limit <= ppp && offset >= (ppp * (page - 1))
            projects_list.push({
              :id        => item["id"],
              :name      => item["name"],
              :search_id => "#{item["id"]}_project",
              :preview   => item["name"]
            })
            limit += 1
            offset += 1
          elsif string.include?(query)
            offset += 1
          end
        end
      end
      render json: projects_list
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def get_all_costcenters
      costcenters_list = []
      costcenters_json = ask_centra_for :costcenters, attributes: 'number'
      costcenters_json.each do |item|
        costcenters_list.push(item["attributes"]["number"])
      end
      costcenters_list
  end

  def all_costcenters
    unless check_right('for_test_user_only')
      costcenters_list = []
      costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
      costcenters_json.each do |item|
        costcenters_list.push({number: item["attributes"]["number"], name:  item["attributes"]["name"]})
      end
      render json: costcenters_list
    else
      render json: [{name: "Test csts", number: 0000000}]
    end
  end

  def all_projects
    unless check_right('for_test_user_only')
      projects_list = []
      projects = get_project_data()
      unless projects.blank?
        projects.each do |item|
          projects_list.push({
            name: item["name"],
            id:   item["id"]
          })
        end
      end
      render json: projects_list
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def costcenters
    unless check_right('for_test_user_only')
      query            = params[:query].to_s.downcase
      page             = params[:page].to_i
      ppp              = params[:per_page].to_i
      with_text        = params[:with_text].to_s.downcase == "true"
      costcenters_list = []
      limit            = 0
      offset           = 0
      costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
      costcenters_json.each do |item|
        string = "#{item["attributes"]["name"]} #{item["attributes"]["number"]}".downcase
        if string.include?(query) && limit <= ppp && offset >= (ppp * (page - 1))
          if with_text
            costcenters_list.push({
              :id        => item["attributes"]["number"],
              :name      => "#{item["attributes"]["name"]} #{item["attributes"]["number"]}",
              :search_id => "#{item["attributes"]["number"]}_costcenter",
              :preview   => "#{item["attributes"]["number"]} #{item["attributes"]["name"]}"
            })
            limit += 1
          else
            costcenters_list.push(item["attributes"]["number"])
            limit += 1
          end
          offset += 1
        elsif string.include?(query)
          offset += 1
        end
      end
      render json: costcenters_list
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def employees_for_group
    unless check_right('for_test_user_only')
      group_id = params[:group_id]

      employees = Employee.joins('LEFT JOIN roles ON roles.rolable_id = employees.id')
          .where("roles.group_id = (:group_id)",
                 { group_id: group_id}
          )

      render json: employees
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def employees_in_costcenter
    unless check_right('for_test_user_only')
      costcenter_num = params[:costcenter_num]
      head           = head_of_costcenter(costcenter_num)
      employees_info = []
      as_file        = params[:as_file].to_s.downcase == 'true'
      employees      = Employee.joins(:object_items => { :floor => { :building => { :office => :city } } })
        .where("employees.costcenter_num = (:costcenter_num)",
          { costcenter_num: costcenter_num }
        )
        .select("
          employees.id as e_id, employees.surname as e_surname, employees.name as e_name, employees.work_type as work_type,
          employees.patronymic as e_patronymic, employees.status as status, object_items.id as place_id,
          object_items.name as place_name, floors.id as floor_id, floors.name as floor_name,
          buildings.name as building_name, offices.name as office_name, cities.name as city_name,
          buildings.id as building_id, offices.id as office_id, cities.id as city_id,
          object_items.object_type_id as object_type_id
        ")

      employees_all = Employee.where("employees.costcenter_num = (:costcenter_num)", { costcenter_num: costcenter_num})
        .select("
          employees.id as e_id, employees.surname as e_surname, employees.name as e_name, employees.work_type as work_type,
          employees.patronymic as e_patronymic, employees.work_type as work_type, employees.status as status
        ")

      employees.each do |employee|
        item = {}
        item["id"]             = employee.e_id
        item["name"]           = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}"
        item["object_item_id"] = employee.place_id
        item["object_type_id"] = employee.object_type_id
        item["floor_id"]       = employee.floor_id
        item["floor_name"]     = employee.floor_name
        item["building_name"]  = employee.building_name
        item["office_name"]    = employee.office_name
        item["city_name"]      = employee.city_name
        item["building_id"]    = employee.building_id
        item["office_id"]      = employee.office_id
        item["city_id"]        = employee.city_id
        item["work_type"]      = employee.work_type
        item["status"]         = employee.status
        employees_info.push(item)
      end

      employees_all.each do |employee|
        employee_with_no_place = employees_info.detect{ |e| e["id"].to_i == employee['e_id'].to_i}
        if employee_with_no_place.blank?
          item = {}
          item["id"]             = employee.e_id
          item["name"]           = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}"
          item["work_type"]      = employee.work_type
          item["status"]         = employee.status
          item["object_item_id"] = nil
          item["object_type_id"] = nil
          item["floor_id"]       = nil
          employees_info.push(item)
        end
      end

      result_employees = head["costcenter_num"].to_i == costcenter_num.to_i  ? ([head] + employees_info) : (employees_info)

      if as_file
        filename = "employees_in_costcneter_#{costcenter_num}.xls"
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
        heades_sheet = rend.add_worksheet 'Head'
        employees_sheet = rend.add_worksheet 'Employees'
        heades_sheet.autofilter 'A1:E1'
        employees_sheet.autofilter 'A1:E1'
        widths = [35, 35, 20, 20, 35]
        headers = ['Город',
                   'Офис',
                   'Корпус',
                   'Этаж',
                   'ФИО']
        heades_sheet.write_row 0, 0, headers[0..4], format_for_headers
        employees_sheet.write_row 0, 0, headers[0..4], format_for_headers
        (0..4).each do |current_row|
          heades_sheet.set_column current_row, 0, widths[current_row]
          employees_sheet.set_column current_row, 0, widths[current_row]
        end

        rows = []
        row_head = []
        entry = []
        entry << (head['city_name'].blank? ? "" : head['city_name'])
        entry << (head['office_name'].blank? ? "" : head['office_name'])
        entry << (head['building_name'].blank? ? "" : head['building_name'])
        entry << (head['floor_name'].blank? ? "" : head['floor_name'])
        entry << head['name']
        row_head.push(entry)

        result_employees.each do |item|
          entry = []
          entry << (item['city_name'].blank? ? "" : item['city_name'])
          entry << (item['office_name'].blank? ? "" : item['office_name'])
          entry << (item['building_name'].blank? ? "" : item['building_name'])
          entry << (item['floor_name'].blank? ? "" : item['floor_name'])
          entry << item['name']
          rows.push(entry)
        end

        row_to_write_to = 1
        row_head.each do |current_row|
          heades_sheet.write(row_to_write_to, 0, current_row[0..4], format_for_everything_else)
          row_to_write_to += 1
        end
        row_to_write_to = 1
        rows.each do |current_row|
          employees_sheet.write(row_to_write_to, 0, current_row[0..4], format_for_everything_else)
          row_to_write_to += 1
        end
        rend.close
      end

      if (as_file)
        send_file tempfile.path, filename: filename
      else
        render json: { employees: result_employees, head: head }
      end

    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def employees_in_project
    unless check_right('for_test_user_only')
      project_id = params[:project_id]
      project_data = get_project_data(project_id)
      employees = []
      project_heads = []
      as_file = params[:as_file].to_s.downcase == 'true'
      if !project_data.blank?
        unless project_data['employees'].empty?
          project_data['employees'].each do |employee|
            single_employee = Employee.joins(:object_items => { :floor => { :building => { :office => :city } } })
              .where("employees.id = (:employee_id)",
                { employee_id: employee }
              )
              .select("
                employees.id as id, employees.surname as surname, employees.name as name_, employees.work_type as work_type,
                employees.patronymic as patronymic, employees.status as status, object_items.id as place_id, object_items.name as place_name,
                floors.id as floor_id, floors.name as floor_name, buildings.name as building_name, offices.name as office_name,
                cities.name as city_name, object_items.object_type_id as object_type_id, buildings.id as building_id,
                offices.id as office_id, cities.id as city_id, object_items.id as object_item_id
              ").first

            unless single_employee.nil?
              single_employee["name"] = "#{single_employee.surname} #{single_employee.name_} #{single_employee.patronymic}"
              employees.push(single_employee)
            else
              single_employee = Employee.where("employees.id = (:employee_id)",
                  { employee_id: employee }
                )
                .select("
                  employees.id as id, employees.surname as surname, employees.name as name_, employees.work_type as work_type,
                  employees.patronymic as patronymic, employees.id as object_item_id, employees.id as object_type_id, employees.id as floor_id,
                  employees.status as status
                ").first
              unless single_employee.nil?
                single_employee["object_item_id"] = nil
                single_employee["object_type_id"] = nil
                single_employee["floor_id"] = nil
                single_employee["name"] = "#{single_employee.surname} #{single_employee.name_} #{single_employee.patronymic}"
                employees.push(single_employee)
              end
            end
          end
        end

        unless project_data['heads'].empty?
          project_data['heads'].each do |head|
            single_head = Employee.joins(:object_items => { :floor => { :building => { :office => :city } } })
                .where("employees.id = (:employee_id)",
                  { employee_id: head}
                )
                .select("
                  employees.id as id, employees.surname as surname, employees.name as name_, employees.work_type as work_type,
                  employees.patronymic as patronymic, employees.status as status, object_items.id as place_id,
                  object_items.name as place_name, floors.id as floor_id, floors.name as floor_name,
                  buildings.name as building_name, offices.name as office_name, cities.name as city_name,
                  object_items.object_type_id as object_type_id, buildings.id as building_id, offices.id as office_id,
                  cities.id as city_id, object_items.id as object_item_id
                ").first
            unless single_head.nil?
              single_head["name"] = "#{single_head.surname} #{single_head.name_} #{single_head.patronymic}"
              employees.push(single_head)
              project_heads.push(single_head)
            else
              single_head = Employee.where("employees.id = (:employee_id)",
                  { employee_id: head }
                )
                .select("
                  employees.id as id, employees.surname as surname, employees.name as name_, employees.work_type as work_type,
                  employees.patronymic as patronymic, employees.id as object_item_id, employees.id as object_type_id,
                  employees.id as floor_id, employees.status as status
                ").first
              single_head["object_item_id"] = nil
              single_head["object_type_id"] = nil
              single_head["floor_id"]       = nil
              unless single_head.nil?
                single_head["name"] = "#{single_head.surname} #{single_head.name_} #{single_head.patronymic}"
                employees.push(single_head)
                project_heads.push(single_head)
              end
            end
          end
        end
        project_data['employees'] = employees
        project_data['heads'] = project_heads
      else
        project_data = []
        project_data << {'employees': []}
        project_data << {'heads': []}
      end

      if as_file
        filename = "employees_in_project_#{project_data['name']}.xls"
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
        heades_sheet = rend.add_worksheet 'Heads'
        employees_sheet = rend.add_worksheet 'Employees'
        heades_sheet.autofilter 'A1:E1'
        employees_sheet.autofilter 'A1:E1'
        widths = [35, 35, 20, 20, 35]
        headers = ['Город',
                   'Офис',
                   'Корпус',
                   'Этаж',
                   'ФИО']
        heades_sheet.write_row 0, 0, headers[0..4], format_for_headers
        employees_sheet.write_row 0, 0, headers[0..4], format_for_headers
        (0..4).each do |current_row|
          heades_sheet.set_column current_row, 0, widths[current_row]
          employees_sheet.set_column current_row, 0, widths[current_row]
        end

        rows = []
        rows_heads = []
        project_heads.each do |item|
          entry = []
          entry << (item['city_name'].blank? ? "" : item['city_name'])
          entry << (item['office_name'].blank? ? "" : item['office_name'])
          entry << (item['building_name'].blank? ? "" : item['building_name'])
          entry << (item['floor_name'].blank? ? "" : item['floor_name'])
          entry << item['name']
          rows_heads.push(entry)
        end
        employees.each do |item|
          entry = []
          entry << (item['city_name'].blank? ? "" : item['city_name'])
          entry << (item['office_name'].blank? ? "" : item['office_name'])
          entry << (item['building_name'].blank? ? "" : item['building_name'])
          entry << (item['floor_name'].blank? ? "" : item['floor_name'])
          entry << item['name']
          rows.push(entry)
        end

        row_to_write_to = 1
        rows_heads.each do |current_row|
          heades_sheet.write(row_to_write_to, 0, current_row[0..4], format_for_everything_else)
          row_to_write_to += 1
        end
        row_to_write_to = 1
        rows.each do |current_row|
          employees_sheet.write(row_to_write_to, 0, current_row[0..4], format_for_everything_else)
          row_to_write_to += 1
        end
        rend.close
      end

      if (as_file)
        send_file tempfile.path, filename: filename
      else
        render json: project_data
      end
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def head_of_costcenter(costcenter_num)
    costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
    cc_owner_id = nil
    current_cc = costcenters_json.select {|cc| cc["attributes"]["number"] == costcenter_num.to_i }.first
    cc_owner_id = current_cc["relationships"]["owner"]["data"]["id"]
    costcenter_name = current_cc['attributes']['name']

    head = Employee.joins(:object_items => { :floor => { :building => { :office => :city } } })
      .where('employees.id = (?)', cc_owner_id)
      .select("
        employees.id as e_id, employees.surname as e_surname, employees.name as e_name, employees.work_type as work_type,
        employees.patronymic as e_patronymic, object_items.id as place_id, object_items.name as place_name,
        floors.id as floor_id, floors.name as floor_name, buildings.name as building_name, offices.name as office_name,
        cities.name as city_name, object_items.object_type_id as object_type_id,
        employees.costcenter_num as costcenter_num, employees.status as status, offices.id as office_id,
        buildings.id as building_id,  cities.id as city_id
      ").first
    head_info = {}
    unless head.blank?
      head_info["id"]             = head.e_id
      head_info["name"]           = "#{head.e_surname} #{head.e_name} #{head.e_patronymic}"
      head_info["object_item_id"] = head.place_id
      head_info["object_type_id"] = head.object_type_id
      head_info["floor_id"]       = head.floor_id
      head_info["city_id"]        = head.city_id
      head_info["office_id"]      = head.office_id
      head_info["building_id"]    = head.building_id
      head_info["costcenter_num"] = head.costcenter_num
      head_info["costcenter_name"] = costcenter_name
      head_info["floor_name"]     = head.floor_name
      head_info["building_name"]  = head.building_name
      head_info["office_name"]    = head.office_name
      head_info["city_name"]      = head.city_name
      head_info["work_type"]      = head.work_type
      head_info["status"]         = head.status
    else
      head = Employee.where('employees.id = (?)', cc_owner_id)
        .select("
          employees.id as e_id, employees.surname as e_surname, employees.name as e_name, employees.work_type as work_type,
          employees.patronymic as e_patronymic, employees.costcenter_num as costcenter_num, employees.status as status
        ").first
      unless head.blank?
        head_info["id"]             = head.e_id
        head_info["name"]           = "#{head.e_surname} #{head.e_name} #{head.e_patronymic}"
        head_info["object_item_id"] = nil
        head_info["object_type_id"] = nil
        head_info["floor_id"]       = nil
        head_info["city_id"]        = nil
        head_info["office_id"]      = nil
        head_info["building_id"]    = nil
        head_info["costcenter_num"] = head.costcenter_num
        head_info["costcenter_name"] = costcenter_name
        head_info["floor_name"]     = nil
        head_info["building_name"]  = nil
        head_info["office_name"]    = nil
        head_info["city_name"]      = nil
        head_info["work_type"]      = head.work_type
        head_info["status"]         = head.status
      end
    end
    head_info
  end

  def employees_on_place
    unless check_right('for_test_user_only')
      employee_statuses = params[:employee_statuses].split(',')
      query             = params[:query].downcase
      page              = params[:page].to_i
      ppp               = params[:per_page].to_i

      employees_list = Employee.joins(
          :employees_adds,
          :object_items => { :floor => { :building => { :office => :city } } },
          # TODO: add location :object_items => { :floor => { :building => { :office => :city }, :locations => :location_type } }
        ).where("
          (     employees.status IN (?)
            AND employees.active
            AND object_items.object_type_id = ?
            AND (LOWER(employees.surname) LIKE ?
              OR LOWER(employees.name) LIKE ?
              OR LOWER(employees.patronymic) LIKE ?
              OR CONCAT(REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE ?
              OR CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE ?
              OR CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', '')) LIKE ?
              OR LOWER(employees.login) LIKE ?
              OR employees_adds.mobile LIKE ?
            )
          )",
          employee_statuses,
          1, # TODO: change checking of object_type
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%)",
          "%#{query}%"
        ).select("
          employees.id as e_id, employees.surname as e_surname, employees.name as e_name,
          employees.patronymic as e_patronymic, employees.login as login, employees.status as status,
          employees_adds.phone as phone, employees_adds.mobile as mobile, employees.work_type as work_type,
          cities.name as city_name, object_items.id as place_id, object_items.name as place_name,
          floors.name as floor_name, floors.id as floor_id, buildings.id as building_id, offices.id as office_id,
          cities.id as city_id, offices.name as office_name, buildings.name as building_name,
          object_items.object_type_id as object_type_id
        ").limit(ppp).offset(ppp * (page - 1))

      @list_mapped = Array.new

      employees_ds = employees_on_ds_place()

      employees_list.each do |employee|
        employee_booking = employees_ds.detect{|e| e.e_id.to_i == employee.e_id.to_i}
        item = {}
        item["id"]             = employee.e_id
        item["name"]           = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}"
        item["login"]          = employee.login
        item["phone"]          = employee.phone
        item["mobile"]         = employee.mobile
        item["work_type"]      = employee.work_type
        item["object_item_id"] = employee.place_id
        item["object_type_id"] = employee.object_type_id
        item["floor_id"]       = employee.floor_id
        item["building_id"]    = employee.floor_id
        item["office_id"]      = employee.floor_id
        item["city_id"]        = employee.city_id
        item["status"]         = employee.status
        item["search_id"]      = "#{employee.e_id}_empOnPlace"
        if employee_booking
          place = ObjectItem.find(employee_booking.object_item_id)
          item["place_name"]  = place.name
          item["object_item_boooking_id"] = employee_booking.object_item_id
          item["floor_boooking_id"] = place.floor_id
          item["preview"]     = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}, #{employee_booking.book_from.strftime("%d.%m")} - #{employee_booking.book_to.strftime("%d.%m")}"
        else
          item["place_name"]  = employee.place_name
          item["preview"]     = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}"
        end
        unless  employee.mobile.blank?
          item["preview"] += ", " + employee.mobile
        end
        @list_mapped.push(item)
      end

      @list_mapped.sort_by{|k| k["name"]}
      render json: @list_mapped
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def employees_on_ds_place
    employee_statuses = params[:employee_statuses].split(',')
    query             = params[:query].downcase
    page              = params[:page].to_i
    ppp               = params[:per_page].to_i
    Employee.joins(
        :employees_adds,
        :bookings
      ).where("
        (     employees.status IN (?)
          AND employees.active
          AND bookings.book_from::timestamp::date <= now()::timestamp::date
          AND bookings.book_to::timestamp::date >= now()::timestamp::date
          AND (LOWER(employees.surname) LIKE ?
            OR LOWER(employees.name) LIKE ?
            OR LOWER(employees.patronymic) LIKE ?
            OR CONCAT(REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE ?
            OR CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE ?
            OR CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', '')) LIKE ?
            OR LOWER(employees.login) LIKE ?
            OR employees_adds.mobile LIKE ?
          )
        )",
            employee_statuses,
            "%#{query}%",
            "%#{query}%",
            "%#{query}%",
            "%#{query}%",
            "%#{query}%",
            "%#{query}%",
            "%#{query}%)",
            "%#{query}%"
      ).select("
        employees.id as e_id, bookings.object_item_id as object_item_id, bookings.book_from as book_from,
        bookings.book_to as book_to
      ").limit(ppp).offset(ppp * (page - 1))
  end

  def employees_with_no_place
    unless check_right('for_test_user_only')
      employee_statuses = params[:employee_statuses].split(',')
      query             = params[:query].downcase
      page              = params[:page].to_i
      ppp               = params[:per_page].to_i

      employees_list = Employee.joins(:employees_adds)
        .where("
          (    employees.id NOT IN (
                                      SELECT object_items.employee_id
                                        FROM object_items
                                       WHERE object_type_id = ?
                                         AND object_items.employee_id IS NOT NULL
                                    )
            AND employees.status IN (?)
            AND employees.active
            AND (LOWER(employees.surname) LIKE ?
              OR LOWER(employees.name) LIKE ?
              OR LOWER(employees.patronymic) LIKE ?
              OR CONCAT(REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE ?
              OR CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', '')) LIKE ?
              OR CONCAT(REPLACE(LOWER(employees.name), ' ', ''), ' ', REPLACE(LOWER(employees.patronymic), ' ', ''), ' ', REPLACE(LOWER(employees.surname), ' ', '')) LIKE ?
              OR LOWER(employees.login) LIKE ?
              OR employees_adds.mobile LIKE ?
            )
          )",
          1, # TODO: change checking of object_type
          employee_statuses,
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%",
          "%#{query}%)",
          "%#{query}%"
        ).select("
          employees.id as e_id, employees.surname as e_surname, employees.name as e_name,
          employees.patronymic as e_patronymic, employees.login as login, employees.status as status,
          employees_adds.phone as phone, employees_adds.mobile as mobile, employees.work_type as work_type
        ").limit(ppp).offset(ppp * (page - 1))

      @list_mapped = Array.new

      employees_ds = employees_on_ds_place()

      employees_list.each do |employee|
        employee_booking = employees_ds.detect{|e| e.e_id.to_i == employee.e_id.to_i}
        item = {}
        item["id"]          = employee.e_id
        item["name"]        = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}"
        item["login"]       = employee.login
        item["phone"]       = employee.phone
        item["mobile"]      = employee.mobile
        item["work_type"]   = employee.work_type
        item["status"]      = employee.status

        if employee_booking
          place = ObjectItem.find(employee_booking.object_item_id)
          item["object_item_id"] = place.id
          item["floor_id"]  = place.floor_id
          item["search_id"] = "#{employee.e_id}_empOnDSPlace"
          item["preview"]   = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}, #{employee_booking.book_from.strftime("%d.%m")} - #{employee_booking.book_to.strftime("%d.%m")}"
        else
          item["search_id"] = "#{employee.e_id}_empNoPlace"
          item["preview"]   = "#{employee.e_surname} #{employee.e_name} #{employee.e_patronymic}"
        end
        unless  employee.mobile.blank?
          item["preview"] += ", " + employee.mobile
        end
        @list_mapped.push(item)
      end

      @list_mapped.uniq{ |item| item[:id] }.sort_by{ |k| k["name"] }
      render json: @list_mapped
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def rooms_and_locations
    unless check_right('for_test_user_only')
      location_type_ids = params[:location_type_ids]
      query             = params[:query].downcase
      page              = params[:page].to_i
      ppp               = params[:per_page].to_i

      if location_type_ids.to_i == 0
        location_type_ids = []
        LocationType.all.each do |item|
          location_type_ids.push(item[:id])
        end
      else
        location_type_ids = location_type_ids.split(',').map(&:to_i)
      end

      locations_list = Location
        .left_joins(:location_type)
        .left_joins(:floor => { :building => { :office => :city } })
        .where("
           ((LOWER(locations.name) LIKE LOWER(:search)) OR
           (LOWER(locations.description) LIKE LOWER(:search)) OR
           (LOWER(location_types.name) LIKE LOWER(:search))) AND
           location_types.id IN (:location_type_ids)",
          { search: '%' + query +'%', location_type_ids: location_type_ids }
        ).select("
          locations.id as id, locations.name as name, locations.costcenter as costcenter,
          floors.id as floor_id, buildings.id as building_id, offices.id as office_id,
          locations.location_type_id as location_type_id, buildings.name as building_name,
          cities.name as city_name, offices.name as office_name, floors.name as floor_name,
          cities.id as city_id, location_types.name as location_type_name
        ").limit(ppp).offset(ppp * (page - 1)).order('name ASC')

      @list_mapped = Array.new

      locations_list.each do |location|
        item = {}
        item["id"]                 = location.id
        item["name"]               = location.name
        item["costcenter"]         = location.costcenter
        item["floor_id"]           = location.floor_id
        item["building_id"]        = location.building_id
        item["office_id"]          = location.office_id
        item["city_id"]            = location.city_id
        item["location_type_name"] = location.location_type_name
        item["location_type_id"]   = location.location_type_id
        item["search_id"]          = "#{location.id}_location"
        item["preview"]            = "#{location.name}, #{location.city_name}, #{location.office_name}, #{location.building_name}, #{location.floor_name}"
        @list_mapped.push(item)
      end

      @list_mapped.sort_by{|k| k["name"]}

      render json: @list_mapped
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def locations_for_contract
    unless check_right('for_test_user_only')
      query     = params[:query].downcase
      page      = params[:page].to_i
      ppp       = params[:per_page].to_i
      office_id = params[:office_id].to_i

      locations_list = Location.joins(
        :location_type,
        :floor => { :building => { :office => :city } })
        .where("LOWER(locations.name) LIKE LOWER(?)
          AND offices.id = (?)",
          "%#{query}%",
          office_id
        ).select("
          locations.id as id, locations.name as name, locations.costcenter as costcenter,
          floors.id as floor_id, buildings.id as building_id, offices.id as office_id,
          locations.location_type_id as location_type_id, buildings.name as building_name,
          cities.name as city_name, offices.name as office_name, floors.name as floor_name,
          cities.id as city_id, location_types.name as location_type_name,
          (
            SELECT meta_values.value::double precision
              FROM meta_values
             INNER JOIN locations l2 ON l2.id = meta_values.metable_id
                                    AND meta_values.metable_type = 'Location'
                                    AND meta_values.meta_field_id = #{Rails.configuration.square_id}
             WHERE l2.id = locations.id
          ) AS square
        ").limit(ppp).offset(ppp * (page - 1))

      @list_mapped = Array.new

      locations_list.each do |location|
        item = {}
        item["id"]                 = location.id
        item["name"]               = location.name
        item["costcenter"]         = location.costcenter
        item["floor_id"]           = location.floor_id
        item["building_id"]        = location.building_id
        item["office_id"]          = location.office_id
        item["city_id"]            = location.city_id
        item["location_type_name"] = location.location_type_name
        item["location_type_id"]   = location.location_type_id
        item["search_id"]          = "#{location.id}_location"
        # item["preview"]            = "#{location.name}, #{location.city_name}, #{location.office_name}, #{location.building_name}, #{location.floor_name}"
        item["preview"]            = "#{location.name}, #{location.floor_name}"
        item["square"]             = location.square.blank? ? 0.0 : location.square

        @list_mapped.push(item)
      end

      @list_mapped.sort_by{|k| k["name"]}

      render json: @list_mapped
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def objects_and_desks
    unless check_right('for_test_user_only')
      object_type_ids = params[:object_type_ids]
      query           = params[:query].downcase
      page            = params[:page].to_i
      ppp             = params[:per_page].to_i

      if object_type_ids.to_i == 0
        object_type_ids = []
        ObjectType.all.each do |item|
          object_type_ids.push(item[:id])
        end
      else
        object_type_ids = object_type_ids.split(',').map(&:to_i)
      end

      objects_list = ObjectItem.joins(
          :object_type,
          :floor => { :building => { :office => :city } })
        .where("
              (
                 LOWER(object_items.name) LIKE ?
              OR LOWER(object_types.name) LIKE ?
              )
          AND object_items.object_type_id IN (?)",
          "%#{query}%",
          "%#{query}%",
          object_type_ids
        ).select("
          object_items.id as id, object_items.name as name, object_items.comment as comment,
          object_items.costcenter_num as costcenter_num, object_items.employee_id as employee_id,
          object_items.object_type_id as object_type_id, object_items.status as status,
          floors.id as floor_id, buildings.id as building_id, offices.id as office_id,
          cities.id as city_id, buildings.name as building_name, cities.name as city_name,
          offices.name as office_name, floors.name as floor_name, object_types.name as type_name
        ").limit(ppp).offset(ppp * (page - 1))

      @list_mapped = Array.new

      objects_list.each do |object|
        if object.name.blank?
          name = object.type_name
        elsif !object.name.blank? && object.type_name.blank?
          name = object.name
        else
          name = "#{object.name} #{object.type_name}"
        end
        item = {}
        item["id"]             = object.id
        item["object_item_id"] = object.id
        item["name"]           = name
        item["comment"]        = object.comment
        item["costcenter_num"] = object.costcenter_num.blank? ? -1 : object.costcenter_num
        item["employee_id"]    = object.employee_id
        item["object_type_id"] = object.object_type_id
        item["status"]         = object.status.blank? ? "" : object.status
        item["floor_id"]       = object.floor_id
        item["building_id"]    = object.building_id
        item["office_id"]      = object.office_id
        item["city_id"]        = object.city_id
        item["search_id"]      = "#{object.id}_object"
        item["preview"]        = "#{name}, #{object.city_name}, #{object.office_name}, #{object.building_name}, #{object.floor_name}"
        @list_mapped.push(item)
      end

      @list_mapped.sort_by{|k| k["name"]}
      render json: @list_mapped
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def get_project_data(id = nil, hash = false, full_info = false)
    # project_id = nil
    # project_id = id if id.present?
    # uri = URI("tv/projects/#{project_id}")
    # res = nil
    # Net::HTTP.start(uri.host, uri.port,
    #   :use_ssl => uri.scheme == 'https',
    #   :verify_mode => OpenSSL::SSL::VERIFY_NONE) do |http|
    #   request = Net::HTTP::Get.new uri
    #   request['Authorization'] = "Bearer " + TV_TOKEN
    #   request['verify_mode'] = OpenSSL::SSL::VERIFY_NONE
    #   res = http.request request # Net::HTTPResponse object
    # end

    # begin
    #   response = JSON.parse(res.body);
    #   if id.present? || full_info
    #     response
    #   else
    #     # hash - for search on the floor, array - for autocomplete
    #     if hash
    #       projects = {}
    #     else
    #       projects = []
    #     end
    #     response.each do |item|
    #       number = item['id']
    #       name = item['name']
    #       if hash
    #         projects[number] = {'name' => name, 'id' => number, 'type' => 'project'}
    #       else
    #         projects.push({'name' => name, 'id' => number, 'type' => 'project'})
    #       end
    #     end
    #     projects
    #   end
    # rescue
    #   projects
    # end
    Rails.configuration.project_locations
  end

  def get_projects_by_login(login)
    employee = Employee.where('employees.login = (?)', login).select("employees.id as id").first

    projects_data = get_project_data(nil, false, true)
    projects = []

    unless projects_data.blank?
      projects_data.each do |item|
        if item['employees'].include?(employee['id']) || item['heads'].include?(employee['id'])
          name        = item['name']
          number      = item['id'].to_s
          projects.push({'name' => name, 'id' => number})
        end
      end
    end
    projects
  end

  def projects_on_floor(floor_id)
    # floor_id = params[:floor_id]

    object_items = ObjectItem.where('floor_id = (?)',
      floor_id).joins(:employee)
      .select("
          object_items.id as id,
          object_items.employee_id as employee_id
      ").all

    emp_on_floor = []
    object_items.each do |item|
      emp_on_floor.push(item[:employee_id])
    end

    employees_in_projects = []

    projects = get_project_data(nil, false, true)
    unless projects.blank?
      projects.each do |item|
        puts item
        puts "==============="
        unless item['employees'].nil?
          unless (emp_on_floor & item['employees']).empty?
            employees_in_projects.push({
              :project_name => item['name'],
              :project_id => item['id'],
              :employees => emp_on_floor & item['employees']
            })
          end
        end
      end
    end

    employees_in_projects
  end
  
  def locations
    unless check_right('for_test_user_only')
      query = params[:query].to_s
      page = params[:page].to_i
      ppp = params[:per_page].to_i

      staff = Location.left_joins(:location_type).where("
        (LOWER(locations.name) LIKE LOWER(:location) OR
        LOWER(location_types.name) LIKE LOWER(:location))",
        { location: '%' + query +'%' }
      ).select("
        locations.*,
        location_types.name as item_subtype
      ").limit(ppp).offset(ppp * (page - 1))

      render json: staff
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def stats
    query = params[:query].to_s

    emp_count = Employee.where("(LOWER(employees.name) LIKE LOWER(:search)) OR
                                (LOWER(employees.surname) LIKE LOWER(:search)) OR
                                (LOWER(employees.patronymic) LIKE LOWER(:search))", { search: '%' + query +'%' }).to_a.count;

    prj_count = 0
    projects = get_project_data() 
    unless projects.blank?
      projects.each do |item|
        string = "#{item["name"]} #{item["id"]}".downcase
        if string.include?(query)
          prj_count += 1
        end
      end
    end

    cst_count = 0
    costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
    costcenters_json.each do |item|
      string = "#{item["attributes"]["name"]} #{item["attributes"]["number"]}".downcase
      if string.include?(query)
        cst_count += 1
      end
    end

    loc_count = Location.left_joins(:location_type).where("(LOWER(locations.name) LIKE LOWER(:search)) OR
                                (LOWER(locations.description) LIKE LOWER(:search)) OR
                                (LOWER(location_types.name) LIKE LOWER(:search))", { search: '%' + query +'%' }).to_a.count;

    if query.to_i != 0
      obj_count = ObjectItem.left_joins(:object_type).where("(
                                  (LOWER(object_items.name) LIKE LOWER(:search)) OR
                                  (LOWER(object_items.comment) LIKE LOWER(:search)) OR
                                  (object_items.costcenter_num = :search_num) OR
                                  (LOWER(object_types.name) LIKE LOWER(:search))
                                ) AND (object_items.object_type_id != 1)",
                                { search: '%' + query +'%', search_num: query.to_i }).to_a.count;
    else
      obj_count = ObjectItem.left_joins(:object_type).where("(
                                  (LOWER(object_items.name) LIKE LOWER(:search)) OR
                                  (LOWER(object_items.comment) LIKE LOWER(:search)) OR
                                  (LOWER(object_types.name) LIKE LOWER(:search))
                                ) AND (object_items.object_type_id != 1)",
                                { search: '%' + query +'%' }).to_a.count;
    end
    
    if query.to_i != 0
      dsk_count = ObjectItem.where("(
                                  (LOWER(object_items.name) LIKE LOWER(:search)) OR
                                  (LOWER(object_items.comment) LIKE LOWER(:search)) OR
                                  (object_items.costcenter_num = :search_num)
                                ) AND (object_items.object_type_id = 1)",
                                { search: '%' + query +'%', search_num: query.to_i }).to_a.count;
    else
      dsk_count = ObjectItem.where("(
                                  (LOWER(object_items.name) LIKE LOWER(:search)) OR
                                  (LOWER(object_items.comment) LIKE LOWER(:search))
                                ) AND (object_items.object_type_id = 1)",
                                { search: '%' + query +'%' }).to_a.count;
    end

    render json: {
      emp_count: emp_count,
      loc_count: loc_count,
      obj_count: obj_count,
      dsk_count: dsk_count,
      cst_count: cst_count,
      prj_count: prj_count
    }
  end

  def results
    unless check_right('for_test_user_only')
      search_type = params[:target]
      query = params[:query].to_s
      # page = params[:page].to_i
      # ppp = params[:per_page].to_i

      if search_type == "employees"
        results = Employee.select("
            employees.id AS id,
            CONCAT(employees.name, ' ', employees.surname, ' ', employees.patronymic) AS name
        ").where("
            (LOWER(employees.name) LIKE LOWER(:search)) OR
            (LOWER(employees.surname) LIKE LOWER(:search)) OR
            (LOWER(employees.patronymic) LIKE LOWER(:search))", { search: '%' + query +'%' }).to_a;
      end

      if search_type == "locations"
        location_type_ids = []
        LocationType.all.each do |item|
          location_type_ids.push(item[:id])
        end
        results = Location.select("
            locations.id AS id,
            CONCAT(locations.name, ' (', location_types.name, ')', ', ', floors.name) AS name,
            floors.id AS floor_id
        ").left_joins(:location_type).left_joins(:floor).where("
           ((LOWER(locations.name) LIKE LOWER(:search)) OR
           (LOWER(locations.description) LIKE LOWER(:search)) OR
           (LOWER(location_types.name) LIKE LOWER(:search))) AND
           location_types.id IN (:location_type_ids)",
           { search: '%' + query +'%', location_type_ids: location_type_ids }).order('name ASC').to_a
      end

      if search_type == "objects"
        if query.to_i != 0
          results = ObjectItem.select("
              object_items.id AS id,
              CONCAT(object_items.name, ' (', object_types.name, ')', ', ', floors.name) AS name,
              floors.id AS floor_id
            ").left_joins(:object_type).left_joins(:floor).where("(
              (LOWER(object_items.name) LIKE LOWER(:search)) OR
              (LOWER(object_items.comment) LIKE LOWER(:search)) OR
              (object_items.costcenter_num = :search_num) OR
              (LOWER(object_types.name) LIKE LOWER(:search)))
              AND (object_items.object_type_id != 1)",
              { search: '%' + query +'%', search_num: query.to_i }).to_a;
        else
          results = ObjectItem.select("
              object_items.id AS id,
              CONCAT(object_items.name, ' (', object_types.name, ')', ', ', floors.name) AS name,
              floors.id AS floor_id
            ").left_joins(:object_type).left_joins(:floor).where("(
              (LOWER(object_items.name) LIKE LOWER(:search)) OR
              (LOWER(object_items.comment) LIKE LOWER(:search)) OR
              (LOWER(object_types.name) LIKE LOWER(:search)))
              AND (object_items.object_type_id != 1)",
              { search: '%' + query +'%' }).to_a;
        end
      end

      if search_type == "desks"
        if query.to_i != 0
          results = ObjectItem.select("
                object_items.id AS id,
                CONCAT(object_items.name, ' (', object_items.status, ')', ', ', floors.name) AS name,
                floors.id AS floor_id
            ").left_joins(:floor).where("(
                (LOWER(object_items.name) LIKE LOWER(:search)) OR
                (LOWER(object_items.comment) LIKE LOWER(:search)) OR
                (object_items.costcenter_num = :search_num)
                ) AND (object_items.object_type_id = 1)",
                { search: '%' + query +'%', search_num: query.to_i }).to_a;
        else
          results = ObjectItem.select("
                object_items.id AS id,
                CONCAT(object_items.name, ' (', object_items.status, ')', ', ', floors.name) AS name,
                floors.id AS floor_id
            ").left_joins(:floor).where("(
                (LOWER(object_items.name) LIKE LOWER(:search)) OR
                (LOWER(object_items.comment) LIKE LOWER(:search))
                ) AND (object_items.object_type_id = 1)",
                { search: '%' + query +'%'}).to_a;
        end

      end

      if search_type == "projects"
        results = []
        projects = get_project_data()
        unless projects.blank?
          projects.each do |item|
            string = "#{item["name"]} #{item["id"]}".downcase
            if string.include?(query)
              results.push({
                :id   => item["id"],
                :name => item["name"],
              })
            end
          end
        end
      end

      if search_type == "costcenters"
        results = []
        costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
        costcenters_json.each do |item|
          string = "#{item["attributes"]["name"]} #{item["attributes"]["number"]}".downcase
          if string.include?(query)
            results.push({
              :id   => item["attributes"]["number"],
              :name => "#{item["attributes"]["name"]} #{item["attributes"]["number"]}",
            })
          end
        end
      end

      render json: {
        query: query,
        search_type: search_type,
        results: results
      }
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def employees_all_info
    unless check_right('for_test_user_only')
      if check_right('view_employees')
        statuses     = params[:statuses] ? params[:statuses].split(",").map{|e| e = "'#{e}'"}.join(', ') : "'REGULAR'"
        as_file      = params[:as_file].to_s.downcase == "true"
        sort_field   = params[:sorting].blank? ? '' : params[:sorting][:field]
        sort_order   = params[:sorting].blank? ? '' : params[:sorting][:order]
        filters      = params[:filters].blank? ? [] : params[:filters]
        page         = params[:page].to_i
        ppp          = params[:per_page].to_i
        query_filter = ""
        query_sort   = ""

        if !sort_order.blank? && !sort_field.blank?
          query_sort = case sort_field
             when "group_name"
               "groups.name #{sort_order}"
             else
               "#{sort_field} #{sort_order}"
             end
        end

        filters.each_with_index do |filter, index|
          column = case filter["field"]
             when "group_name"
               " LOWER(groups.name) LIKE '%#{filter["value"].to_s.downcase}%' "
             when "surname_name"
               " LOWER(employees.surname) LIKE '%#{filter["value"].to_s.downcase}%' OR LOWER(employees.name) LIKE '%#{filter["value"].to_s.downcase}%' "
             when "city_id"
               f_values = filter["value"].to_s.split(',')
               if f_values.length > 1
                 str = "("
                 f_values.each_with_index do |f_value, i|
                   query = f_value == '-1' ? "cities.id IS NULL" : "cities.id = #{f_value}"
                   str += (i.to_i < (f_values.length - 1)) ? " #{query} OR " : " #{query} "
                 end
                 str + ")"
               else
                 filter["value"] == '-1' ? " cities.id IS NULL " : " cities.id = #{filter["value"]} "
               end
             when "costcenter_num"
               f_values = filter["value"].to_s.split(',')
               if f_values.length > 1
                 str = "("
                 f_values.each_with_index do |f_value, i|
                   query = f_value == '-1' ? "employees.costcenter_num IS NOT NULL" : "employees.costcenter_num = #{f_value}"
                   str += (i.to_i < (f_values.length - 1)) ? " #{query} OR " : " #{query} "
                 end
                 str + ")"
               else
                 filter["value"] == '-1' ? " employees.costcenter_num IS NOT NULL " : " employees.costcenter_num = #{filter["value"]} "
               end
             when "work_type"
               f_values = filter["value"].to_s.split(',')
               if f_values.length > 1
                 str = "("
                 f_values.each_with_index do |f_value, i|
                   query = f_value == '-' ? "work_type IS NULL" : "work_type LIKE '%#{f_value}%'"
                   str += (i.to_i < (f_values.length - 1)) ? " #{query} OR " : " #{query} "
                 end
                 str + ")"
               else
                 filter["value"] == '-' ? " work_type IS NULL " : " work_type LIKE '%#{filter["value"]}%' "
               end
             else
               " #{filter["field"]} LIKE '%#{filter["value"]}%' "
             end
          if index < (filters.length - 1) && filters.length > 1
            query_filter += column + " AND "
          elsif index == filters.length - 1
            query_filter += column
          end
        end
        if filters.length > 0
          query_filter += " AND employees.status IN (#{statuses}) "
        else
          query_filter = " employees.status IN (#{statuses}) "
        end

        select_sql = "
          employees.id             AS id,
          employees.costcenter_num AS costcenter_number,
          employees.email          AS email,
          employees.login          AS login,
          employees.work_type      AS work_type,
          employees.status         AS status,
          CONCAT(employees.surname, ' ', employees.name) AS surname,
          CONCAT(employees.surname, ' ', employees.name, '', employees.patronymic) AS fio,
          groups.name              AS group_name,
          object_items.id          AS place_id,
          object_items.name        AS place_name,
          object_items.comment     AS comment,
          cities.name              AS city_name,
          buildings.name           AS building_name,
          floors.name              AS floor_name,
          cities.name              AS city_id,
          floors.id                AS floor_id
        "
        # only_no_place = params[:only_no_place].to_s.downcase == "true" ? " employees.status IN (#{statuses}) AND employees.active = TRUE AND object_items.id IS NULL " : " employees.status IN (#{statuses}) AND employees.active = TRUE "

        if page === 0 && ppp === 0
          staff = Employee.joins(
            "LEFT JOIN roles ON roles.rolable_id = employees.id AND roles.rolable_type = 'Employee'",
            "LEFT JOIN groups ON groups.id = roles.group_id",
            "LEFT JOIN object_items ON object_items.employee_id = employees.id",
            "LEFT JOIN floors ON floors.id = object_items.floor_id",
            "LEFT JOIN buildings ON buildings.id = floors.building_id",
            "LEFT JOIN offices ON offices.id = buildings.office_id",
            "LEFT JOIN cities ON cities.id = offices.city_id")
            .select(select_sql)
            .where(query_filter)
          count = staff.to_a.count
        else
          count = Employee.joins(
            "LEFT JOIN roles ON roles.rolable_id = employees.id AND roles.rolable_type = 'Employee'",
            "LEFT JOIN groups ON groups.id = roles.group_id",
            "LEFT JOIN object_items ON object_items.employee_id = employees.id",
            "LEFT JOIN floors ON floors.id = object_items.floor_id",
            "LEFT JOIN buildings ON buildings.id = floors.building_id",
            "LEFT JOIN offices ON offices.id = buildings.office_id",
            "LEFT JOIN cities ON cities.id = offices.city_id")
            .select(select_sql)
            .where(query_filter).to_a.count
          if sort_field && sort_order
            staff = Employee.joins(
              "LEFT JOIN roles ON roles.rolable_id = employees.id AND roles.rolable_type = 'Employee'",
              "LEFT JOIN groups ON groups.id = roles.group_id",
              "LEFT JOIN object_items ON object_items.employee_id = employees.id",
              "LEFT JOIN floors ON floors.id = object_items.floor_id",
              "LEFT JOIN buildings ON buildings.id = floors.building_id",
              "LEFT JOIN offices ON offices.id = buildings.office_id",
              "LEFT JOIN cities ON cities.id = offices.city_id")
              .select(select_sql)
              .where(query_filter)
              .order(query_sort)
              .limit(ppp)
              .offset(ppp * (page - 1))
          else
            staff = Employee.joins(
              "LEFT JOIN roles ON roles.rolable_id = employees.id AND roles.rolable_type = 'Employee'",
              "LEFT JOIN groups ON groups.id = roles.group_id",
              "LEFT JOIN object_items ON object_items.employee_id = employees.id",
              "LEFT JOIN floors ON floors.id = object_items.floor_id",
              "LEFT JOIN buildings ON buildings.id = floors.building_id",
              "LEFT JOIN offices ON offices.id = buildings.office_id",
              "LEFT JOIN cities ON cities.id = offices.city_id")
              .select(select_sql)
              .where(query_filter)
              .limit(ppp)
              .offset(ppp * (page - 1))
          end
        end
        #places = get_places_info

        costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'

        staff = staff.map{|e|
          buf = e
          current_cc = costcenters_json.select {|cc| cc["attributes"]["number"] == buf[:costcenter_number].to_i }.first
          cc_owner_full_name = current_cc["relationships"]["owner"]["data"]["full-name"]
          buf = {
            id:                buf[:id],
            costcenter_number: buf[:costcenter_number],
            head:              cc_owner_full_name,
            work_type:         buf[:work_type],
            status:            buf[:status],
            login:             buf[:login],
            email:             buf[:email],
            surname:           buf[:surname],
            fio:               buf[:fio],
            group_name:        buf[:group_name].blank? ? "Anonymous" : buf[:group_name],
            comment:           buf[:comment],
            city_name:         buf[:city_name],
            building_name:     buf[:building_name],
            city_name:         buf[:city_name],
            floor_id:          buf[:floor_id],
            place_name:        buf[:place_name],
            floor_name:        buf[:floor_name],
            place_id:          buf[:place_id]
          }
          buf
        }

        if as_file
          filename = "employees.xls"
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
          main_sheet = rend.add_worksheet 'employees'
          main_sheet.autofilter 'A1:H1'
          widths = [35, 15, 20, 20, 20, 20]
          headers = ['ФИО',
                     'Режим',
                     'Место',
                     'Локация',
                     'Компания',
                     'МВЗ']
          main_sheet.write_row 0, 0, headers[0..5], format_for_headers
          (0..5).each do |current_row|
            main_sheet.set_column current_row, 0, widths[current_row]
          end

          rows = []
          staff.each do |item|
            location = item[:city_name].blank? ? "" : "#{item[:city_name]}, #{item[:building_name]}, #{item[:floor_name]}"
            entry = []
            entry << item[:fio]
            entry << item[:work_type]
            entry << item[:place_name]
            entry << location
            entry << ''
            entry << item[:costcenter_number]
            rows.push(entry)
          end

          row_to_write_to = 1
          rows.each do |current_row|
            main_sheet.write(row_to_write_to, 0, current_row[0..5], format_for_everything_else)
            row_to_write_to += 1
          end
          rend.close
        end

        if as_file
          send_file tempfile.path, filename: filename
        else
          render json: {
            staff: staff,
            count: count
          }
        end
      else
          render json: {
            message: "Access denied!"
          }, status: :unauthorized
      end
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def get_places_info
    places_with_employees = ObjectItem.joins(:employee, :floor => {:building => {:office => :city}})
      .joins('LEFT OUTER JOIN locations ON locations.id = object_items.location_id')
      .select("
          object_items.angle          AS angle,
          object_items.top            AS top,
          object_items.left           AS left,
          object_items.width          AS width,
          object_items.height         AS height,
          object_items.scale          AS scale,
          object_items.employee_id    AS emp_id,
          object_items.name           AS place_name,
          object_items.status         AS status,
          employees.costcenter_num    AS costcenter_number,
          object_items.comment        AS comment,
          object_items.id             AS place_id,
          cities.name                 AS city_name,
          offices.name                AS office_name,
          buildings.name              AS building_name,
          floors.name                 AS floor_name,
          floors.id                   AS floor_id,
          locations.name              AS location_name,
          locations.id                AS location_id,
          employees.name              AS name,
          employees.surname           AS surname,
          employees.patronymic        AS patronymic,
          employees.email             AS email
      ").where("
        object_items.object_type_id = 1
      ")

    places_without_employees = ObjectItem.joins(:floor => {:building => {:office => :city}})
     .joins('LEFT OUTER JOIN locations ON locations.id = object_items.location_id')
     .select("
          object_items.angle          AS angle,
          object_items.top            AS top,
          object_items.left           AS left,
          object_items.width          AS width,
          object_items.height         AS height,
          object_items.scale          AS scale,
          object_items.employee_id    AS emp_id,
          object_items.name           AS place_name,
          object_items.id             AS place_id,
          object_items.status         AS status,
          object_items.costcenter_num AS costcenter_number,
          cities.name                 AS city_name,
          offices.name                AS office_name,
          buildings.name              AS building_name,
          floors.name                 AS floor_name,
          locations.name              AS location_name,
          locations.id                AS location_id
      ").where("
        object_items.employee_id IS NULL AND
        object_items.object_type_id = 1
      ")
    (places_with_employees + places_without_employees)
  end

  def places_info
    unless check_right('for_test_user_only')
      render json: get_places_info
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def employees_all
    unless check_right('for_test_user_only')
      statuses = params[:statuses] ? params[:statuses].split(",").map{|e| e = "'#{e}'"}.join(', ') : "'REGULAR'"
      staff = Employee.select("
        employees.id             AS id,
        employees.costcenter_num AS costcenter_number,
        employees.email          AS email,
        employees.name           AS name,
        employees.surname        AS surname,
        employees.patronymic     AS patronymic,
        employees.status         AS status
      ").where("
        employees.status IN (#{statuses}) AND
        employees.active = TRUE
      ")
      render json: staff
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def inventory_all
    unless check_right('for_test_user_only')
      if check_right('view_inventory')
        as_file      = params[:as_file].to_s.downcase == "true"
        sort_field   = params[:sorting].blank? ? '' : params[:sorting][:field]
        sort_order   = params[:sorting].blank? ? '' : params[:sorting][:order]
        filters      = params[:filters].blank? ? [] : params[:filters]
        meta_sort    = params[:meta_sort].to_s.downcase == "true" # sorting by specific meta column
        page         = params[:page].to_i
        ppp          = params[:per_page].to_i
        query_filter = ""
        result       = []

        filters.each_with_index do |filter, index|
          meta_filter = filter["field"].split('-')
          if meta_filter.length > 1
            query = " \"meta_values\".value LIKE '%#{filter["value"]}%' "
          else
            if filter["field"] == 'name'
              query = " object_items.name LIKE '%#{filter["value"]}%' "
            elsif filter["field"] == 'desk_status'
              values = filter["value"].split(',').select {|f| f != 'SHARING'}
              query = !values.blank? ? " object_items.status IN (#{values.map { |i| "'" + i.to_s + "'" }.join(",")}) " : " object_items.status = '' "
              filter["value"].split(',').each do |i|
                query = case i
                when 'SHARING'
                  "( #{query} OR (object_items.status = 'SHARING' AND meta_values.metable_id = object_items.id) AND (meta_values.metable_type = 'ObjectItem') AND (meta_values.meta_field_id = #{Rails.configuration.ds_ready_id} AND meta_values.value = 'off' OR meta_values.id IS NULL) ) "
                when 'SHARING_READY'
                  "( #{query} OR (object_items.status = 'SHARING' AND meta_values.metable_id = object_items.id) AND (meta_values.metable_type = 'ObjectItem') AND (meta_values.meta_field_id = #{Rails.configuration.ds_ready_id} AND meta_values.value = 'on') ) "
                when 'NOT_ACTIVE_0'
                  "( #{query} OR (meta_values.metable_id = object_items.id) AND (meta_values.metable_type = 'ObjectItem') AND (meta_values.meta_field_id = #{Rails.configuration.notactive_desk_id} AND meta_values.value = '0') ) "
                when 'NOT_ACTIVE_1'
                  "( #{query} OR (meta_values.metable_id = object_items.id) AND (meta_values.metable_type = 'ObjectItem') AND (meta_values.meta_field_id = #{Rails.configuration.notactive_desk_id} AND meta_values.value = '1') ) "
                when  'NOT_ACTIVE_2'
                  "( #{query} OR (meta_values.metable_id = object_items.id) AND (meta_values.metable_type = 'ObjectItem') AND (meta_values.meta_field_id = #{Rails.configuration.notactive_desk_id} AND meta_values.value = '2') ) "
                when  'NOT_ACTIVE_3'
                  "( #{query} OR (meta_values.metable_id = object_items.id) AND (meta_values.metable_type = 'ObjectItem') AND (meta_values.meta_field_id = #{Rails.configuration.notactive_desk_id} AND meta_values.value = '3') ) "
                when  'null'
                  "( #{query} OR object_items.status IS NULL)"
                else
                  query
                end
              end
            elsif filter["field"] == 'location_name'
              query = " LOWER(locations.name) LIKE LOWER('%#{filter["value"]}%') "
            elsif filter["field"] == 'floor_id'
              query = " floors.id IN (#{filter["value"].split(',').map { |i| "'" + i.to_s + "'" }.join(",")}) "
            else
              query = " #{filter["field"]} LIKE '%#{filter["value"]}%' "
            end
          end
          if index < (filters.length - 1) && filters.length > 1 && !query.blank?
            query_filter += query + " AND "
          elsif index == filters.length - 1
            query_filter += query
          end
        end
        query_filter = query_filter.length > 0 ? "#{query_filter} AND object_items.object_type_id = 1" : " object_items.object_type_id = 1 AND \"object_items\".\"name\" LIKE '%%' "
        select_sql = "
          object_items.*,
          cities.name AS city_name,
          buildings.name AS building_name,
          offices.name AS office_name,
          floors.name AS floor_name,
          locations.name AS location_name
        "

        if page === 0 && ppp === 0 # load all stuff without pagination
          if sort_field && sort_order && meta_sort
            sort_info = sort_field.split('-')
            if sort_info.length > 1
              object_items = ObjectItem.left_joins(:object_type)
                 .left_joins(:floor => {:building => {:office => :city}})
                 .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
                 .select(select_sql).where(
                    "#{query_filter} AND
                      (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                      (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                    sort_info[1],
                    sort_info[0].to_i)
                 .distinct
                 .order("meta_values.value #{sort_order}")
            else
              object_items = ObjectItem.left_joins(:object_type)
                 .left_joins(:floor => {:building => {:office => :city}})
                 .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
                 .select(select_sql)
                 .distinct
                 .where(query_filter)
                 .order("#{sort_field} #{sort_order}")
            end
          elsif sort_field && sort_order
            object_items = ObjectItem.left_joins(:object_type)
               .left_joins(:floor => {:building => {:office => :city}})
               .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
               .select(select_sql)
               .distinct
               .where(query_filter)
               .order("#{sort_field} #{sort_order}")
          else
            object_items = ObjectItem.left_joins(:object_type)
               .left_joins(:floor => {:building => {:office => :city}})
               .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
               .select(select_sql)
               .distinct
               .where(query_filter)
          end
        else
          if sort_field && sort_order && meta_sort
            sort_info = sort_field.split('-')
            if sort_info.length > 1
              count = ObjectItem.left_joins(:object_type)
                .left_joins(:floor => {:building => {:office => :city}})
                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
                .select(select_sql).where("
                  #{query_filter} AND
                  (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                  (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                  sort_info[1],
                  sort_info[0].to_i)
                .distinct
                .to_a.count
              object_items = ObjectItem.left_joins(:object_type)
                .left_joins(:floor => {:building => {:office => :city}})
                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
                .select(select_sql).where(
                  "#{query_filter} AND
                  (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                  (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                  sort_info[1],
                  sort_info[0].to_i)
                .distinct
                .order("meta_values.value #{sort_order}").limit(ppp).offset(ppp * (page - 1))
            else
              count = ObjectItem.left_joins(:object_type)
                .left_joins(:floor => {:building => {:office => :city}})
                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
                .select(select_sql)
                .where(query_filter).distinct.to_a.count
              object_items = ObjectItem.left_joins(:object_type)
                .left_joins(:floor => {:building => {:office => :city}})
                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
                .select(select_sql)
                .where(query_filter)
                .order("#{sort_field} #{sort_order}").distinct.limit(ppp).offset(ppp * (page - 1))
            end
          elsif sort_field && sort_order
            count = ObjectItem.left_joins(:object_type)
              .left_joins(:floor => {:building => {:office => :city}})
              .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
              .select(select_sql)
              .where(query_filter).distinct.to_a.count
            object_items = ObjectItem.left_joins(:object_type)
              .left_joins(:floor => {:building => {:office => :city}})
              .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
              .select(select_sql)
              .where(query_filter)
              .order("#{sort_field} #{sort_order}").distinct.limit(ppp).offset(ppp * (page - 1))
          else
            count = ObjectItem.left_joins(:object_type)
              .left_joins(:floor => {:building => {:office => :city}})
              .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
              .select(select_sql)
              .where(query_filter).distinct.to_a.count
            object_items = ObjectItem.left_joins(:object_type)
              .left_joins(:floor => {:building => {:office => :city}})
              .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id
                       LEFT OUTER JOIN meta_values ON meta_values.metable_id = object_items.id")
              .select(select_sql)
              .where(query_filter)
              .distinct.limit(ppp).offset(ppp * (page - 1))
          end
        end
        object_items.each do | object_item|
          result.push(Api::V1::ObjectItemsController.new.add_meta_to_object_item(object_item, true, false, true))
        end

        if as_file
          filename = "inventory.xls"
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
          main_sheet.autofilter 'A1:L1'
          widths = [35, 20, 20, 20, 20, 15, 20, 15, 20, 20, 20, 20]
          headers = ['Город',
           'Бизнес-центр',
           'Корпус',
           'Этаж',
           'Помещение',
           'Место',
           'Статус',
           'Инв.№ стола',
           'Инв.№ тумбы',
           'Инв.№ докстанции',
           'Инв.№ монитор 1',
           'Инв.№ монитор 2']
          main_sheet.write_row 0, 0, headers[0..11], format_for_headers
          (0..11).each do |current_row|
            main_sheet.set_column current_row, 0, widths[current_row]
          end

          rows = []
          result.each do |item|
            entry = []
            entry << item["city_name"]
            entry << item["office_name"]
            entry << item["building_name"]
            entry << item["floor_name"]
            entry << item["location_name"]
            entry << item["name"]
            ready_field = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.ds_ready_id}
            notactive_options = [
              { id: 0, name: "Небезопасное место" },
              { id: 1, name: "Передано на склад" },
              { id: 2, name: "Передано сотруднику" },
              { id: 3, name: "В утиль" }
            ]
            not_active_field = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.notactive_desk_id}
            not_active_label = nil
            not_active_label = !not_active_field.blank? && !not_active_field[0]["metavalue"].blank? ? notactive_options.select{|no| no[:id].to_i == not_active_field[0]["metavalue"].to_i} : ''

            entry << (
              if item["status"].blank?
                ''
              else
                item["status"] + (
                  if !not_active_field.blank? && !not_active_label.blank? && !not_active_label[0].blank? && item["status"] == 'NOT_ACTIVE'
                    ' ' + not_active_label[0][:name]
                  else
                    if !ready_field.blank? && !ready_field[0]["metavalue"].blank? && item["status"] == 'SHARING'
                      ' ' + (ready_field[0]["metavalue"] == 'on' ? 'Готово' : 'Не готово')
                    else
                      ''
                    end
                  end)
              end)
            desknum = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.desknum_id}
            entry << ((desknum.length > 0) ? desknum[0]["metavalue"] : '')
            tymbnum = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.tymbnum_id}
            entry << ((tymbnum.length > 0) ? tymbnum[0]["metavalue"] : '')
            docstation = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.docstation_id}
            entry << ((docstation.length > 0) ? docstation[0]["metavalue"] : '')
            monitor1 = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.monitor1_id}
            entry << ((monitor1.length > 0) ? monitor1[0]["metavalue"] : '')
            monitor2 = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.monitor2_id}
            entry << ((monitor2.length > 0) ? monitor2[0]["metavalue"] : '')
            rows.push(entry)
          end

          row_to_write_to = 1
          rows.each do |current_row|
            main_sheet.write(row_to_write_to, 0, current_row[0..11], format_for_everything_else)
            row_to_write_to += 1
          end
          rend.close
        end

        if as_file
          send_file tempfile.path, filename: filename
        else
          render json: { items: result, count: count }
        end
      else
        render json: {
          message: "Access denied!"
        }, status: :unauthorized
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