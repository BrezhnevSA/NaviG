require 'rails_helper'

RSpec.describe "PositionsControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            position: {
                name: 'Old Position name'
            }
        }

        post '/api/v1/positions', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @pid = json_body['id']
        params[:position][:name] = 'New Position name'

        put "/api/v1/positions/#{@pid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Position name')

        get "/api/v1/positions/#{@pid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Position name')

        delete "/api/v1/positions/#{@pid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/positions/#{@pid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

end
