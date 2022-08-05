require 'rails_helper'

RSpec.describe "RolesControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            role: {
                group_id: 2,
                rolable_id: 1,
                rolable_type: 'Employee'
            }
        }

        post '/api/v1/roles', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @rid = json_body['id']
        params[:role][:rolable_type] = 'Position'

        put "/api/v1/roles/#{@rid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['rolable_type']).not_to eq('Employee')

        get "/api/v1/roles/#{@rid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['rolable_type']).to eq('Position')

        delete "/api/v1/roles/#{@rid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/roles/#{@rid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

    it 'should remove multiple roles with array of params' do
        group_id = 2
        rolable_type = 'Employee'

        new_role = Role.create!(
            group_id:     group_id,
            rolable_type: rolable_type,
            rolable_id:   AuthHelper::UID
        )

        ids = "[#{AuthHelper::UID}]"
        
        delete "/api/v1/roles?ids=#{ids}&group_id=#{group_id}&rolable_type=#{rolable_type}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        get "/api/v1/roles/#{new_role['id']}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end
end
