# implements rights: view_rights, view_right, update_right, create_right, delete_right, 

module Api
    module V1
    end
end
class Api::V1::RightsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_rights')
            rights = Right.all
            render json: rights
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_right')
            right = Right.find(params[:id])
            render json: right
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_right')
            right = Right.find(params[:id])
            
            if right.update(right_params)
                render json: right
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
        if check_right('create_right')
            right = Right.new(right_params)
    
            if right.save
                render json: right
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
        if check_right('delete_right')
            right = Right.find(params[:id])
            right.destroy
        
            render json: {
                message: "Right removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def get_rights_for_user(employee_id)
        Role.joins(
                "LEFT JOIN groups_rights ON groups_rights.group_id = roles.group_id",
                "left join rights ON rights.id = groups_rights.right_id"
            )
            .where("
                roles.rolable_id = (:employee_id)
            AND roles.rolable_type = 'Employee'",
                { employee_id: employee_id }
            ).select("
                rights.id as id, rights.machine_name as machine_name,
                rights.name as name, roles.group_id as group_id
            ")
    end

    def right_params
        params.require(:right).permit(:name, :description, :machine_name)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end
end
