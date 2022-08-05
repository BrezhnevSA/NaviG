require 'rails_helper'

RSpec.describe "EmployeesControllers", type: :request do

    it 'should give all employees' do
        get "/api/v1/employees", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body).not_to be_empty
    end

    it 'should give information about user' do
        get "/api/v1/employees/#{AuthHelper::UID}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['email']).to eq(AuthHelper::EMAIL)
    end

    it 'should update user account' do
        params = {
            employee: {
                info: 'Employee Info'
            }
        }

        put "/api/v1/employees/#{AuthHelper::UID}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['info']).to eq('Employee Info')
    end

end
