# implements rights: view_meta_fields, view_meta_field, update_meta_field, create_meta_field, delete_meta_field, 

module Api
    module V1
    end
end
class Api::V1::MetaFieldsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_meta_fields')
            meta_fields = MetaField.all
            render json: meta_fields
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_meta_field')
            meta_field = MetaField.find(params[:id])
            render json: meta_field
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_meta_field')
            meta_field = MetaField.find(params[:id])
            
            if meta_field.update(meta_field_params)
                render json: meta_field
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
        if check_right('create_meta_field')
            meta_field = MetaField.new(meta_field_params)
    
            if meta_field.save
                render json: meta_field
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
        if check_right('delete_meta_field')
            meta_field = MetaField.find(params[:id])
            meta_field.destroy
        
            render json: {
                message: "Locations removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def meta_field_params
        params.require(:meta_field).permit(:name, :meta_type_id)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end
