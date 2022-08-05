class ApplicationController < ActionController::API

    require 'json_web_token'

    ANONYMOUS_GROUP_ID = 1
    AUTHORIZED_DEFAULT_GROUP_ID = 7
    FLOOR_EDIT_LOCK_MINS = 5

    TV_TOKEN = 'token'

    TECH_COSTCETNERS_LIST = (0..1000).to_a.map{|i|
        {
          "id"=>"#{9000000 - i}",
          "type"=>"costcenters",
          "attributes"=>{
            "number"=>9000000 + i,
            "name"=>"Parking Costcenter #{i}"},
          "relationships"=>{
            "owner"=>{
              "data"=>{
                "id"=>0,
                "acc-id"=>0,
                "wiw"=>"",
                "full-name"=>""
              }
            }
          }
        }
    } + [{
      "id"=>"0000000",
      "type"=>"costcenters",
      "attributes"=>{
        "number"=>0000000,
        "name"=>"Test Costcenter"},
      "relationships"=>{
        "owner"=>{
          "data"=>{
            "id"=>0,
            "acc-id"=>0,
            "wiw"=>"",
            "full-name"=>""
          }
        }
      }
    }]
    protected
    # Validates the token and user and sets the @current_user scope
    def authenticate_request!
        if !payload || !JsonWebToken.valid_payload(payload.first)
            return invalid_authentication
        end

        load_current_user!
        invalid_authentication unless @current_user
    end

    # Returns 401 response. To handle malformed / invalid requests.
    def invalid_authentication
        render json: {error: 'Invalid Request'}, status: :unauthorized
    end

    private
    # Deconstructs the Authorization header and decodes the JWT token.
    def payload
        auth_header = request.headers['Authorization']
        token = auth_header.split(' ').last
        JsonWebToken.decode(token)
    rescue
        nil
    end

    # Sets the @current_user with the user_id from payload
    def load_current_user!
        unless payload.nil?
            @current_user = Employee.find_by(id: payload[0]['user_id'])
        else
            @current_user = nil
        end
        @current_user
    end

    def has_position_right?(right, employee=nil)
        user_id = !@current_user.blank? ? @current_user.id : employee.nil? ? payload[0]['user_id'] : employee.id
        right_ = Right.joins(:groups_rights => [{:group => :roles}])
            .where(rights: { machine_name: right }, roles: { rolable_id: Employee.find(user_id).position_id, rolable_type: 'Position' })
        if right_.length.zero?
            right_ = Right.joins(:groups_rights)
                .where(rights: { machine_name: right }, groups_rights: { group_id: AUTHORIZED_DEFAULT_GROUP_ID })
        end
        !right_.length.zero?
    end

    def has_user_right?(right, employee=nil)
        user_id = !@current_user.blank? ? @current_user.id : employee.nil? ? payload[0]['user_id'] : employee.id
        right_ = Right.joins(:groups_rights => [{:group => :roles}])
            .where(rights: { machine_name: right }, roles: { rolable_id: user_id, rolable_type: 'Employee' })
        if right_.length.zero?
            right_ = Right.joins(:groups_rights)
                .where(rights: { machine_name: right }, groups_rights: { group_id: AUTHORIZED_DEFAULT_GROUP_ID })
        end
        !right_.length.zero?
    end

    def check_right(right, employee=nil)
        if !@current_user.nil? || !payload.nil? || !employee.nil?
            has_position_right?(right, employee) || has_user_right?(right, employee)
        end
    end

    protected

    def ask_centra_for(entity, parameters = {})
        # uri = URI "https://centra.t-systems.ru/#{entity}"
        # uri += "?#{parameters.map { |k, v| "#{k}=#{v}" }.join('&')}" unless parameters.empty?
        # req = Net::HTTP::Get.new uri
        # token = 'c57cc9d025edec041b58e93645c91cb9770b2d0b5b0c9ad6c65a787247c53126'
        # version = '1'
        # req['Authorization'] = "Token token=\"#{token}\""
        # req['Accept'] = "application/vnd.api+json; version=#{version}"
        # res = Net::HTTP.start(uri.host,
        #                     uri.port,
        #                     use_ssl: uri.scheme == 'https',
        #                     verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
        # http.request(req)
        # end
        # JSON.parse(res.body)['data'] +
         TECH_COSTCETNERS_LIST
    end

    # def get_project_data(id = nil)

    #     if (id.nil?)
    #         uri = URI("tvi/projects")
    #     else
    #         uri = URI("tv/projects/#{project_id}")
    #     end

    #     res = nil
    #     Net::HTTP.start(uri.host, uri.port,
    #     :use_ssl => uri.scheme == 'https', 
    #     :verify_mode => OpenSSL::SSL::VERIFY_NONE) do |http|
    #         request = Net::HTTP::Get.new uri
    #         request['Authorization'] = "Bearer " + TV_TOKEN
    #         request['verify_mode'] = OpenSSL::SSL::VERIFY_NONE
    #         res = http.request request # Net::HTTPResponse object
    #     end

    #     JSON.parse(res.body)

    # end

end
