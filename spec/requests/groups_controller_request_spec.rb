require 'rails_helper'

RSpec.describe "GroupsControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            group: {
                name: 'Old Group name'
            }
        }

        post '/api/v1/groups', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @gid = json_body['id']
        params[:group][:name] = 'New Group name'

        put "/api/v1/groups/#{@gid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq('Old Group name')

        get "/api/v1/groups/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Group name')

        delete "/api/v1/groups/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/groups/#{@gid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end
end
