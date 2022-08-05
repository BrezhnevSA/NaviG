# implements rights: view_meta_maps, view_meta_map, update_meta_map, create_meta_map, delete_meta_map, 

module Api
    module V1
    end
end
class Api::V1::MetaMapsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_meta_maps')
            meta_maps = MetaMap.all
            render json: meta_maps
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_meta_map')
            meta_map = MetaMap.find(params[:id])
            render json: meta_map
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_meta_map')
            meta_map = MetaMap.find(params[:id])
            
            if meta_map.update(meta_map_params)
                render json: meta_map
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
        if check_right('create_meta_map')
            meta_map = MetaMap.new(meta_map_params)
    
            if meta_map.save
                render json: meta_map
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
        if check_right('delete_meta_map')
            meta_map = MetaMap.find(params[:id])
            meta_map.destroy
        
            render json: {
                message: "Locations removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def meta_map_params
        params.require(:meta_map).permit(:entity_type, :entity_subtype_id, :meta_field_id, :active, :show_in_management)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end
