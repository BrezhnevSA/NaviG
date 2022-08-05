# implements rights: view_location_types, view_location_type, update_location_type, create_location_type, delete_location_type, 

module Api
    module V1
    end
end
class Api::V1::LocationTypesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_location_types')
            location_types = LocationType.all
            render json: location_types
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_location_type')
            location_type = LocationType.find(params[:id])
            render json: location_type
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_location_type')
            location_type = JSON.parse params[:location_type]

            location_type_updated = LocationType.update(params[:id], {
                :name => location_type['name'],
                :bg => location_type['bg'],
                :active => location_type['active'],
            });

            render json: location_type_updated

        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def create
        if check_right('create_location_type')
            location_type = JSON.parse params[:location_type]

            location_type_new = LocationType.create!({
                :name => location_type['name'],
                :bg => location_type['bg'],
                :active => location_type['active'],
            });
    
            if location_type_new.save
                render json: location_type_new
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
        if check_right('delete_location_type')
            location_type = LocationType.find(params[:id])
            location_type.destroy
        
            render json: {
                id: params[:id].to_i,
                message: "Location Type removed"
            }, status: :ok
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