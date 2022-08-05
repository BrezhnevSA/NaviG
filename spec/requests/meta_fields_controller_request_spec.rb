require 'rails_helper'

RSpec.describe "MetaFieldsControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            meta_field: {
                name: 'Old Meta Field name',
                meta_type_id: 1
            }
        }

        post '/api/v1/meta_fields', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @mid = json_body['id']
        params[:meta_field][:name] = 'New Meta Field name'

        put "/api/v1/meta_fields/#{@mid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Meta Field name')

        get "/api/v1/meta_fields/#{@mid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Meta Field name')

        delete "/api/v1/meta_fields/#{@mid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/meta_fields/#{@mid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end
end
