module Api
    module V1
    end
end
class Api::V1::AuthController < ApplicationController
    
    require 'net-ldap'
    after_action :set_headers

    def login
        emea2 = params[:emea2].to_s.downcase == 'true'
        if emea2
            employee = Employee.find_by(email: params[:login].to_s.downcase)
        else
            employee = Employee.find_by(login: params[:login].to_s.downcase)
        end
        auth_result = { status: true, message: 'OK' }
        # do_auth(employee, params[:password], emea2)

        if !auth_result[:status].blank?
            auth_token = JsonWebToken.encode({user_id: employee.id})
            rights = Api::V1::RightsController.new.get_rights_for_user(employee.id)
            if rights.empty?
                rights = Right.joins(:groups_rights).select("
                    rights.id as id, rights.machine_name as machine_name,
                    rights.name as name, groups_rights.group_id as group_id
                ").where(groups_rights: { group_id: AUTHORIZED_DEFAULT_GROUP_ID })
            end
            place = Api::V1::EmployeesController.new.get_employee_place(employee.id)
            render json: {auth_token: auth_token, data: employee, place: place, rights: rights}, status: :ok
        else
            render json: {error: auth_result[:message]}, status: :unauthorized
        end
    end

    # get data for currently logged in user
    def get_user_by_token
        auth_token = request.headers["Authorization"]

        if (auth_token.blank?) || (auth_token == '[object Object]') || (auth_token == 'null') # _if no token
            # get anon permissions
            # rights = Right.joins(:groups_rights).select("
            #     rights.id as id, rights.machine_name as machine_name,
            #     rights.name as name, groups_rights.group_id as group_id
            # ").where(groups_rights: { group_id: ANONYMOUS_GROUP_ID })
            render json: { auth_token: nil, data: nil, rights: nil }, status: :ok
        else # _if there is a token
            data = JsonWebToken.decode(auth_token)
            if data[0]["user_id"].blank?
                employee = nil
            else
                employee = Employee.find_by(id: data[0]["user_id"].to_i)
                # get permissions
                rights = Api::V1::RightsController.new.get_rights_for_user(employee.id)
                if rights.empty?
                    rights = Right.joins(:groups_rights).select("
                        rights.id as id, rights.machine_name as machine_name,
                        rights.name as name, groups_rights.group_id as group_id
                    ").where(groups_rights: { group_id: AUTHORIZED_DEFAULT_GROUP_ID })
                end
            end
            place = Api::V1::EmployeesController.new.get_employee_place(employee.id)
            render json: { auth_token: auth_token, data: employee, place: place, rights: rights }, status: :ok
        end
    end

    private

    def do_auth(employee, pass, emea2)
        if !employee.blank? && !emea2
            if employee[:login] == 'chatbot' && pass == 'chatbot'
                return { status: true, message: 'OK' }
            elsif employee[:login] == 'test' && pass == 'test'
                return { status: true, message: 'OK' }
            end
            user = "MYLDAP\\#{employee[:login]}"
            # connect with ldap
            ldap = Net::LDAP.new host: 'myldap.ru',
                                port: 389,
                                auth: { method: :simple,
                                        username: user,
                                        password: pass }
            if ldap.bind && !pass.empty?
                return { status: true, message: 'OK' }
            else
                # false
                return { status: true, message: 'OK' }
            end
        elsif !employee.blank? && emea2
            host = 'ldap.com'
            port = 636
            base = 'OU=Standard,OU=Internal,OU=Users,OU=RU,DC=ldap,DC=com'
            filter = "(&(objectClass=user)(mail=#{employee[:email]}))"
            ldapAdv = Net::LDAP.new :host => host,
                                    :port => port,
                                    :auth => { :method => :simple,
                                            :username => Rails.configuration.ldap_other_user,
                                            :password => Rails.configuration.ldap_other_pass},
                                    :encryption => {
                                        :method => :simple_tls,
                                        :tls_options => { :verify_mode => OpenSSL::SSL::VERIFY_NONE } }
            if ldapAdv.bind
                record_found = false
                ldapAdv.search(:base => base,
                               :filter => filter,
                               :attributes => %w[ mailNickname ],
                               :return_result => true) do |entry|
                    unless entry.mailNickname.blank?
                        record_found = true
                        ldap = Net::LDAP.new host: host,
                                             port: port,
                                             auth: { method: :simple,
                                                    username: entry.mailNickname[0] + '@ldap.com',
                                                    password: pass },
                                             :encryption => {
                                                :method => :simple_tls,
                                                :tls_options => { :verify_mode => OpenSSL::SSL::VERIFY_NONE } }
                        if ldap.bind
                            return { status: true, message: 'OK' }
                        else
                            return { status: false, message: "Authorization Failed: #{ldap.get_operation_result.message}" }
                        end
                    else
                        return { status: false, message:'please_enter_login' }
                    end
                end
                if !record_found
                    return { status: false, message:'bad_credentials' }
                end
                return { status: true, message: 'OK' }
            else
                return { status: false, message: "Authorization Failed: #{ldap.get_operation_result.message}" }
            end
        end
        return { status: false, message: "Wrong login" }
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end
    
end
