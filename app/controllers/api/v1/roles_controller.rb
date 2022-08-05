# implements rights: view_roles, view_role, update_role, create_role, delete_role, 

module Api
    module V1
    end
end
class Api::V1::RolesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_roles')
            roles = Role.all
            render json: roles
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_role')
            role = Role.find(params[:id])
            render json: role
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def update
        if check_right('update_role')
            role = Role.find(params[:id])
            
            if role.update(role_params)
                render json: role
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
        if check_right('create_role')
            role = Role.new(role_params)
    
            if role.save
                render json: role
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
        if check_right('delete_role')
            message = "Role removed"
            role = Role.find(params[:id]) rescue nil
            if role.blank?
                message = "Groups Right has been already removed"
            else
                role.destroy
            end
        
            render json: {
                id: params[:id],
                message: message
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def delete_roles_by_rolable_id
        if check_right('delete_role')
            message = "Roles removed"
            rolable_ids = params[:ids].split(',')
            group_id  = params[:group_id].to_i
            rolable_type = params[:rolable_type]

            if rolable_ids.blank?
                message = "No rolable ids in params set, nothing to delete."
            elsif group_id.blank?
                message = "Group id isn't set in params."
            else
                rolable_ids.each do |rolable_id|
                    role = Role.find_by(
                        rolable_id:   rolable_id.to_i,
                        group_id:     group_id,
                        rolable_type: rolable_type
                    ) rescue nil
                    if role.blank?
                        message = "One of the list of roles(rolable_id=#{rolable_id}, group_id=#{group_id}) has been already removed."
                    else
                        role.destroy
                    end
                end
            end

            render json: {
                ids: params[:ids],
                message: message
            }, status: :ok
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def add_roles(rolable_ids, group_id, rolable_type)
        if rolable_ids.blank? || group_id.blank? || rolable_type.blank?
            return {message: "One of required params isn't set.", status: 0}
        else
            rolable_ids.each do |rolable_id|
                role = Role.find_by(
                    rolable_id:   rolable_id.to_i,
                    rolable_type: rolable_type
                ) rescue nil
                if role.blank?
                    Role.create!(
                        group_id:     group_id,
                        rolable_type: rolable_type,
                        rolable_id:   rolable_id
                    )
                else
                    role.update(group_id: group_id, rolable_type: rolable_type, rolable_id: rolable_id)
                end
            end
            return {message: "Roles added", status: 1}
        end
    end

    def update_roles(rolable_ids, group_id, rolable_type)
        if rolable_ids.blank? || group_id.blank? || rolable_type.blank?
            return {message: "One of required params isn't set.", status: 0}
        else
            Role.where('
                    roles.group_id = (:group_id)
                AND roles.rolable_id NOT IN (:ids)
                AND roles.rolable_type = (:rolable_type)',
                { group_id: group_id, ids: rolable_ids, rolable_type: rolable_type }
            ).delete_all
            rolable_ids.each do |rolable_id|
                role = Role.find_by(rolable_id: rolable_id.to_i) rescue nil
                if role.blank?
                    Role.create!(
                        group_id:     group_id,
                        rolable_type: rolable_type,
                        rolable_id:   rolable_id
                    )
                else
                    role.update(group_id: group_id, rolable_type: rolable_type, rolable_id: rolable_id)
                end
            end
            return {message: "Roles added", status: 1}
        end
    end

    def role_params
        params.require(:role).permit(:group_id, :rolable_type, :rolable_id)
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end
end
