# implements rights: view_object_types, view_object_type, update_object_type, create_object_type, delete_object_type, 

module Api
    module V1
    end
end
class Api::V1::ObjectTypesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_object_types')
            object_types = ObjectType.order(:name).all
            render json: object_types
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_object_type')
            object_type = ObjectType.find(params[:id])
            render json: object_type
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_object_type')
            object_type = params[:object_type]

            filename = ''
            old_object_type = ObjectType.find(params[:id])
            if object_type['new_icon'].nil?
                filename = old_object_type['icon']
            else
                data_img = object_type['new_icon']

                header, data = data_img.split(',')
                img_type = header.match(/image\/([a-z\\+]{1,11});/)[1]
                img_type = img_type == "svg+xml" ? "svg" : img_type
                filename = "object_type_#{object_type['id']}.#{img_type}"
                file_path = "img/editor-icons/objects/" + filename
                File.open(Rails.root.join('public', file_path), 'wb') do |f|
                    f.write(Base64.decode64(data.gsub(/.*base64,/, '')))
                end

            end

            object_type_updated = ObjectType.update(params[:id], {
                :name => object_type['name'],
                :icon => filename,
                :active => object_type['active'],
                :rotatable => object_type['rotatable'],
                :resizable => object_type['resizable'],
                
            });

            render json: object_type_updated
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def create
        if check_right('create_object_type')
            object_type = params[:object_type]
            
            filename = ''

            object_type_new = ObjectType.create!({
                :name => object_type['name'],
                :icon => filename,
                :active => object_type['active'],
                :rotatable => object_type['rotatable'],
                :resizable => object_type['resizable'],
            });
            
            unless object_type['new_icon'].nil?
            
                data_img = object_type['new_icon']

                header, data = data_img.split(',')
                img_type = header.match(/image\/([a-z]{1,11});/)[1]
                filename = "/object_type_#{object_type_new['id']}.#{img_type}"
                file_path = "img/editor-icons/objects/" + filename
                File.open(Rails.root.join('public', file_path).to_s, 'wb') do |f|
                    f.write(Base64.decode64(data.gsub(/.*base64,/, '')))
                end
                object_type_new = ObjectType.update(object_type_new['id'], {
                    :icon => filename,
                });
            end
    
            render json: object_type_new
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def destroy
        if check_right('delete_object_type')
            object_type = ObjectType.find(params[:id])
            object_type.destroy
        
            render json: {
                id: params[:id].to_i,
                message: "Floors Config removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def object_type_params
        params.require(:object_type).permit(:name, :icon, :active)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end