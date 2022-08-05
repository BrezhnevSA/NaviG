# implements rights: view_employees_adds, view_employees_add, update_employees_add, update_own_employees_add

module Api
    module V1
    end
end
class Api::V1::EmployeesAddsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_employees_adds')
            employees_adds = EmployeesAdd.all
            render json: employees_adds
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_employees_add')
            employees_add = EmployeesAdd.find(params[:id])
            render json: employees_add
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if (check_right('update_employees_add') || (check_right('update_own_employees_add') && (@current_user.id === id)))
            employees_add = EmployeesAdd.find(params[:id])
            
            if employees_add.update(employees_add_params)
                render json: employees_add
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

    def employees_add_params
        params.require(:employees_add).permit(:phone, :info)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end