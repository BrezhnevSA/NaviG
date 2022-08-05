# implements rights: view_meta_types, view_meta_type, update_meta_type, create_meta_type, delete_meta_type, 

module Api
    module V1
    end
end
class Api::V1::MetaValuesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def get_fields_list(entity_type, subtype, id)
        # getting all fields for current entity
        meta_map = MetaMap.joins(:meta_field => :meta_type).
            select("meta_maps.id as id,
                meta_maps.entity_subtype_id as metasubtype,
                meta_maps.show_in_management as show_in_management,
                meta_fields.name as metaname,
                meta_fields.id as metafieldid,
                meta_types.metatype as metatype,
                '#{entity_type}' as entitytype,
                '#{id}' as entityid").
            where('meta_maps.entity_type = (?)', entity_type).
            where('meta_maps.entity_subtype_id = (?)', subtype).
            # where('meta_values.metable_id = (?) OR meta_values.metable_id is NULL', id).
            where('meta_maps.active = (?)', true).to_a

        return meta_map
    end

    def get_fields_values(entity_type, subtype, id)
        # getting all fields for current entity
        if id.to_f == -1
            meta_map = MetaMap.joins(:meta_field => :meta_type).left_outer_joins(:meta_field => :meta_values).
                select("meta_maps.id as id,
                        meta_maps.entity_subtype_id as metasubtype,
                        meta_maps.show_in_management as show_in_management,
                        meta_fields.name as metaname,
                        meta_fields.id as metafieldid,
                        meta_types.metatype as metatype,
                        meta_values.value as metavalue,
                        meta_values.id as metavalueid,
                        meta_values.metable_id as metable_id,
                        '#{entity_type}' as entitytype,
                        '#{id}' as entityid").
                where('meta_maps.entity_type = (?)', entity_type).
                where('meta_maps.entity_subtype_id = (?)', subtype).
                where("meta_types.metatype = 'reference'").
                where("meta_fields.name = 'Contract ID'").
                where('meta_values.metable_type = (?)', entity_type).
                where('meta_maps.active = (?)', true).to_a
        else
            meta_map = MetaMap.joins(:meta_field => :meta_type).left_outer_joins(:meta_field => :meta_values).
                select("meta_maps.id as id,
                        meta_maps.entity_subtype_id as metasubtype,
                        meta_maps.show_in_management as show_in_management,
                        meta_fields.name as metaname,
                        meta_fields.id as metafieldid,
                        meta_types.metatype as metatype,
                        meta_values.value as metavalue,
                        meta_values.id as metavalueid,
                        meta_values.metable_id as metable_id,
                        '#{entity_type}' as entitytype,
                        '#{id}' as entityid").
                where('meta_maps.entity_type = (?)', entity_type).
                where('meta_maps.entity_subtype_id = (?)', subtype).
                where('meta_values.metable_type = (?)', entity_type).
                where('meta_values.metable_id = (?) OR meta_values.metable_id is NULL', id).
                where('meta_maps.active = (?)', true).to_a
        end
        results = []
        meta_map.each do |el|
            item = {}
            if el.metatype === 'image'
                if file_dir_or_symlink_exists?("public/img/attributes/#{el.id}.png")
                    metavalue = "/img/attributes/#{el.id}.png"
                else
                    metavalue = "/img/attributes/default.png"
                end
            else
                metavalue = el.metavalue
            end
            if id.to_f == -1
                result = results.detect{|r| r["metavalue"] == metavalue}
                if result.blank?
                    item["metavalue"]   = metavalue
                    item["info"] = []
                    item["info"].push({
                        "metavalueid" => el.metavalueid,
                        "metable_id" => el.metable_id
                    })
                    results.push(item)
                else
                    results = results.map{|r|
                        if r["metavalue"] == metavalue
                            r["info"].push({
                              "metavalueid" => el.metavalueid,
                              "metable_id" => el.metable_id
                            })
                        end
                        r
                    }
                end
            else
                item["id"]          = el.id
                item["metasubtype"] = el.metasubtype
                item["metaname"]    = el.metaname
                item["metafieldid"] = el.metafieldid
                item["metatype"]    = el.metatype
                item["metavalue"]   = metavalue
                item["metavalueid"] = el.metavalueid
                item["metable_id"]  = el.metable_id
                item["entitytype"]  = el.entitytype
                item["entityid"]    = el.entityid
                results.push(item)
            end

        end
        results
    end

    def match_values_to_fields(entity_type, subtype, fid)

        fields = get_fields_list(entity_type, subtype, fid).to_a.map(&:serializable_hash)
        values = get_fields_values(entity_type, subtype, fid)

        fields.each do |field, index|

            field['metavalue'] = nil
            field['metavalueid'] = nil
            field['metable_id'] = nil

            unless values.empty?
                current_value = values.detect {|f| (f["id"] == field['id']) }
                unless current_value.nil?
                    field['metavalue'] = current_value['metavalue']
                    field['metavalueid'] = current_value['metavalueid']
                    field['metable_id'] = current_value['metable_id']
                end
            end

        end

        return fields

    end

    def show
        if check_right('view_meta_value')
            if params[:type].downcase == 'object' && params[:id].to_f != -1
                entity_type = 'ObjectItem'
                current_entity = ObjectItem.find(params[:id])
                subtype = current_entity['object_type_id'].to_s
            end
            if params[:type].downcase == 'location'
                entity_type = 'Location'
                current_entity = params[:id].to_f == -1 ? -1 : Location.find(params[:id])
                subtype = params[:id].to_f == -1 ? 1.to_s : current_entity['location_type_id'].to_s
            end
            if params[:type] == 'City'
                entity_type = 'City'
                subtype = 'any'
            end
            if params[:type] == 'Building'
                entity_type = 'Building'
                subtype = 'any'
            end
            if params[:type] == 'Office'
                entity_type = 'Office'
                subtype = 'any'
            end
            if params[:type] == 'Floor'
                entity_type = 'Floor'
                subtype = 'any'
            end
            if params[:type] == 'employee'
                entity_type = 'Employee'
                subtype = 'any'
            end

            #TODO: review this with frontend 
            if params[:multi].nil?
                multi = false
            else
                if params[:multi].downcase === 'true' || params[:id].to_f == -1
                    multi = true
                else
                    multi = false
                end
            end

            fields = multi ? 
                get_fields_values(entity_type, subtype, params[:id]) : 
                match_values_to_fields(entity_type, subtype, params[:id])
            
            render json: fields
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_meta_value')
            
            if params[:type].downcase == 'object'
                entity_type = 'ObjectItem'
                current_entity = ObjectItem.find(params[:id])
                subtype = current_entity['object_type_id'].to_s
            end
            if params[:type].downcase == 'location'
                entity_type = 'Location'
                current_entity = Location.find(params[:id])
                subtype = current_entity['location_type_id'].to_s
            end
            if params[:type] == 'City'
                entity_type = 'City'
                subtype = 'any'
            end
            if params[:type] == 'Building'
                entity_type = 'Building'
                subtype = 'any'
            end
            if params[:type] == 'Office'
                entity_type = 'Office'
                subtype = 'any'
            end
            if params[:type] == 'Floor'
                entity_type = 'Floor'
                subtype = 'any'
            end
            if params[:type] == 'employee'
                entity_type = 'Employee'
                subtype = 'any'
            end

            fields = match_values_to_fields(entity_type, subtype, params[:id])

            attributes = JSON.parse params[:data]
            
            fields.each do |field, index|

                attr_index = attributes.index {|a| a['id'] == field['id'] }

                if attr_index
                    if attributes[attr_index]['metatype'] === 'image' || attributes[attr_index]['metatype'] === 'panorama'
                        filename = "#{entity_type}_#{params[:id]}_#{field['metafieldid']}.png"
                        image_data = Base64.decode64(attributes[attr_index]['metavalue']['data:image/png;base64,'.length .. -1])
                        File.open(Rails.root.join('public', 'img', 'attributes', "#{filename}"), 'wb') do |f|
                            f.write(image_data)
                        end
                        m_value = "/img/attributes/#{filename}"
                    else
                        m_value = attributes[attr_index]['metavalue']
                    end

                    unless field['metavalueid'].nil?
                        MetaValue.update(field['metavalueid'], { :value => m_value })
                    else
                        MetaValue.create(
                            # value: attributes[attr_index]['metavalue'],
                            value: m_value,
                            meta_field_id: field['metafieldid'],
                            metable_type: field['entitytype'],
                            metable_id: params[:id],
                        )
                    end
                end
            end

            fields = match_values_to_fields(entity_type, subtype, params[:id])
            
            render json: fields
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update_one_metavalue
        if check_right('update_meta_value')
            id = params[:data][:id].to_i > 0 ? params[:data][:id].to_i : nil
            value = params[:data][:value]
            meta_field_id = params[:data][:meta_field_id].to_i
            metable_type = params[:data][:metable_type]
            metable_id = params[:data][:metable_id].to_i

            if id.blank? || MetaValue.find(id).blank?
                metavalue = MetaValue.create(
                  value: value,
                  meta_field_id: meta_field_id,
                  metable_type: metable_type,
                  metable_id: metable_id,
                )
            else
                metavalue = MetaValue.find(id)
                metavalue = MetaValue.update(id, { :value => value })
            end
            render json: metavalue
        else
            render json: {
              message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update_contract_reference #TODO: delete this method
        if check_right('update_contract_reference') #TODO: delete this right
            new_entries = params[:info]
            already_existed_entries = []
            contract_old_info = MetaValue.joins(:meta_field => :meta_type)
                .where("meta_types.metatype = 'reference' AND
                        meta_fields.name    = 'Contract ID' AND
                        meta_values.value   = (?)",
                       params[:metavalue].to_s
                      )
            contract_old_info.each do |old_entry|
                entry = params[:info].detect{|e| e[:metable_id] == old_entry[:metable_id]}
                if entry.blank?
                    MetaValue.find(old_entry[:id]).destroy
                else
                    already_existed_entries.push({
                        'metavalueid' => old_entry[:id],
                        'metable_id'  => old_entry[:metable_id]
                    })
                    new_entries = new_entries.select{|ne| ne[:metable_id] != old_entry[:metable_id]}
                end
            end
            new_entries = new_entries.map{|new_entry|
                meta = MetaValue.create!(
                    value:         params[:metavalue].to_s,
                    meta_field_id: contract_old_info[0][:meta_field_id],
                    metable_type:  contract_old_info[0][:metable_type],
                    metable_id:    new_entry[:metable_id],
                )
                if meta.save
                    new_entry[:metavalueid] = meta.id
                end
                new_entry
            }
            render json: {
                'metavalue' => params[:metavalue],
                'info'      => new_entries + already_existed_entries
            }
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def add_contract_reference #TODO: delete this method
        if check_right('add_contract_reference') #TODO: delete this right
            new_entries = params[:contract][:info]
            contract_num = params[:contract_num]
            contracts_add_info = MetaField.joins(:meta_type)
                .where("meta_types.metatype = 'reference' AND
                        meta_fields.name    = 'Contract ID'
                ")
            new_entries = new_entries.map{|new_entry|
                meta = MetaValue.create!(
                    value:         params[:contract_num].to_s,
                    meta_field_id: contracts_add_info[0][:id],
                    metable_type:  'Location',
                    metable_id:    new_entry[:metable_id],
                )
                if meta.save
                    new_entry[:metavalueid] = meta.id
                end
                new_entry
            }
            render json: {
                'metavalue' => contract_num,
                'info'      => new_entries
            }
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def destroy_contract_reference #TODO: delete this method
        if check_right('delete_contract_reference') #TODO: delete this right
            contract = MetaValue.find(params[:value])
            contract.destroy

            render json: {
                message: "Contract removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def delete_contract_reference(contract_id)
        contract = MetaValue.where("
                meta_values.value = #{contract_id}::varchar
            AND meta_values.metable_type = 'Location'
            AND meta_values.meta_field_id = #{Rails.configuration.contract_id}
        ")
        contract.destroy_all
    end

    def update_contract_meta(contract_id, locations, company)
        already_existed_entries = []
        new_entries = locations.map(&:clone)
        contract_old_info = MetaValue.where("
              meta_values.metable_type = 'Location'
          AND meta_values.meta_field_id = #{Rails.configuration.contract_id}
          AND meta_values.value = '#{contract_id}'
        ")
        contract_old_info.each do |old_entry|
            entry = locations.detect{|e| e[:id] == old_entry[:metable_id]}
            company_info = MetaValue.where("
                  meta_values.metable_type = 'Location'
              AND meta_values.meta_field_id = #{Rails.configuration.company_id}
              AND meta_values.metable_id = '#{entry.blank? ? old_entry[:metable_id] : entry[:id]}'
            ").first
            if entry.blank?
                unless company_info.blank?
                    company_info.destroy
                end
                old_entry.destroy
            else
                update_company_info(company_info, entry, company)
                already_existed_entries.push(entry)
                new_entries = new_entries.select{|ne| ne[:id] != old_entry[:metable_id]}
            end
        end
        new_entries = new_entries.map{|new_entry|
            meta = MetaValue.create!(
              value:         contract_id.to_s,
              meta_field_id: Rails.configuration.contract_id.to_i,
              metable_type:  'Location',
              metable_id:    new_entry[:id].to_i,
            )
            meta.save
            company_info = MetaValue.where("
                  meta_values.metable_type = 'Location'
              AND meta_values.meta_field_id = #{Rails.configuration.company_id}
              AND meta_values.metable_id = '#{new_entry[:id]}'
            ")
            update_company_info(company_info, new_entry, company)
            new_entry
        }
        new_entries + already_existed_entries
    end

    def file_dir_or_symlink_exists?(path_to_file)
        File.exist?(path_to_file) || File.symlink?(path_to_file)
    end

    def update_company_info(company_info, entry, company)
        if company_info.blank?
            MetaValue.create!(
              value:         company,
              meta_field_id: Rails.configuration.company_id.to_i,
              metable_type:  'Location',
              metable_id:    entry[:id].to_i,
              ).save
        else
            MetaValue.update(company_info[:id], { :value => company })
        end
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end
