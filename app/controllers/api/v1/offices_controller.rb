# implements rights: view_offices, view_office, update_office, create_office, delete_office, 

module Api
    module V1
    end
end
class Api::V1::OfficesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_offices') && !check_right('for_test_user_only')
            offices = []
            Office.where("#{check_right('update_office') ? '' : "offices.id != #{Rails.configuration.test_office_id}"}").each do |office|
                offices.push(add_meta_to_office(office))
            end
            render json: offices
        elsif check_right('view_offices') && check_right('for_test_user_only')
            render json: [add_meta_to_office(Office.find(Rails.configuration.test_office_id))]
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_office') && !check_right('for_test_user_only') ||
          check_right('for_test_user_only') && params[:id].to_i == Rails.configuration.test_office_id
            office = Office.find(params[:id])
            render json: office
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_office')
            office = Office.find(params[:id])
            
            if office.update(office_params)
                Building.where("buildings.office_id = #{office[:id]}").each do |building|
                    building.toggle!(:active)
                    Floor.where("floors.building_id = #{building[:id]}").each do |floor|
                        floor.toggle!(:active)
                    end
                end
                render json: add_meta_to_office(office)
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
        if check_right('create_office')
            office = Office.new(office_params)
    
            if office.save
                render json: add_meta_to_office(office)
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
        if check_right('delete_office')
            office = Office.find(params[:id])
            office.destroy
        
            render json: {
                id: params[:id].to_i,
                message: "Office removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def get_offices_for_city
        if check_right('view_offices')
            offices = Office.where('city_id = (?)', params[:city_id]).all
            render json: offices
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def office_params
        params.require(:office).permit(:name, :ord, :city_id, :address, :image, :active, :short_name)
    end

    def add_meta_to_office(office)
        item = {}
        item["id"]        = office.id
        item["name"]      = office.name
        item["short_name"]= office.short_name
        item["address"]   = office.address
        item["image"]     = office.image
        item["city_id"]   = City.not_exists?(office.city_id) ? nil : office.city_id
        item["ord"]       = office.ord
        item["active"]    = office.active
        item["meta_info"] = Api::V1::MetaValuesController.new.match_values_to_fields("Office", "any", office.id)
        item
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end
end
