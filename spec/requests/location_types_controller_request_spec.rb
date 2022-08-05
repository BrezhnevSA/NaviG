require 'rails_helper'

RSpec.describe "LocationTypesControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            location_type: {
                name: 'Old Location Type name',
                bg: "/packs/media/textures/final_corridor-3d2e9545.jpg"
            }.to_json
        }
        
        post '/api/v1/location_types', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @gid = json_body['id']
        params = {
            location_type: {
                name: 'New Location Type name',
                bg: "/packs/media/textures/final_corridor-3d2e9545.jpg"
            }.to_json
        }

        put "/api/v1/location_types/#{@gid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Location Type name')

        get "/api/v1/location_types/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Location Type name')

        delete "/api/v1/location_types/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/location_types/#{@gid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end
end
