require 'rails_helper'

RSpec.describe "ObjectTypesControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            object_type: {
                name: 'Old Object Type name'
            }
        }

        post '/api/v1/object_types', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @gid = json_body['id']
        params[:object_type][:name] = 'New Object Type name'

        put "/api/v1/object_types/#{@gid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Object Type name')

        get "/api/v1/object_types/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Object Type name')

        delete "/api/v1/object_types/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/object_types/#{@gid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end
end
