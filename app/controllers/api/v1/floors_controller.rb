# implements rights: view_floors, view_floor, update_floor, create_floor, delete_floor, 

module Api
    module V1
    end
end
class Api::V1::FloorsController < ApplicationController

    before_action :authenticate_request!
    before_action :load_current_user!

    after_action :set_headers

    def index
        if check_right('view_floors') && !check_right('for_test_user_only')
            floors = []
            Floor.left_joins(:building).select("
                floors.id as id,
                floors.*,
                buildings.name as building_name
            ").where("#{check_right('update_floor') ? '' : "floors.id != #{Rails.configuration.test_floor_id}"}").each do |floor|
                floors.push(add_meta_to_floor(floor))
            end
            render json: floors
        elsif check_right('view_floors') && check_right('for_test_user_only')
            render json: [add_meta_to_floor(Floor.left_joins(:building).select("
                floors.id as id,
                floors.*,
                buildings.name as building_name
            ").where("floors.id = #{Rails.configuration.test_floor_id}").first)]
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    # get floor data with locations and objects
    def show
        if check_right('view_floor') && !check_right('for_test_user_only') ||
          check_right('for_test_user_only') && params[:id].to_i == Rails.configuration.test_floor_id
            fid = params[:id]

            floor = Floor.left_joins(:floors_configs).left_joins(:building)
            .where('floors.id = (?)',
            fid)
            .select("
                floors.id as id,
                floors.*,
                floors_configs.plan as plan,
                floors_configs.preview as preview,
                floors_configs.parameters as parameters,
                buildings.name as building_name
            ").first

            locations = Location.where('floor_id = (?)',
                fid)
            .select("
                locations.*
            ")

            object_items = ObjectItem.left_joins(:employee)
               .left_joins(:object_type)
               .joins("LEFT OUTER JOIN meta_values mv1 ON mv1.meta_field_id = #{Rails.configuration.parking_place_id} AND
                                                          mv1.metable_type = 'ObjectItem' AND
                                                          mv1.metable_id = object_items.id")
               .where("floor_id = (#{fid}) ")
               .select("
                    object_items.*,
                    CONCAT(employees.name, ' ', employees.surname) AS tooltip,
                    object_types.name                              AS type_name,
                    employees.costcenter_num                       AS employee_costcenter_num,
                    null                                           AS can_book,
                    null                                           AS have_opportunity_to_book,
                    null                                           AS occupied,
                    mv1.value                                      AS parking,
                    ''                                             AS emp_sd_id
               ")
            ps = []
            unless @current_user.blank?
                ps = Api::V1::BookingsController.new.available_ds_places_at_floor(Employee.find_by_id(@current_user.id), fid)
            end
            object_items.collect do |x|
                x_found = ps.detect {|e| e.place_id.to_i == x[:id].to_i }
                x.have_opportunity_to_book = !x_found.blank? && x_found[:ready] == 'on'
                occupied = Booking.where(" bookings.object_item_id = #{x[:id].to_i} AND
                                           bookings.book_from <= CURRENT_DATE       AND
                                           bookings.book_to >= CURRENT_DATE")
                x.occupied = !occupied.empty?
                if x[:parking] == 'on' && x.have_opportunity_to_book == 't'
                  available_dates_for_parking = AvailableDatesForParking.where("
                    available_dates_for_parkings.object_item_id = #{x[:id].to_i} AND
                    available_dates_for_parkings.date_start <= CURRENT_DATE      AND
                    available_dates_for_parkings.date_end >= CURRENT_DATE ")
                  if !available_dates_for_parking.empty? || x_found[:emp_sd_id].blank?
                    x.can_book = occupied.empty?
                  else
                    x.have_opportunity_to_book = false
                    x.can_book = false
                  end
                  x[:emp_sd_id] = x_found[:emp_sd_id] == '' ? nil : x_found[:emp_sd_id].to_i
                elsif x[:parking] != 'on' && x.have_opportunity_to_book == 't'
                  x.can_book = occupied.empty?
                  x[:emp_sd_id] = nil
                end
                x
            end

            # TODO: Send on frontend only costcenters from current floor
            costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
            costcenters_json = costcenters_json.map! {|cs|
                
                cs["color"] = "rgb(#{[0,0,0].map{|c| rand(0..255)}.join(',')})"
                cs["show"] = false

                cs
            }

            projects_data = Api::V1::SearchController.new.projects_on_floor(fid)
            projects_data = projects_data.map! {|pr|
                
                pr["color"] = "rgb(#{[0,0,0].map{|c| rand(0..255)}.join(',')})"
                pr["show"] = false

                pr
            }

            attributes = object_items.size > 0 ? MetaValue.where("
                meta_values.metable_type = 'ObjectItem' AND
                meta_values.metable_id IN (#{object_items.collect{|x| x[:id]}.join(', ')}) OR
                meta_values.metable_type = 'Location' AND
                meta_values.metable_id IN (#{locations.collect{|x| x[:id]}.join(', ')}) OR
                meta_values.metable_type = 'Floor' AND
                meta_values.metable_id = #{floor[:id]}") : []

              unless @current_user.nil?
                eid = @current_user.id
                
                current_block = FloorBlock.where('floor_blocks.floor_id = (?)', fid).first
                status = get_lock_info(fid, eid, current_block, false)
                locked = { status: status, block: FloorBlock.select("
                    floor_blocks.*,
                    employees.name as e_name,
                    employees.surname as e_surname
                ").joins(:employee).where('floor_blocks.floor_id = (?)', fid).first }
            else
                locked = nil
            end
            
            render json: {floor: floor, locked: locked, locations: locations, object_items: object_items, costcenters: costcenters_json, projects: projects_data, attributes: attributes}
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_floor')

            floor = JSON.parse params[:floor]

            floor_updated = Floor.update(params[:id], {
                :name => floor['name'],
                :short_name => floor['short_name'],
                :ord => floor['ord'],
                :active => floor['active'],
                :building_id => floor['building_id'],
                
            });
            
            render json: add_meta_to_floor(
              Floor.left_joins(:building).select("
                floors.id as id,
                floors.*,
                buildings.name as building_name
              ").where("floors.id = #{floor_updated[:id]}").first
            )
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    # update details for floor with objects and locations
    def update_details
        if check_right('update_floor')

            floor = JSON.parse params[:floor]

            floor_params = floor['new_parameters']

            floor_updated = Floor.update(params[:id], {
                :name => floor['floor']['name'],
                :short_name  => floor['floor']['short_name'],
                :building_id => floor['floor']['building_id'],
            });

            ids = []

            # loop for objects
            floor['object_items'].each do |object|

                if object['isnew'] # create new object
                    new_obj = ObjectItem.create(
                      :name => object['name'],
                      :angle => object['angle'],
                      :scale => object['scale'],
                      :floor_id => params[:id],
                      :object_type_id => object['object_type_id'],
                      :left => object['left'],
                      :top => object['top'],
                      :width => object['width'],
                      :height => object['height'],
                      :comment => object['comment'],
                      :employee_id => nil,
                      :location_id => nil
                    );
                    meta = MetaValue.create!(
                      value: 'off',
                      meta_field_id: Rails.configuration.object_state_id,
                      metable_type: 'ObjectItem',
                      metable_id: new_obj['id'],
                    )
                    meta.save
                    ids.push(new_obj['id'])
                else
                    # update object
                    ids.push(object['id'])

                    ObjectItem.update(object['id'], {
                      :name => object['name'],
                      :angle => object['angle'],
                      :scale => object['scale'],
                      :floor_id => params[:id],
                      :object_type_id => object['object_type_id'],
                      :left => object['left'],
                      :top => object['top'],
                      :width => object['width'],
                      :height => object['height'],
                      :comment => object['comment'],
                      :employee_id => object['employee_id'],
                      :location_id => object['location_id']
                    });
                end
            end

            # remove objects which was removed by frontend
            ObjectItem.where("id NOT IN (:ids) AND floor_id = :fid", { ids: ids, fid: params[:id] }).delete_all

            ids = []

            floor['locations'].each do |location|

                unless location['isnew'] # update location
                    ids.push(location['id'])

                    Location.update(location['id'], {
                        :name => location['name'],
                        :floor_id => params[:id],
                        :description => location['description'],
                        :costcenter => location['costcenter'],
                        :is_real => true,
                        :dots => location['dots'],
                        :top => location['top'],
                        :left => location['left'],
                        :name_position => location['name_position'],
                        :location_type_id => location['location_type_id']
                    });
                else # create location
                    new_loc = Location.create(
                        :name => location['name'],
                        :floor_id => params[:id],
                        :description => location['description'],
                        :costcenter => location['costcenter'],
                        :is_real => true,
                        :dots => location['dots'],
                        :top => location['top'],
                        :left => location['left'],
                        :name_position => location['name_position'],
                        :location_type_id => location['location_type_id']
                    );

                    ids.push(new_loc['id'])
                end
            end

            # remove locations which was removed by frontend
            Location.where("id NOT IN (:ids) AND floor_id = :fid", { ids: ids, fid: params[:id] }).delete_all

            # get actual locations and objects for floor
            locations = Location.where('floor_id = (?)',
                params[:id])
            .select("
                locations.*
            ")
            object_items = ObjectItem.where('floor_id = (?)',
                params[:id])
            .select("
                object_items.*
            ")

            unless floor_params.nil?
                # choosing what to do with image - delete, update or nothing
                floor_params_old = FloorsConfig.where('floor_id = (?)', params[:id]).first
                if params[:image].blank? && floor['delete_bg'].to_s.downcase == 'true'
                    id = params[:id]
                    unless id.blank?
                        File.delete(Rails.root.join('public', 'img', 'backgrounds', "#{id}.png")) if File.exist?(Rails.root.join('public', 'img', 'backgrounds', "#{id}.png"))
                    end
                    floor_params.delete('bgurl')
                elsif !params[:image].blank?
                    id = params[:id]
                    unless id.blank?
                        image_data = Base64.decode64(params[:image]['data:image/png;base64,'.length .. -1])
                        File.open(Rails.root.join('public', 'img', 'backgrounds', "#{id}.png"), 'wb') do |f|
                            f.write(image_data)
                        end
                    end
                    floor_params['bgurl'] = "/img/backgrounds/#{id}.png"
                elsif floor_params['bgurl'].blank? && !floor_params_old['parameters'].blank? && !JSON.parse(floor_params_old['parameters'])['bgurl'].blank?
                    floor_params['bgurl'] = JSON.parse(floor_params_old['parameters'])['bgurl']
                end

                # update params for floor
                FloorsConfig.where('floor_id = (?)', params[:id]).first.update(parameters: floor_params.to_json)
            end

            floor = Floor.left_joins(:floors_configs)
            .where('floors.id = (?)',
                params[:id])
            .select("
                floors.id as id,
                floors.*,
                floors_configs.plan as plan,
                floors_configs.preview as preview,
                floors_configs.parameters as parameters
            ").first

            eid = @current_user.id
            fid = params[:id]
            current_block = FloorBlock.where('floor_blocks.floor_id = (?)', fid).first
            status = get_lock_info(fid, eid, current_block)

            locked = { status: status, block: FloorBlock.select("
                floor_blocks.*,
                employees.name as e_name,
                employees.surname as e_surname
            ").joins(:employee).where('floor_blocks.floor_id = (?)', fid).first }

            plan(params[:id])

            render json: {floor: floor, locked: locked, locations: locations, object_items: object_items}
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def create
        if check_right('create_floor')

            floor = JSON.parse params[:floor]

            floor_new = Floor.create!(
                :name => floor['name'],
                :short_name => floor['name'].chars.first,
                :ord => floor['ord'],
                :active => floor['active'],
                :building_id => floor['building_id'],
            )

            FloorsConfig.create(
                :floor_id => floor_new['id'],
                :plan => nil,
                :preview => nil,
                :parameters => nil
            )
    
            if floor_new.save
                render json: floor_new
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
        if check_right('delete_floor')
            floor = Floor.find(params[:id])
            object_items = ObjectItem.where(floor_id: params[:id])
            object_items.each do |object_item|
                object_item.destroy
            end
            floor.destroy
        
            render json: {
                id: params[:id].to_i,
                message: "Floor removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    # get information about place
    # def get_place_short_info
    #     desk = ObjectItem.left_joins(:employee)
    #         .select("object_items.id AS id,
    #                  employees.id AS employee_id,
    #                  employees.name AS name,
    #                  employees.surname AS surname")
    #         .where('object_items.id = (?)', params[:desk_id]).first
        
    #     render json: desk
    # end

    # get floors by building id
    def get_floors_for_building
        if check_right('view_buildings')
            floors = Floor.where('building_id = (?)', params[:building_id]).all
            render json: floors
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    # get meta field data for floor
    def add_meta_to_floor(floor)
        item = {}
        item["id"]          = floor.id
        item["name"]        = floor.name
        item["short_name"]  = floor.short_name
        item["building_id"] = Building.not_exists?(floor.building_id) ? nil : floor.building_id
        item["ord"]         = floor.ord
        item["active"]      = floor.active
        item["building_name"] = floor.building_name
        item["meta_info"]    = Api::V1::MetaValuesController.new.match_values_to_fields("Floor", "any", floor.id)
        item
    end

    def lock_floor(fid, eid)
        FloorBlock.create!(
            floor_id: fid,
            employee_id: eid,
        )
    end

    def break_lock(fid, eid, current_block)
        current_time = DateTime.now.to_i
        updated = current_block.updated_at.to_i
        minutes = ((current_time - updated) / 60).to_i
        if current_block.employee_id == @current_user.id
            current_block.touch
            return true
        else
            if minutes > FLOOR_EDIT_LOCK_MINS
                current_block.delete
                lock_floor(fid, eid)
                return true
            end
            return false
        end
    end

    def get_lock_info(fid, eid, current_block, can_lock = true)
        status = ''
        if current_block.nil?
            if can_lock
                status = 'BLOCKED_BY_YOU'
                lock_floor(fid, eid)
            end
        else
            status = 'BLOCKED_BY_OTHER'
            current_user_id = nil
            unless @current_user.nil?
                current_user_id = @current_user.id
            end
            if can_lock || (eid == current_user_id)
                if break_lock(fid, eid, current_block)
                    status = 'BLOCKED_BY_YOU'
                end
            end
        end
        status
    end

    def lock
        if check_right('update_floor')
            eid = @current_user.id
            fid = params[:id]
            
            current_block = FloorBlock.where('floor_blocks.floor_id = (?)', fid).first
            status = get_lock_info(fid, eid, current_block)
            
            render json: { status: status, block: FloorBlock.select("
                    floor_blocks.*,
                    employees.name as e_name,
                    employees.surname as e_surname
                ").joins(:employee).where('floor_blocks.floor_id = (?)', fid).first }
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end
    
    def plan(id = nil)
        fId = id
        if id.nil?
            fId = params[:id]
        end
        path = Rails.root.join('public', 'img', 'plans', "floor_plan_#{fId}.svg")

        out = nil
        # unless File.exist?(path)

            locations = Location.where('floor_id = (?)',
            fId)
            .select("
                locations.*
            ").order('location_type_id ASC')

            object_items = ObjectItem.where('floor_id = (?)',
            fId).left_joins(:object_type)
            .select("
                object_items.*,
                object_types.icon
            ")

            out = object_items

            image_data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4000" height="4000" version="1.1">'

            locations.each do |location|

                pointsitems = ''
                JSON.parse(location.dots.gsub("=>", ":").gsub("nil,", "").gsub("nil", "")).each do |dot|
                    pointsitems += ' ' + dot['x'].to_s + ', ' + dot['y'].to_s
                end

                image_data += "
                
                <polyline
                    subtype='#{location.location_type_id}'
                    entity-name='#{location.name}'
                    stroke='#665'
                    stroke-width='5px'
                    fill='#ccc'
                    points='#{pointsitems}'
                />"

            end

            object_items.each do |item|
                angle = 0
                unless item.angle.nil?
                    angle = item.angle
                end

                image_data += "
                    <defs xmlns='http://www.w3.org/2000/svg'>
                        <pattern id='objectpattern#{item.object_type_id}' patternUnits='objectBoundingBox' width='#{item.width}' height='#{item.height}'>
                            <image xlink:href='/img/editor-icons/objects/#{item.icon}' width='#{item.width}' height='#{item.height}' />
                        </pattern>
                    </defs>
                    <rect transform='rotate(#{angle} #{item.left + 25} #{item.top + 25})'
                        width='#{item.width}' height='#{item.height}' x='#{item.left}' y='#{item.top}'
                        fill='url(#objectpattern#{item.object_type_id})' />"

            end

            image_data += '</svg>'
            
            File.open(path, 'wb') do |f|
                f.write(image_data)
            end
        # end

        if id.nil?
            render json: "floor_plan_#{fId}.svg"
        end
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end
