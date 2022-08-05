require 'rails_helper'

RSpec.describe "RightsControllers", type: :request do

    it 'have CRUD functionality' do
        new_name = 'Old Right Name'
        params = {
            right: {
                name: new_name,
                description: 'Right Description',
                machine_name: 'right_machine_name'
            }
        }

        post '/api/v1/rights', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @rid = json_body['id']
        params[:right][:name] = 'New Right Name'

        put "/api/v1/rights/#{@rid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).not_to eq(new_name)

        get "/api/v1/rights/#{@rid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['name']).to eq('New Right Name')

        delete "/api/v1/rights/#{@rid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/rights/#{@rid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

end
