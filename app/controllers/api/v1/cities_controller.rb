# implements rights: view_cities, view_one_city, update_city, create_city, delete_city

module Api
    module V1
    end
end
class Api::V1::CitiesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_cities') && !check_right('for_test_user_only')
            cities = []
            City.where("#{check_right('update_city') ? '' : "cities.id != #{Rails.configuration.test_city_id}"}").each do |city|
                cities.push(add_meta_to_city(city))
            end
            render json: cities
        elsif check_right('view_cities') && check_right('for_test_user_only')
            render json: [add_meta_to_city(City.find(Rails.configuration.test_city_id))]
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_one_city') && !check_right('for_test_user_only') ||
          check_right('for_test_user_only') && params[:id].to_i == Rails.configuration.test_city_id
            city = City.find(params[:id])
            render json: city
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_city')
            city = City.find(params[:id])
            
            if city.update(city_params)
                Office.where("offices.city_id = #{city[:id]}").each do |office|
                    office.toggle!(:active)
                    Building.where("buildings.office_id = #{office[:id]}").each do |building|
                        building.toggle!(:active)
                        Floor.where("floors.building_id = #{building[:id]}").each do |floor|
                            floor.toggle!(:active)
                        end
                    end
                end
                render json: add_meta_to_city(city)
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
        if check_right('create_city')
            city = City.new(city_params)
    
            if city.save
                render json: city
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
        if check_right('delete_city')
            city = City.find(params[:id])
            city.destroy            
        
            render json: {
                id: params[:id].to_i,
                message: "City removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def city_params
        params.require(:city).permit(:name, :ord, :active, :short_name)
    end

    private

    def add_meta_to_city(city)
        item = {}
        item["id"]           = city.id
        item["name"]         = city.name
        item["short_name"]   = city.short_name
        # item["contracts_id"] = city.contracts_id
        item["ord"]          = city.ord
        item["active"]       = city.active
        item["meta_info"]    = Api::V1::MetaValuesController.new.match_values_to_fields("City", "any", city.id)
        item
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end