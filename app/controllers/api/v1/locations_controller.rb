# implements rights: view_locations, view_location, update_location, create_location, delete_location, 

module Api
    module V1
    end
end
class Api::V1::LocationsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    # get locations with meta data and sorging by meta
    def index
        if check_right('view_locations') && !check_right('for_test_user_only')
            page         = params[:page].to_i
            ppp          = params[:per_page].to_i
            type_id      = params[:type_id].to_i # -1 means that need all types
            sort_field   = params[:sort_field]
            sort_order   = params[:sort_order]
            meta_sort    = params[:meta_sort].to_s.downcase == "true" # sorting by specific meta column
            no_meta      = params[:no_meta].to_s.downcase == "true" # exclude adding meta information to each location
            filters      = params[:filters].blank? ? [] : JSON.parse(params[:filters])
            fast_load    = params[:fast_load].to_s.downcase == "true" # no additional info about locations
            locations = []
            result    = []
            query_filter = ""
            aliases_for_meta_values = []
            select_sql = "
                locations.*,
                location_types.name as item_subtype,
                floors.name as floor_name,
                buildings.name as building_name,
                cities.name as city_name,
                locations.name || ', ' || cities.name || ', ' || offices.name || ', ' || buildings.name || ', ' || floors.name as preview"
            filters = filters.select{|f| !f["value"].blank? && f["value"] != "-1"}
            filters.each_with_index do |filter, index|
                meta_filter = filter["field"].split('-')
                if meta_filter.length > 1
                    aliases_for_meta_values.push("meta_value_#{index}")
                    values = filter["value"].split(',')
                    if meta_filter[0].to_i == Rails.configuration.square_id && filter["value"].split(',').length == 2
                        query = "  \"meta_value_#{index}\".meta_field_id = #{Rails.configuration.square_id} AND cast(\"meta_value_#{index}\".value as double precision) >= #{filter["value"].split(',')[0].to_f} AND cast(\"meta_value_#{index}\".value as double precision) <= #{filter["value"].split(',')[1].to_f} "
                    elsif values.length > 1
                        query = ''
                        values.map { |i|
                            if i.to_s == 'null_on'
                                query = "\"meta_value_#{index}\".value IS NULL OR "
                            end
                        }
                        query += "\"meta_value_#{index}\".value IN (" + values.map { |i| "'" + (i.to_s == 'null_on' ? '' : i.to_s) + "'" }.join(",") + ") AND \"meta_value_#{index}\".meta_field_id = " + meta_filter[0]
                    elsif filter["value"] != "-1"
                        query = " \"meta_value_#{index}\".value LIKE '%#{filter["value"]}%' AND \"meta_value_#{index}\".meta_field_id = " + meta_filter[0]
                    end
                    query = " (#{query}) "
                else
                    if filter["field"] == 'building_id'
                        query = " buildings.id IN (#{filter["value"].split(',').map { |i| "'" + i.to_s + "'" }.join(",")}) "
                    elsif filter["field"] == 'location_type_id'
                        query = " locations.location_type_id IN (#{filter["value"].map { |i| "'" + i.to_s + "'" }.join(",")}) "
                    else
                        column = filter["field"] == 'item_subtype' ? 'location_types.name' : filter["field"] == 'floor_name' ? 'floors.name' : filter["field"] == 'name' ? 'locations.name' : filter["field"] == 'building_name' ? 'buildings.name' : filter["field"]
                        query = " #{column} LIKE '%#{filter["value"]}%' "
                    end
                end

                if index < (filters.length - 1) && filters.length > 1 && !query.blank?
                    query_filter += query + " AND "
                elsif index == filters.length - 1 && !query.blank?
                    query_filter += query
                end
            end
            query_filter = query_filter.length > 0 ? query_filter : " \"locations\".\"name\" LIKE '%%' "
            if page === 0 && ppp === 0 # load all stuff without pagination
                if fast_load
                    locations = Location.all
                else
                    locations = Location.left_joins(:floor)
                        .left_joins(:floor => {:building => {:office => :city}})
                        .left_joins(:location_type)
                        .select(select_sql).all
                end
            else 
                if type_id == -1
                    count =  Location.left_joins(:floor => {:building => {:office => :city}})
                        .left_joins(:location_type)
                        .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"} )
                        .select(select_sql)
                        .where(query_filter)
                        .to_a
                        .count
                    if sort_field && sort_order
                        locations =  Location.left_joins(:floor => {:building => {:office => :city}})
                            .left_joins(:location_type)
                            .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                            .select(select_sql)
                            .where(query_filter)
                            .order("#{sort_field} #{sort_order}")
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    else
                        locations =  Location.left_joins(:floor => {:building => {:office => :city}})
                            .left_joins(:location_type)
                            .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                            .select(select_sql)
                            .where(query_filter)
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    end
                else
                    if sort_field && sort_order && meta_sort
                        sort_info = sort_field.split('-')
                        if sort_info.length > 1
                            count = Location.left_joins(:floor => {:building => {:office => :city}})
                                .left_joins(:location_type)
                                .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                                .where("#{query_filter} AND
                                    locations.location_type_id = ? AND
                                    (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                                    (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                                    type_id,
                                    sort_info[1],
                                    sort_info[0].to_i)
                                .to_a
                                .count
                            locations = Location.left_joins(:floor => {:building => {:office => :city}})
                                .left_joins(:location_type)
                                .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                                .select(select_sql)
                                .where("
                                    #{query_filter} AND
                                     locations.location_type_id = ? AND
                                     (meta_values.metable_type = ? OR meta_values.metable_type IS NULL) AND
                                     (meta_values.meta_field_id = ? OR meta_values.meta_field_id IS NULL)",
                                    type_id,
                                    sort_info[1],
                                    sort_info[0].to_i)
                                .order("meta_values.value #{sort_order}")
                                .limit(ppp)
                                .offset(ppp * (page - 1))
                        else
                            count = Location.left_joins(:floor => {:building => {:office => :city}})
                                .left_joins(:location_type)
                                .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                                .where("#{query_filter} AND locations.location_type_id = ?", type_id)
                                .distinct
                                .to_a
                                .count
                            locations = Location.left_joins(:floor => {:building => {:office => :city}})
                                .left_joins(:location_type)
                                .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                                .select(select_sql)
                                .where("
                                    #{query_filter} AND locations.location_type_id = ?",
                                    type_id)
                                .order("#{sort_field} #{sort_order}")
                                .distinct
                                .limit(ppp)
                                .offset(ppp * (page - 1))
                        end
                    elsif sort_field && sort_order
                        count = Location.left_joins(:floor => {:building => {:office => :city}})
                            .left_joins(:location_type)
                            .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                            .where("#{query_filter} AND locations.location_type_id = ?", type_id)
                            .distinct
                            .to_a
                            .count
                        locations = Location.left_joins(:floor => {:building => {:office => :city}})
                            .left_joins(:location_type)
                            .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                            .select(select_sql)
                            .where("
                                #{query_filter} AND locations.location_type_id = ?",
                                type_id)
                            .order("#{sort_field} #{sort_order}")
                            .distinct
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    else
                        count = Location.left_joins(:floor => {:building => {:office => :city}})
                            .left_joins(:location_type)
                            .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                            .where("#{query_filter} AND locations.location_type_id = ?", type_id)
                            .distinct
                            .to_a
                            .count
                        locations = Location.left_joins(:floor => {:building => {:office => :city}})
                            .left_joins(:location_type)
                            .joins(aliases_for_meta_values.map{|a| "LEFT OUTER JOIN meta_values #{a} ON #{a}.metable_id = locations.id AND #{a}.metable_type = 'Location'"})
                            .select(select_sql)
                            .where("#{query_filter} AND locations.location_type_id = ?", type_id)
                            .distinct
                            .limit(ppp)
                            .offset(ppp * (page - 1))
                    end
                end
            end
            if no_meta || fast_load
                result = locations
            else
                locations.each do |location|
                    result.push(add_meta_to_location(location, true))
                end
            end

            render json: { items: result, count: count }
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def locations_not_in_contract
        if check_right('view_locations')
        page        = params[:page].to_i
        ppp         = params[:per_page].to_i
        contract_id = params[:contract_id].to_i
        office_id   = params[:office_id].to_i
        count = Location.select("locations.*, locations.name || ', ' || floors.name AS preview").joins(
                "LEFT OUTER JOIN meta_values ON meta_values.metable_id = locations.id
                                            AND meta_values.metable_type = 'Location'
                                            AND meta_values.meta_field_id = #{Rails.configuration.contract_id}",
                :floor => {:building => :office})
            .where("
                (meta_values.value IS NULL OR meta_values.value != #{contract_id}::varchar)
                #{ office_id > 0 ? " AND offices.id = #{office_id} " : ""}")
            .distinct
            .to_a
            .count
        locations = Location.select("
                locations.*,
                locations.name || ', ' || floors.name AS preview,
                (
                  SELECT meta_values.value::double precision
                    FROM meta_values
                   INNER JOIN locations l2 ON l2.id = meta_values.metable_id
                                          AND meta_values.metable_type = 'Location'
                                          AND meta_values.meta_field_id = #{Rails.configuration.square_id}
                   WHERE l2.id = locations.id
                ) AS square")
            .joins(
                "LEFT OUTER JOIN meta_values ON meta_values.metable_id = locations.id
                                            AND meta_values.metable_type = 'Location'
                                            AND meta_values.meta_field_id = #{Rails.configuration.contract_id}",
                :floor => {:building => :office})
            .where("
                (meta_values.value IS NULL OR meta_values.value != #{contract_id}::varchar)
                #{ office_id > 0 ? " AND offices.id = #{office_id} " : ""}")
            .distinct
            .limit(ppp)
            .offset(ppp * (page - 1))
        render json: { count: count, locations: locations }
        else
            render json: {
              message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_location')
            location = Location.find(params[:id])
            render json: add_meta_to_location(location, false)
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_location')
            location = Location.find(params[:id])
            
            if location.update(location_params)
                render json: add_meta_to_location(location, false)
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

    def create
        if check_right('create_location')
            location = Location.new(location_params)

            location.save
            # puts location.errors.full_messages
    
            if location.save
                render json: location
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
        if check_right('delete_location')
            location = Location.find(params[:id])
            location.destroy
        
            render json: {
                message: "Locations removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def location_params
        params.require(:location).permit(:name, :description, :is_real, :floor, :location_type)
    end

    # add meta data to location
    def add_meta_to_location(location, wide_select)
        item = {}
        item["id"]               = location.id
        item["name"]             = location.name
        item["description"]      = location.description
        item["costcenter"]       = location.costcenter
        item["dots"]             = location.dots
        item["top"]              = location.top
        item["left"]             = location.left
        item["floor_id"]         = location.floor_id
        item["name_position"]    = location.name_position
        item["location_type_id"] = location.location_type_id
        item["costcenter_num"]   = location.costcenter_num
        unless location['preview'].nil?
            item["preview"] = location['preview']
        end
        item["meta_info"]        = Api::V1::MetaValuesController.new.match_values_to_fields("Location", location['location_type_id'].to_s, location.id)
        if wide_select
            item["item_subtype"] = location.item_subtype
            unless location['floor_name'].nil?
                item["floor_name"] = location["floor_name"]
            end
            unless location['building_name'].nil?
                item["building_name"] = location["building_name"]
            end
            unless location['city_name'].nil?
                item["city_name"] = location["city_name"]
            end
            unless location['preview'].nil?
                item["preview"] = location["preview"]
            end
        end
        item
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end