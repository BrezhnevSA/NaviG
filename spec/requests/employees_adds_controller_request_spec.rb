require 'rails_helper'

RSpec.describe "EmployeesAddsControllers", type: :request do

    it 'has read/update functionality' do
        params = {
            employees_add: {
                info: 'Additional info'
            }
        }

        ead = EmployeesAdd.where('employee_id = (?)', AuthHelper::UID).first
        ead_id = ead['id']

        put "/api/v1/employees_adds/#{ead_id}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        get "/api/v1/employees_adds/#{ead_id}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['info']).to eq('Additional info')
    end
end
