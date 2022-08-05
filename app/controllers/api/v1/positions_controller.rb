# implements rights: view_positions, view_position, update_position, create_position, delete_position, 

module Api
    module V1
    end
end
class Api::V1::PositionsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_positions')
            position = Position.all
            render json: position
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_position')
            position = Position.find(params[:id])
            render json: position
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_position')
            position = Position.find(params[:id])
            
            if position.update(position_params)
                render json: position
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
        if check_right('create_position')
            position = Position.new(position_params)
    
            if position.save
                render json: position
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
        if check_right('delete_position')
            position = Position.find(params[:id])
            position.destroy
        
            render json: {
                message: "Position removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def position_params
        params.require(:position).permit(:name)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end

