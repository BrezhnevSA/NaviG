# implements rights: view_meta_types, view_meta_type, update_meta_type, create_meta_type, delete_meta_type, 

module Api
    module V1
    end
end
class Api::V1::MetaTypesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_meta_types')
            meta_types = MetaType.all
            render json: meta_types
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_meta_type')
            meta_type = MetaType.find(params[:id])
            render json: meta_type
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_meta_type')
            meta_type = MetaType.find(params[:id])
            
            if meta_type.update(meta_type_params)
                render json: meta_type
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
        if check_right('create_meta_type')
            meta_type = MetaType.new(meta_type_params)
    
            if meta_type.save
                render json: meta_type
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
        if check_right('delete_meta_type')
            meta_type = MetaType.find(params[:id])
            meta_type.destroy
        
            render json: {
                message: "Locations removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def meta_type_params
        params.require(:meta_type).permit(:name, :metatype)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end
