# implements rights: view_floors_configs, view_floors_config, update_floors_config, create_floors_config, delete_floors_config, 

module Api
    module V1
    end
end
class Api::V1::FloorsConfigsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_floors_configs')
            floors_configs = FloorsConfig.all
            render json: floors_configs
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_floors_config')
            floors_config = FloorsConfig.find(params[:id])
            render json: floors_config
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_floors_config')
            floors_config = FloorsConfig.find(params[:id])
            
            if floors_config.update(floors_config_params)
                render json: floors_config
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
        if check_right('create_floors_config')
            floors_config = FloorsConfig.new(floors_config_params)
    
            if floors_config.save
                render json: floors_config
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
        if check_right('delete_floors_config')
            floors_config = FloorsConfig.find(params[:id])
            floors_config.destroy
        
            render json: {
                message: "Floors Config removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def floors_config_params
        params.require(:floors_config).permit(:plan, :preview, :parameters)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end