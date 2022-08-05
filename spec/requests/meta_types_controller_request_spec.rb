require 'rails_helper'

RSpec.describe "MetaTypesControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            meta_type: {
                name: 'Old Meta Type Name',
                metatype: 'meta_name'
            }
        }

        post '/api/v1/meta_types', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @mid = json_body['id']
        params[:meta_type][:name] = 'New Meta Type Name'

        put "/api/v1/meta_types/#{@mid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Meta Type Name')

        get "/api/v1/meta_types/#{@mid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Meta Type Name')

        delete "/api/v1/meta_types/#{@mid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/meta_types/#{@mid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end
end
