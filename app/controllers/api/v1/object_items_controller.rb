# implements rights: view_object_items, view_object_item, update_object_item, create_object_item, delete_object_item, 

module Api
    module V1
    end
end
class Api::V1::ObjectItemsController < ApplicationController

    before_action :authenticate_request!
    before_action :load_current_user!

    after_action :set_headers

    SELECT_SQL = "
        object_items.*,
        object_types.name as item_subtype,
        floors.name       as floor_name,
        buildings.name    as building_name,
        offices.name      as office_name,
        locations.name    as location_name"

    # get objects with meta data and sorging by meta
    def index
        if check_right('view_object_items') && !check_right('for_test_user_only')
            as_file      = params[:as_file].to_s.downcase == "true"
            page         = params[:page].to_i
            ppp          = params[:per_page].to_i
            type_id      = params[:type_id].to_i # -1 means that need all types
            sort_field   = params[:sort_field]
            sort_order   = params[:sort_order]
            meta_sort    = params[:meta_sort].to_s.downcase == "true" # sorting by specific meta column
            filters      = JSON.parse(params[:filters])
            object_items = []
            result       = []
            query_filter = ""
            aliases_for_meta_values = []

            filters_add_cloumn = filters
            filters = filters.select{|f| !f["value"].blank?}

            filters.each_with_index do |filter, index|
                query = ""
                meta_filter = filter["field"].split('-')
                if meta_filter.length > 1
                    values = filter["value"].blank? ? [] : filter["value"].split(',')
                    aliases_for_meta_values.push("meta_value_#{index}")
                    if values.size > 0 && meta_filter[0] != '10'
                        query = "\"meta_value_#{index}\".value IN (" + values.map { |i| "'" + i.to_s + "'" }.join(",") + ") AND \"meta_value_#{index}\".meta_field_id = " + meta_filter[0]
                        query = " (#{query}) "
                    elsif values.size > 0 && meta_filter[0] == '10'
                        query = " \"meta_value_#{index}\".value LIKE '%#{filter["value"]}%' AND \"meta_value_#{index}\".meta_field_id = " + meta_filter[0]
                    else
                        query = " \"meta_value_#{index}\".value LIKE '#{filter["value"]}' AND \"meta_value_#{index}\".meta_field_id = " + meta_filter[0]
                    end
                else
                    if filter["field"] == 'floor_id'
                        query = " floors.id IN (#{filter["value"].split(',').map { |i| "'" + i.to_s + "'" }.join(",")}) "
                    elsif filter["field"] == 'object_type_id'
                        # query = " object_items.object_type_id IN (#{filter["value"].map { |i| "'" + i.to_s + "'" }.join(",")}) "
                    elsif filter["field"] == 'location_name'
                        query = " LOWER(locations.name) LIKE LOWER('%#{filter["value"]}%') "
                    else
                        column = filter["field"] == 'item_subtype' ? 'object_types.name' : filter["field"] == 'floor_name' ? 'floors.name' : filter["field"] == 'name' ? 'object_items.name' : filter["field"] == 'building_name' ? 'buildings.name' : filter["field"]
                        query = " #{column} LIKE '%#{filter["value"]}%' "
                    end
                end

                if index < (filters.length - 1) && filters.length > 1 && !query.blank?
                    query_filter += query + " AND "
                elsif index == filters.length - 1 && !query.blank?
                    query_filter += query
                end
            end
            query_filter = query_filter.length > 0 ? query_filter + " AND floors.active = TRUE " : " \"object_items\".\"name\" LIKE '%%' AND floors.active = TRUE "
            if page === 0 && ppp === 0 # load all stuff without pagination
                if type_id == -1
                    if sort_field && sort_order
                        object_items =  ObjectItem.left_joins(:floor => {:building => :office})
                          .left_joins(:object_type)
                          .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                 aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                          .select(SELECT_SQL)
                          .where(query_filter)
                          .distinct
                        .order("#{sort_field} #{sort_order}")
                    else
                        object_items =  ObjectItem.left_joins(:floor => {:building => :office})
                          .left_joins(:object_type)
                          .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                 aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                          .select(SELECT_SQL)
                          .distinct
                          .where(query_filter)
                    end
                else
                    if sort_field && sort_order && meta_sort
                        sort_info = sort_field.split('-')
                        if sort_info.length > 1
                            object_items = ObjectItem.left_joins(:floor => {:building => :office})
                             .left_joins(:object_type)
                             .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                    aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                             .select(SELECT_SQL)
                             .distinct
                             .where("
                                #{query_filter} AND
                                object_items.object_type_id = ? AND
                                (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                                (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                                type_id,
                                sort_info[1],
                                sort_info[0].to_i)
                             .order("meta_values.value #{sort_order}")
                        else
                            object_items = ObjectItem.left_joins(:floor => {:building => :office})
                             .left_joins(:object_type)
                             .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                    aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                             .select(SELECT_SQL)
                             .distinct
                             .where("
                                    #{query_filter} AND object_items.object_type_id = ?",
                                    type_id)
                             .order("#{sort_field} #{sort_order}")
                        end
                    elsif sort_field && sort_order
                          object_items = ObjectItem.left_joins(:floor => {:building => :office})
                             .left_joins(:object_type)
                             .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                    aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                             .select(SELECT_SQL)
                             .distinct
                             .where("#{query_filter} AND object_items.object_type_id = ?", type_id)
                             .order("#{sort_field} #{sort_order}")
                    else
                        object_items = ObjectItem.left_joins(:floor => {:building => :office})
                         .left_joins(:object_type)
                         .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                aliases_for_meta_values.map{|a| " LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id "})
                         .select(SELECT_SQL)
                         .distinct
                         .where("#{query_filter} AND object_items.object_type_id = ?", type_id)
                    end
                end
            else
                if type_id == -1
                    count =  ObjectItem.left_joins(:floor => {:building => :office})
                        .left_joins(:object_type)
                        .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                               aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                        .select(SELECT_SQL)
                        .distinct
                        .where(query_filter)
                        .to_a
                        .count
                    if sort_field && sort_order
                        object_items =  ObjectItem.left_joins(:floor => {:building => :office})
                            .left_joins(:object_type)
                            .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                   aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                            .select(SELECT_SQL)
                            .distinct
                            .where(query_filter)
                            .order("#{sort_field} #{sort_order}")
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    else
                        object_items =  ObjectItem.left_joins(:floor => {:building => :office})
                            .left_joins(:object_type)
                            .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                   aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                            .select(SELECT_SQL)
                            .distinct
                            .where(query_filter)
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    end
                else
                    if sort_field && sort_order && meta_sort
                        sort_info = sort_field.split('-')
                        if sort_info.length > 1
                            count = ObjectItem.left_joins(:floor => {:building => :office})
                                .left_joins(:object_type)
                                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                       aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                                .select(SELECT_SQL)
                                .distinct
                                .where("#{query_filter} AND
                                    object_items.object_type_id = ? AND
                                    (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                                    (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                                    type_id,
                                    sort_info[1],
                                    sort_info[0].to_i)
                                .to_a
                                .count
                            object_items = ObjectItem.left_joins(:floor => {:building => :office})
                                .left_joins(:object_type)
                                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                       aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                                .select(SELECT_SQL)
                                .distinct
                                .where("
                                     #{query_filter} AND
                                     object_items.object_type_id = ? AND
                                     (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                                     (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                                     type_id,
                                     sort_info[1],
                                     sort_info[0].to_i)
                                .order("meta_values.value #{sort_order}")
                                .limit(ppp)
                                .offset(ppp * (page - 1))
                        else
                            count = ObjectItem.left_joins(:floor => {:building => :office})
                                .left_joins(:object_type)
                                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id",
                                       aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                                .select(SELECT_SQL)
                                .where("#{query_filter} AND object_items.object_type_id = ?", type_id)
                                .distinct
                                .to_a
                                .count
                            object_items = ObjectItem.left_joins(:floor => {:building => :office})
                                .left_joins(:object_type)
                                .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                       aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                                .select(SELECT_SQL)
                                .where("
                                   #{query_filter} AND object_items.object_type_id = ?",
                                   type_id)
                                .order("#{sort_field} #{sort_order}")
                                .distinct
                                .limit(ppp)
                                .offset(ppp * (page - 1))
                        end
                    elsif sort_field && sort_order
                        count = ObjectItem.left_joins(:floor => {:building => :office})
                            .left_joins(:object_type)
                            .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                    aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                            .select(SELECT_SQL)
                            .where("#{query_filter} AND object_items.object_type_id = ?", type_id)
                            .distinct
                            .to_a
                            .count
                        object_items = ObjectItem.left_joins(:floor => {:building => :office})
                            .left_joins(:object_type)
                             .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                    aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                            .select(SELECT_SQL)
                            .where("
                                #{query_filter} AND object_items.object_type_id = ?",
                                type_id)
                            .order("#{sort_field} #{sort_order}")
                            .distinct
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    else
                        count = ObjectItem.left_joins(:floor => {:building => :office})
                            .left_joins(:object_type)
                            .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                   aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id"})
                            .select(SELECT_SQL)
                            .where("#{query_filter} AND object_items.object_type_id = ?", type_id)
                            .distinct
                            .to_a
                            .count
                        object_items = ObjectItem.left_joins(:floor => {:building => :office})
                            .left_joins(:object_type)
                            .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id ",
                                   aliases_for_meta_values.map{|a| " LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = object_items.id "})
                            .select(SELECT_SQL)
                            .where("#{query_filter} AND object_items.object_type_id = ?", type_id)
                            .distinct
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    end
                end
            end
            object_items.each do |object_item|
                result.push(add_meta_to_object_item(object_item, true, false))
            end

            if as_file
                add_columns = filters_add_cloumn.select{|e|
                    e["field"] != "object_type_id" &&
                    e["field"] != "tabId" &&
                    e["field"] != "building_id" &&
                    e["field"] != "name" &&
                    e["field"] != "item_subtype" &&
                    e["field"] != "floor_name" &&
                    e["field"] != "building_name"
                }.map{|e|
                    e["id"] = e["field"].split("-")[0].to_i
                    e["name"] = e["id"].blank? || e["id"] == 0 ? '' : MetaField.find_by_id(e["id"])[:name]
                    e
                }.select{|e| !e["id"].blank? && e["id"] != 0 }
                filename = "object_items.xls"
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
                widths = [[35, 20, 20, 20, 20, 15, 20, 15], add_columns.map{|a| 20}].reduce([], :concat)
                columns_count = add_columns.length == 0 ? 8 : add_columns.length + 8
                headers = [['Название объекта',
                           'Тип',
                           'Инв. №',
                           'Бизнес-центр',
                           'Корпус',
                           'Этаж',
                           'Помещение',
                           'Состояние'],
                           (add_columns.length == 0 ? [] : add_columns.map{|e| e["name"]})
                ].reduce([], :concat)
                main_sheet.write_row 0, 0, headers[0..columns_count], format_for_headers
                (0..columns_count).each do |current_row|
                    main_sheet.set_column current_row, 0, widths[current_row]
                end

                rows = []
                result.each do |item|
                    entry = []
                    entry << item["name"]
                    entry << item["item_subtype"]
                    inv_num = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.desknum_id}
                    entry << ((inv_num.length > 0) ? inv_num[0]["metavalue"] : '')
                    entry << item["office_name"]
                    entry << item["building_name"]
                    entry << item["floor_name"]
                    entry << item["location_name"]
                    state_ = item["meta_info"].select{|e| e["metafieldid"].to_i == Rails.configuration.object_state_id}
                    entry << (
                      if state_.length > 0
                          state_[0]["metavalue"].blank? || state_[0]["metavalue"] == 'off' ? 'Работает' : 'В ремонте'
                      else
                          'В ремонте'
                      end)
                    add_columns.each do |ac|
                        tmp = item["meta_info"].select{|e| e["metafieldid"].to_i == ac["id"]}
                        entry << (
                          if tmp.length > 0
                              if tmp[0]["metafieldid"] == 2
                                  tmp[0]["metavalue"].blank? || tmp[0]["metavalue"] == 'off' ? 'Нет' : 'Да'
                              else
                                  tmp[0]["metavalue"]
                              end
                          else
                              ''
                          end)
                    end
                    rows.push(entry)
                end

                row_to_write_to = 1
                rows.each do |current_row|
                    main_sheet.write(row_to_write_to, 0, current_row[0..columns_count], format_for_everything_else)
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
    end

    def show
        if check_right('view_object_item')
            object_item = check_right('for_test_user_only') ? find_by_id(58) : find_by_id(params[:id])
            render json: add_meta_to_object_item(object_item, false, false)
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def find_by_id(id)
        cur_object_item = ObjectItem.select(SELECT_SQL)
          .joins("LEFT OUTER JOIN locations ON object_items.location_id = locations.id")
          .left_joins(:floor => {:building => :office})
          .left_joins(:object_type)
          .where("object_items.id = #{id}")
        cur_object_item = cur_object_item.blank? ? [] : cur_object_item[0]
    end

    def update
        if check_right('update_object_item')

            object_item     = JSON.parse params[:object_item]
            cur_object_item = find_by_id(params[:id])

            if object_item['details_page']

                object_item_updated = ObjectItem.update(params[:id], {
                    :comment => object_item['comment'].blank? ? nil : object_item['comment'],
                    :name => object_item['name'],
                    :scale => object_item['scale'].nil? ? 100 : object_item['scale']
                });

            else
                employee_already_sitting = object_item['employee_id'].blank? ? nil : ObjectItem.find_by(employee_id: object_item['employee_id'])
                unless object_item['employee_id'].blank?
                    employee = Employee.find(object_item['employee_id'])
                end
                # place employee on empty place
                if cur_object_item.employee_id.blank? && !object_item['employee_id'].blank? && object_item['status'] == 'EMPLOYEE'
                    if employee_already_sitting
                        ObjectItem.update(employee_already_sitting['id'], {
                          :status         => 'RESERVED',
                          :costcenter_num => employee['costcenter_num'],
                          :employee_id    => nil,
                        })
                    end
                    Api::V1::HeartbeatsController.new.create('removing', cur_object_item.employee_id, cur_object_item.id, @current_user.id)
                    heartbeat_type = 'seat'
                    # if !cur_object_item.costcenter_num.blank? && cur_object_item.costcenter_num.to_i != object_item['costcenter_num'].to_i
                    #     heartbeat_type_prev = cur_object_item.status == 'SHARING' ? 'removing_from_ds' : cur_object_item.status == 'GUEST' ? 'removing_from_gt' : 'remove_reservation'
                    #     Api::V1::HeartbeatsController.new.create(heartbeat_type_prev, cur_object_item.employee_id, cur_object_item.id, @current_user.id)
                    # end
                # we put the employee in the occupied place (we write to the log about the removal of the previous "employee from the place" / "DS table")
                elsif !cur_object_item.employee_id.blank? && !object_item['employee_id'].blank? && object_item['status'] == 'EMPLOYEE'
                    heartbeat_type = 'moving'
                    if employee_already_sitting
                        ObjectItem.update(employee_already_sitting['id'], {
                          :status         => 'RESERVED',
                          :costcenter_num => employee['costcenter_num'],
                          :employee_id    => nil,
                        })
                    end
                    Api::V1::HeartbeatsController.new.create('removing', cur_object_item.employee_id, cur_object_item.id, @current_user.id)
                # removing employee from place
                elsif !cur_object_item.employee_id.blank? && object_item['employee_id'].blank?
                    heartbeat_type = log_by_status(object_item['status'])
                    Api::V1::HeartbeatsController.new.create('removing', cur_object_item.employee_id, cur_object_item.id, @current_user.id)
                # place to DS or reservation
                elsif cur_object_item.employee_id.blank? && object_item['employee_id'].blank?
                    heartbeat_type = log_by_status(object_item['status'])
                end
                not_active = MetaValue.select('meta_values.id as id').where("
                    meta_field_id = #{Rails.configuration.notactive_desk_id} AND
                    metable_type = 'ObjectItem' AND
                    metable_id = #{params[:id]}
                ").first
                if !not_active.blank? && object_item['status'] != 'NOT_ACTIVE'
                    not_active.destroy
                end
                object_item_updated = ObjectItem.update(params[:id], {
                    :comment        => object_item['comment'].blank? ? nil : object_item['comment'],
                    :status         => object_item['status'],
                    :scale          => object_item['scale'].blank? ? 100 : object_item['scale'],
                    :costcenter_num => object_item['costcenter_num'],
                    :employee_id    => object_item['employee_id'],
                });
                Api::V1::HeartbeatsController.new.create(heartbeat_type, object_item['employee_id'], cur_object_item.id, @current_user.id)
            end

            render json: add_meta_to_object_item(find_by_id(params[:id]), true, !employee_already_sitting.blank?)
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def create
        if check_right('create_object_item')
            object_item = ObjectItem.new(object_item_params)
    
            if object_item.save
                meta = MetaValue.create!(
                  value:         'off',
                  meta_field_id: Rails.configuration.object_state_id,
                  metable_type:  'ObjectItem',
                  metable_id:    object_item[:id],
                )
                meta.save
                meta = MetaValue.create!(
                  value:         nil,
                  meta_field_id: Rails.configuration.notactive_desk_id,
                  metable_type:  'ObjectItem',
                  metable_id:    object_item[:id],
                )
                meta.save
                render json: object_item
            else
                render json: {
                    message: "Not saved"
                }, status: :bad_request
            end
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def destroy
        if check_right('delete_object_item')
            object_item = ObjectItem.find(params[:id])
            not_active = MetaValue.select('meta_values.id as id').where("
                    meta_field_id = #{Rails.configuration.notactive_desk_id} AND
                    metable_type = 'ObjectItem' AND
                    metable_id = #{params[:id]}
            ").first
            if !not_active.blank? && object_item['status'] != 'NOT_ACTIVE'
                not_active.destroy
            end
            object_item.destroy
        
            render json: {
                message: "Object Item removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def object_item_params
        params.require(:object_item).permit(:name, :comment)
    end

    def add_meta_to_object_item(object_item, wide_select, was_seated, add_city_name = false)
        item = {}
        item["id"]             = object_item.id
        item["name"]           = object_item.name
        item["comment"]        = object_item.comment
        item["angle"]          = object_item.angle
        item["top"]            = object_item.top
        item["left"]           = object_item.left
        item["width"]          = object_item.width
        item["height"]         = object_item.height
        item["status"]         = object_item.status
        item["costcenter_num"] = object_item.costcenter_num
        item["employee_id"]    = object_item.employee_id
        item["floor_id"]       = object_item.floor_id
        item["object_type_id"] = object_item.object_type_id
        item["location_id"]    = object_item.location_id
        item["location_name"]  = object_item.location_name
        item["meta_info"]      = Api::V1::MetaValuesController.new.match_values_to_fields("ObjectItem", object_item['object_type_id'].to_s, object_item.id)
        item["was_seated"]     = was_seated
        unless add_city_name.blank?
            item["city_name"]  = object_item.city_name
        end
        if !object_item.employee_id.blank?
            employee = Employee.find(object_item.employee_id)
            item["tooltip"] = employee["name"] + " " + employee["surname"]
        end
        if wide_select
            item["item_subtype"] = object_item['item_subtype']
            unless object_item['floor_name'].nil?
                item["floor_name"] = object_item["floor_name"]
            end
            unless object_item['building_name'].nil?
                item["building_name"] = object_item["building_name"]
            end
            unless object_item['office_name'].nil?
                item["office_name"] = object_item["office_name"]
            end
        end
        item
    end

    def log_by_status(status)
        case status
        when 'SHARING'
            'moving_to_ds'
        when 'GUEST'
            'moving_to_gt'
        when 'NOT_ACTIVE'
            'moving_to_na'
        when 'RESERVED'
            'reservation'
        else
            ''
        end
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end