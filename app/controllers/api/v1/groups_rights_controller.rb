# implements rights: view_grouprights, view_groupright, update_groupright, create_groupright, delete_groupright, 

module Api
    module V1
    end
end
class Api::V1::GroupsRightsController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_grouprights')
            grouprights = GroupsRight.all
            render json: grouprights
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_groupright')
            groupright = GroupsRight.find(params[:id])
            render json: groupright
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_groupright')
            groupright = GroupsRight.find(params[:id])
            
            if groupright.update(groupright_params)
                render json: groupright
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
        if check_right('create_groupright')
            groupright = GroupsRight.new(groupright_params)
    
            if groupright.save
                render json: groupright
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
        if check_right('delete_groupright')
            message = "Groups Right removed"

            groupright = GroupsRight.find(params[:id]) rescue nil
            if groupright.blank?
                message = "Groups Right has been already removed"
            else
                groupright.destroy
            end

            render json: {
                id:      params[:id],
                message: message
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def add_groups_rights
        if check_right('create_groupright')
            grouprights = params[:grouprights]
            grouprights_created = []
            grouprights.each do |groupright|
                groupright_found = GroupsRight.find_by(
                  right_id: groupright['right_id'],
                  group_id: groupright['group_id']
                )
                if groupright_found.blank?
                    grouprights_created.push(GroupsRight.create!(
                      right_id: groupright['right_id'],
                      group_id: groupright['group_id']
                    ))
                end
            end
            render json: grouprights_created
        else
            render json: {
              message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def delete_groups_rights
        if check_right('delete_groupright')
            message = "Groups Rights removed"
            ids = params[:ids]

            ids.each do |id|
                groupright = GroupsRight.find(id) rescue nil
                if groupright.blank?
                    message = "Groups Rights has been already removed"
                else
                    groupright.destroy
                end
            end

            render json: {
              ids:     ids,
              message: message
            }, status: :ok
        else
            render json: {
              message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def groupright_params
        params.require(:groupright).permit(:group_id, :right_id)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end
