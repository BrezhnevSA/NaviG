require 'rails_helper'

RSpec.describe "CitiesControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            city: {
                name: 'Old City name'
            }
        }

        post '/api/v1/cities', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @cid = json_body['id']
        params[:city][:name] = 'New City name'

        put "/api/v1/cities/#{@cid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old City name')

        get "/api/v1/cities/#{@cid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New City name')

        delete "/api/v1/cities/#{@cid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/cities/#{@cid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

    it 'should give all cities' do
        get "/api/v1/cities", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body).not_to be_empty
    end
end
