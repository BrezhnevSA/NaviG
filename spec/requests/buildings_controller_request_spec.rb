require 'rails_helper'

RSpec.describe "BuildingsControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            building: {
                name: 'Old Office name',
                office_id: 1
            }
        }

        post '/api/v1/buildings', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @bid = json_body['id']
        params[:building][:name] = 'New Office name'

        put "/api/v1/buildings/#{@bid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Office name')

        get "/api/v1/buildings/#{@bid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Office name')

        delete "/api/v1/buildings/#{@bid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/buildings/#{@bid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

    it 'should give all buildings' do
        get "/api/v1/buildings", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body).not_to be_empty
    end

    it 'should give buildings in office' do
        get "/api/v1/cob/buildings/1", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body).not_to be_empty
    end
end
