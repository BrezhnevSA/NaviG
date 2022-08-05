# implements rights: view_buildings, view_one_building, update_building, create_building, delete_building

module Api
    module V1
    end
end
class Api::V1::BuildingsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_buildings') && !check_right('for_test_user_only')
            buildings = []
            Building.where("#{check_right('update_building') ? '' : "buildings.id != #{Rails.configuration.test_building_id}"}").each do |building|
                buildings.push(add_meta_to_building(building))
            end
            render json: buildings
        elsif check_right('view_buildings') && check_right('for_test_user_only')
            render json: [add_meta_to_building(Building.find(Rails.configuration.test_building_id))]
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_one_building') && !check_right('for_test_user_only') ||
          check_right('for_test_user_only') && params[:id].to_i == Rails.configuration.test_building_id
            building = Building.find(params[:id])
            render json: building
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_building')
            building_param = params[:building]

            building = Building.find(params[:id])
            
            if building.update(building_params)
                Floor.where("floors.building_id = #{building[:id]}").each do |floor|
                    floor.toggle!(:active)
                end
                render json: add_meta_to_building(building)
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
        if check_right('create_building')
            
            building_param = params[:building]
            
            building = Building.create!(
                name: building_param['name'],
                coords: building_param['coords'],
                active: building_param['active'],
                ord: building_param['ord'].to_i,
                office_id: building_param['office_id'],
                short_name: building_param['short_name'],
            )
    
            if building.save
                render json: building
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
        if check_right('delete_building')
            building = Building.find(params[:id])
            building.destroy
        
            render json: {
                id: params[:id].to_i,
                message: "Building removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def get_buildings_for_office
        if check_right('view_buildings')
            buildings = Building.where('office_id = (?)', params[:office_id]).all
            render json: buildings
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def building_params
        params.require(:building).permit(:id, :name, :coords, :active, :office_id, :ord, :short_name)
    end

    def add_meta_to_building(building)
        item = {}
        item["id"]         = building.id
        item["name"]       = building.name
        item["short_name"] = building.short_name
        item["office_id"]  = Office.not_exists?(building.office_id) ? nil : building.office_id
        item["coords"]     = building.coords
        item["ord"]        = building.ord
        item["active"]     = building.active
        item["meta_info"]  = Api::V1::MetaValuesController.new.match_values_to_fields("Building", "any", building.id)
        item
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end