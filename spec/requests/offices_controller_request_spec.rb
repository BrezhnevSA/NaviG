require 'rails_helper'

RSpec.describe "OfficesControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            office: {
                name: 'Old Office name',
                city_id: 1
            }
        }

        post '/api/v1/offices', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @oid = json_body['id']
        params[:office][:name] = 'New Office name'

        put "/api/v1/offices/#{@oid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Office name')

        get "/api/v1/offices/#{@oid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Office name')

        delete "/api/v1/offices/#{@oid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/offices/#{@oid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

    it 'should give all offices' do
        get "/api/v1/offices", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body).not_to be_empty
    end

    it 'should give offices in city' do
        get "/api/v1/cob/offices/1", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body).not_to be_empty
    end
end
