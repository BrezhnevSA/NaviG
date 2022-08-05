require 'rails_helper'

RSpec.describe "MetaMapsControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            meta_map: {
                meta_field_id: 1,
                entity_subtype_id: 1,
                entity_type: 'Old Meta Map Type',
                active: false
            }
        }

        post '/api/v1/meta_maps', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @mid = json_body['id']
        params[:meta_map][:entity_type] = 'New Meta Map Type'

        put "/api/v1/meta_maps/#{@mid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['entity_type']).not_to eq('Old Meta Map Type')

        get "/api/v1/meta_maps/#{@mid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['entity_type']).to eq('New Meta Map Type')

        delete "/api/v1/meta_maps/#{@mid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/meta_maps/#{@mid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end
end
