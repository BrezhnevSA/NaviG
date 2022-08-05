# implements rights: view_groups, view_group, update_group, create_group, delete_group, 

module Api
    module V1
    end
end
class Api::V1::GroupsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_groups')
            groups = Group.all
            render json: groups
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_group')
            group = Group.find(params[:id])
            render json: group
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_group') && check_right('create_role') && check_right('update_role')
            group = Group.find(params[:id])
            if group.update(group_params)
                Api::V1::RolesController.new.update_roles(params[:ids], group.id, params[:rolable_type])
                render json: group
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
        if check_right('create_group') && check_right('create_role') && check_right('update_role')
            group = Group.new(group_params)
            if group.save
                Api::V1::RolesController.new.add_roles(params[:ids], group.id, params[:rolable_type])
                render json: group
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
        if check_right('delete_group')
            group = Group.find(params[:id])
            group.destroy
        
            render json: {
                message: "Group removed"
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def group_params
        params.require(:group).permit(:name)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end

